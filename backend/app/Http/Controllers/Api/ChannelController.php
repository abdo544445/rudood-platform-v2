<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Channel;

class ChannelController extends BaseApiController
{
    /**
     * List all Omni-Channel connections for current workspace.
     */
    public function index(): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $channels = Channel::where('workspace_id', $workspace->id)->get()->keyBy('platform');

        $platforms = ['whatsapp', 'telegram', 'instagram', 'web'];
        $hub = [];

        foreach ($platforms as $platform) {
            $ch = $channels->get($platform);
            $hub[$platform] = [
                'platform'     => $platform,
                'is_connected' => $ch ? (bool) $ch->is_connected : false,
                'is_active'    => $ch ? (bool) $ch->is_active : false,
                'account_name' => $ch->account_name ?? null,
                'phone_number' => $ch->phone_number ?? null,
                'updated_at'   => $ch?->updated_at,
            ];
        }

        return $this->success($hub);
    }

    /**
     * Connect or update channel credentials.
     */
    public function connect(Request $request, string $platform): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $validated = $request->validate([
            'account_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:50',
            'credentials'  => 'nullable|array',
        ]);

        $channel = Channel::updateOrCreate([
            'workspace_id' => $workspace->id,
            'platform'     => $platform,
        ], [
            'account_name' => $validated['account_name'] ?? ucfirst($platform),
            'phone_number' => $validated['phone_number'] ?? null,
            'credentials'  => $validated['credentials'] ?? [],
            'is_connected' => true,
            'is_active'    => true,
        ]);

        return $this->success($channel, "تم ربط وتفعيل قناة {$platform} بنجاح ✓");
    }

    /**
     * Toggle channel active state.
     */
    public function toggle(Request $request, string $platform): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $channel = Channel::where('workspace_id', $workspace->id)->where('platform', $platform)->firstOrFail();
        $channel->update([
            'is_active' => !$channel->is_active,
        ]);

        return $this->success([
            'platform'  => $platform,
            'is_active' => (bool) $channel->is_active,
        ], $channel->is_active ? "تم تفعيل استقبال رسائل {$platform} ✓" : "تم إيقاف قناة {$platform} مؤقتاً ⏸");
    }

    /**
     * Get or save Web Widget Configuration.
     */
    public function widgetConfig(Request $request): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $channel = Channel::firstOrCreate([
            'workspace_id' => $workspace->id,
            'platform'     => 'web',
        ], [
            'account_name' => 'ويدجت الموقع المباشر',
            'is_connected' => true,
            'is_active'    => true,
            'credentials'  => [
                'primary_color'   => '#d4af37',
                'bot_title'       => 'مساعد المتجر الذكي ⚡',
                'welcome_message' => 'مرحباً بك! كيف أستطيع خدمتك اليوم؟',
                'position'        => 'bottom-right',
            ],
        ]);

        if ($request->isMethod('put') || $request->isMethod('post')) {
            $validated = $request->validate([
                'primary_color'   => 'nullable|string|max:20',
                'bot_title'       => 'nullable|string|max:100',
                'welcome_message' => 'nullable|string|max:500',
                'position'        => 'nullable|string|in:bottom-right,bottom-left',
            ]);

            $creds = array_merge($channel->credentials ?? [], $validated);
            $channel->update(['credentials' => $creds]);

            return $this->success($creds, 'تم حفظ إعدادات ويدجت الموقع بنجاح ✓');
        }

        return $this->success($channel->credentials);
    }
}
