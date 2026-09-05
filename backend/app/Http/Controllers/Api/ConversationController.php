<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\CannedReply;
use App\Models\Customer;

class ConversationController extends BaseApiController
{
    /**
     * List all conversations with filters, search, and status counts.
     */
    public function index(Request $request): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $workspaceId = $workspace->id;
        $filter = $request->get('filter', 'all');
        $search = $request->get('search');

        $query = Conversation::with(['customer', 'messages' => function ($q) {
                $q->latest()->limit(1);
            }])
            ->where('workspace_id', $workspaceId);

        if ($filter === 'unhandled' || $filter === 'open') {
            $query->where(function ($q) {
                $q->where('status', 'open')
                  ->orWhere('status', 'human_handling')
                  ->orWhere('is_escalated', true)
                  ->orWhere('is_bot_paused', true);
            });
        } elseif ($filter === 'escalated') {
            $query->where(function ($q) {
                $q->where('is_escalated', true)
                  ->orWhere('is_bot_paused', true)
                  ->orWhere('status', 'human_handling');
            });
        } elseif ($filter === 'resolved') {
            $query->where('status', 'resolved');
        }

        if (!empty($search)) {
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $conversations = $query->orderByDesc('updated_at')->paginate(30);

        $filterCounts = [
            'all'       => Conversation::where('workspace_id', $workspaceId)->count(),
            'unhandled' => Conversation::where('workspace_id', $workspaceId)
                ->where(function ($q) {
                    $q->where('status', 'open')
                      ->orWhere('status', 'human_handling')
                      ->orWhere('is_escalated', true)
                      ->orWhere('is_bot_paused', true);
                })->count(),
            'escalated' => Conversation::where('workspace_id', $workspaceId)
                ->where(function ($q) {
                    $q->where('is_escalated', true)
                      ->orWhere('is_bot_paused', true)
                      ->orWhere('status', 'human_handling');
                })->count(),
            'resolved'  => Conversation::where('workspace_id', $workspaceId)->where('status', 'resolved')->count(),
        ];

        return $this->success([
            'conversations' => $conversations->items(),
            'pagination'    => [
                'current_page' => $conversations->currentPage(),
                'last_page'    => $conversations->lastPage(),
                'total'        => $conversations->total(),
            ],
            'filter_counts' => $filterCounts,
            'active_filter' => $filter,
        ]);
    }

    /**
     * Show single conversation details with complete message thread and CRM profile.
     */
    public function show(int $id): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $conversation = Conversation::with('customer')
            ->where('workspace_id', $workspace->id)
            ->findOrFail($id);

        $messages = Message::where('conversation_id', $conversation->id)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark unread messages as read
        Message::where('conversation_id', $conversation->id)
            ->where('sender_type', 'customer')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->success([
            'conversation' => $conversation,
            'customer'     => $conversation->customer,
            'messages'     => $messages,
        ]);
    }

    /**
     * Agent sends a message or interactive element to customer.
     */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $conversation = Conversation::where('workspace_id', $workspace->id)->findOrFail($id);

        $validated = $request->validate([
            'content'          => 'required_without:media_url|nullable|string|max:4000',
            'media_url'        => 'nullable|string',
            'media_type'       => 'nullable|string|in:image,document,video,audio',
            'interactive_type' => 'nullable|string|in:button,list,carousel',
            'interactive_data' => 'nullable|array',
        ]);

        $message = Message::create([
            'conversation_id'  => $conversation->id,
            'sender_type'      => 'agent',
            'content'          => $validated['content'] ?? '',
            'media_url'        => $validated['media_url'] ?? null,
            'media_type'       => $validated['media_type'] ?? null,
            'interactive_type' => $validated['interactive_type'] ?? null,
            'interactive_data' => $validated['interactive_data'] ?? null,
            'read_at'          => now(),
        ]);

        $conversation->touch();

        return $this->success($message, 'تم إرسال الرسالة بنجاح ✓', 201);
    }

    /**
     * Toggle Human Takeover (pause/resume bot for this conversation).
     */
    public function toggleBotTakeover(Request $request, int $id): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $conversation = Conversation::where('workspace_id', $workspace->id)->findOrFail($id);

        $isPaused = $request->has('is_bot_paused')
            ? $request->boolean('is_bot_paused')
            : !$conversation->is_bot_paused;

        $conversation->update([
            'is_bot_paused' => $isPaused,
            'status'        => $isPaused ? 'human_handling' : 'open',
        ]);

        return $this->success([
            'is_bot_paused' => (bool) $conversation->is_bot_paused,
            'status'        => $conversation->status,
        ], $isPaused ? 'تم إيقاف البوت مؤقتاً واستلام المحادثة كوكيل بشري 👨‍💼' : 'تم تفعيل الرد الآلي للبوت للمحادثة 🤖');
    }

    /**
     * Mark conversation as resolved and trigger CSAT.
     */
    public function resolve(int $id): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $conversation = Conversation::where('workspace_id', $workspace->id)->findOrFail($id);
        $conversation->update([
            'status'        => 'resolved',
            'is_bot_paused' => false,
        ]);

        return $this->success($conversation, 'تم إنهاء وحل المحادثة بنجاح ✓');
    }

    /**
     * Update customer mini CRM profile (tags, internal notes).
     */
    public function updateCrm(Request $request, int $id): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $conversation = Conversation::where('workspace_id', $workspace->id)->findOrFail($id);

        $validated = $request->validate([
            'internal_notes'    => 'nullable|string|max:2000',
            'tags'              => 'nullable|array',
            'is_escalated'      => 'nullable|boolean',
            'escalation_reason' => 'nullable|string|max:255',
        ]);

        $conversation->update(array_filter($validated, fn($v) => $v !== null));

        if ($conversation->customer && isset($validated['tags'])) {
            $conversation->customer->update(['tags' => $validated['tags']]);
        }

        return $this->success($conversation, 'تم تحديث بيانات وملف العميل بنجاح ✓');
    }

    /**
     * List all Canned Replies (Quick slash shortcuts).
     */
    public function cannedReplies(): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $replies = CannedReply::where('workspace_id', $workspace->id)->get();
        return $this->success($replies);
    }

    /**
     * Store new Canned Reply.
     */
    public function storeCannedReply(Request $request): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $validated = $request->validate([
            'shortcut' => 'required|string|max:50',
            'title'    => 'required|string|max:255',
            'content'  => 'required|string|max:2000',
        ]);

        $shortcut = str_starts_with($validated['shortcut'], '/') ? $validated['shortcut'] : '/' . $validated['shortcut'];

        $reply = CannedReply::updateOrCreate([
            'workspace_id' => $workspace->id,
            'shortcut'     => $shortcut,
        ], [
            'title'   => $validated['title'],
            'content' => $validated['content'],
        ]);

        return $this->success($reply, 'تم حفظ الرد السريع بنجاح ✓', 201);
    }

    /**
     * Delete Canned Reply.
     */
    public function deleteCannedReply(int $id): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        CannedReply::where('workspace_id', $workspace->id)->where('id', $id)->delete();
        return $this->success(null, 'تم حذف الرد السريع بنجاح');
    }
}
