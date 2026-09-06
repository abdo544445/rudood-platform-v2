<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Channel;
use Illuminate\Support\Facades\Http;

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
                'platform'               => $platform,
                'is_connected'           => $ch ? (bool) $ch->is_connected : ($platform === 'web'),
                'is_active'              => $ch ? (bool) $ch->is_active : false,
                'label'                  => $ch?->label ?? ucfirst($platform),
                'account_name'           => $ch?->label ?? ucfirst($platform),
                'phone_number_id'        => $ch?->phone_number_id,
                'bot_username'           => $ch?->bot_username,
                'instagram_account_id'   => $ch?->instagram_account_id,
                'auto_reply_comments'    => $ch ? (bool) $ch->auto_reply_comments : false,
                'widget_color'           => $ch?->widget_color ?? '#d4af37',
                'widget_position'        => $ch?->widget_position ?? 'right',
                'widget_greeting'        => $ch?->widget_greeting ?? 'أهلاً بك في متجرنا! كيف أقدر أساعدك اليوم؟',
                'last_error'             => $ch?->last_error,
                'updated_at'             => $ch?->updated_at,
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

        $platform = strtolower($platform);

        $channel = Channel::firstOrCreate([
            'workspace_id' => $workspace->id,
            'platform'     => $platform,
        ], [
            'label'        => ucfirst($platform),
            'is_connected' => ($platform === 'web'),
            'is_active'    => true,
        ]);

        $updateData = [
            'is_active' => true,
        ];

        if ($platform === 'whatsapp') {
            if ($request->filled('access_token')) {
                $channel->access_token = $request->access_token;
            }
            if ($request->filled('phone_number_id')) {
                $channel->phone_number_id = $request->phone_number_id;
            }
            if ($request->filled('verify_token')) {
                $channel->verify_token = $request->verify_token;
            }
            $channel->is_connected = !empty($channel->access_token) && !empty($channel->phone_number_id);
            $channel->last_error = null;
            $channel->connected_at = now();
        } elseif ($platform === 'telegram') {
            if ($request->filled('bot_token')) {
                $channel->bot_token = $request->bot_token;
            }
            if ($request->filled('bot_username')) {
                $channel->bot_username = $request->bot_username;
            }

            // Auto-verify with Telegram API if bot_token is present
            if (!empty($channel->bot_token)) {
                try {
                    $token = $channel->bot_token;
                    $res = Http::timeout(5)->get("https://api.telegram.org/bot{$token}/getMe");
                    if ($res->successful() && ($res->json('ok') ?? false)) {
                        $channel->is_connected = true;
                        $channel->bot_username = $res->json('result.username') ?? $channel->bot_username;
                        $channel->last_error = null;
                        $channel->connected_at = now();

                        // Set webhook
                        $webhookUrl = url('/api/webhook/telegram/' . $workspace->id);
                        try {
                            Http::timeout(5)->post("https://api.telegram.org/bot{$token}/setWebhook", ['url' => $webhookUrl]);
                        } catch (\Throwable $ex) {}
                    } else {
                        $channel->is_connected = false;
                        $channel->last_error = $res->json('description') ?? 'فشل الاتصال بـ Telegram';
                    }
                } catch (\Throwable $e) {
                    $channel->is_connected = false;
                    $channel->last_error = 'تعذر الاتصال بخادم تيليجرام';
                }
            }
        } elseif ($platform === 'instagram') {
            if ($request->filled('instagram_account_id')) {
                $channel->instagram_account_id = $request->instagram_account_id;
            }
            if ($request->filled('page_access_token')) {
                $channel->page_access_token = $request->page_access_token;
            }
            if ($request->filled('verify_token')) {
                $channel->verify_token = $request->verify_token;
            }
            if ($request->has('auto_reply_comments')) {
                $channel->auto_reply_comments = $request->boolean('auto_reply_comments');
            }
            $channel->is_connected = !empty($channel->page_access_token);
            $channel->last_error = null;
            $channel->connected_at = now();
        }

        $channel->is_active = true;
        $channel->save();

        return $this->success([
            'platform'     => $platform,
            'is_connected' => (bool) $channel->is_connected,
            'is_active'    => (bool) $channel->is_active,
            'bot_username' => $channel->bot_username,
            'last_error'   => $channel->last_error,
        ], "تم حفظ وإعداد قناة {$platform} بنجاح ✓");
    }

    /**
     * Toggle channel active state.
     * Guaranteed to work even if the channel has not yet been configured!
     */
    public function toggle(Request $request, string $platform): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $platform = strtolower($platform);

        $channel = Channel::firstOrCreate([
            'workspace_id' => $workspace->id,
            'platform'     => $platform,
        ], [
            'label'        => ucfirst($platform),
            'is_connected' => ($platform === 'web'),
            'is_active'    => false,
            'widget_color' => '#d4af37',
            'widget_position' => 'right',
        ]);

        $channel->is_active = !$channel->is_active;
        $channel->save();

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
            'label'           => 'Web Widget',
            'is_connected'    => true,
            'is_active'       => true,
            'widget_color'    => '#d4af37',
            'widget_position' => 'right',
            'widget_greeting' => 'أهلاً بك في متجرنا! كيف أقدر أساعدك اليوم؟',
        ]);

        if ($request->isMethod('put') || $request->isMethod('post')) {
            $validated = $request->validate([
                'widget_color'    => 'nullable|string|max:30',
                'primary_color'   => 'nullable|string|max:30',
                'widget_position' => 'nullable|string|in:right,left,bottom-right,bottom-left',
                'position'        => 'nullable|string|in:right,left,bottom-right,bottom-left',
                'widget_greeting' => 'nullable|string|max:500',
                'welcome_message' => 'nullable|string|max:500',
            ]);

            $color = $validated['widget_color'] ?? $validated['primary_color'] ?? $channel->widget_color;
            $pos = $validated['widget_position'] ?? $validated['position'] ?? $channel->widget_position;
            if ($pos === 'bottom-right') $pos = 'right';
            if ($pos === 'bottom-left') $pos = 'left';
            $greeting = $validated['widget_greeting'] ?? $validated['welcome_message'] ?? $channel->widget_greeting;

            $channel->update([
                'widget_color'    => $color,
                'widget_position' => $pos,
                'widget_greeting' => $greeting,
                'is_connected'    => true,
            ]);

            return $this->success([
                'widget_color'    => $channel->widget_color,
                'widget_position' => $channel->widget_position,
                'widget_greeting' => $channel->widget_greeting,
                'workspace_id'    => $workspace->id,
            ], 'تم حفظ وتحديث تخصيص الويدجت بنجاح ✓');
        }

        return $this->success([
            'widget_color'    => $channel->widget_color ?? '#d4af37',
            'widget_position' => $channel->widget_position ?? 'right',
            'widget_greeting' => $channel->widget_greeting ?? 'أهلاً بك في متجرنا! كيف أقدر أساعدك اليوم؟',
            'workspace_id'    => $workspace->id,
        ]);
    }
}

