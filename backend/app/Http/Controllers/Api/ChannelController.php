<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Channel;
use App\Http\Controllers\WebhookController;
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
                'access_token'           => $ch?->access_token,
                'verify_token'           => $ch?->verify_token,
                'bot_token'              => $ch?->bot_token,
                'bot_username'           => $ch?->bot_username,
                'page_access_token'      => $ch?->page_access_token,
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

        if ($platform === 'whatsapp') {
            if ($request->has('access_token')) {
                $channel->access_token = $request->access_token;
            }
            if ($request->has('phone_number_id')) {
                $channel->phone_number_id = $request->phone_number_id;
            }
            if ($request->has('verify_token')) {
                $channel->verify_token = $request->verify_token;
            }
            $channel->is_connected = !empty($channel->access_token) && !empty($channel->phone_number_id);
            $channel->last_error = null;
            $channel->connected_at = now();
        } elseif ($platform === 'telegram') {
            if ($request->has('bot_token')) {
                $channel->bot_token = trim($request->bot_token);
            }
            if ($request->has('bot_username')) {
                $channel->bot_username = trim($request->bot_username);
            }

            // Auto-verify with Telegram API if bot_token is present
            if (!empty($channel->bot_token)) {
                try {
                    $token = $channel->bot_token;
                    $res = Http::timeout(8)->get("https://api.telegram.org/bot{$token}/getMe");
                    if ($res->successful() && ($res->json('ok') ?? false)) {
                        $channel->is_connected = true;
                        $channel->bot_username = $res->json('result.username') ?? $channel->bot_username;
                        $channel->last_error = null;
                        $channel->connected_at = now();

                        $appUrl = config('app.url', env('APP_URL', ''));
                        if (str_starts_with($appUrl, 'https://') && !str_contains($appUrl, 'localhost')) {
                            // Public HTTPS domain: Register Webhook
                            $webhookUrl = $appUrl . '/api/webhook/telegram/' . $workspace->id;
                            try {
                                Http::timeout(8)->post("https://api.telegram.org/bot{$token}/setWebhook", ['url' => $webhookUrl]);
                            } catch (\Throwable $ex) {}
                        } else {
                            // Local development: Clear any Webhook so Long Polling (getUpdates) works smoothly
                            try {
                                Http::timeout(8)->post("https://api.telegram.org/bot{$token}/deleteWebhook");
                            } catch (\Throwable $ex) {}
                        }

                        // Run immediate initial polling check to pick up any pending messages
                        try {
                            $this->executeTelegramPollCycle($channel);
                        } catch (\Throwable $ex) {}
                    } else {
                        $channel->is_connected = false;
                        $channel->last_error = $res->json('description') ?? 'فشل الاتصال بـ Telegram (تحقق من صحة التوكن)';
                    }
                } catch (\Throwable $e) {
                    $channel->is_connected = false;
                    $channel->last_error = 'تعذر الاتصال بخادم تيليجرام: ' . $e->getMessage();
                }
            }
        } elseif ($platform === 'instagram') {
            if ($request->has('instagram_account_id')) {
                $channel->instagram_account_id = $request->instagram_account_id;
            }
            if ($request->has('page_access_token')) {
                $channel->page_access_token = $request->page_access_token;
            }
            if ($request->has('verify_token')) {
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
        ], $channel->is_connected ? "تم حفظ وربط قناة {$platform} بنجاح ✓" : "تم حفظ الإعدادات ولكن الاتصال معلق ({$channel->last_error})");
    }

    /**
     * Instant on-demand polling for Telegram messages.
     */
    public function poll(Request $request, string $platform): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('لم يتم العثور على مساحة عمل', 404);

        $platform = strtolower($platform);

        if ($platform === 'telegram') {
            $channel = Channel::where('workspace_id', $workspace->id)
                ->where('platform', 'telegram')
                ->first();

            if (!$channel || empty($channel->bot_token)) {
                return $this->error('لم يتم العثور على توكن لبوت تيليجرام في هذه المساحة', 400);
            }

            $count = $this->executeTelegramPollCycle($channel);

            return $this->success([
                'processed_messages' => $count,
                'bot_username'       => $channel->bot_username,
                'is_connected'       => (bool) $channel->is_connected,
            ], $count > 0 ? "تم جلب ومعالجة {$count} رسالة جديدة من تيليجرام بنجاح ✓" : "تم فحص تيليجرام، لا توجد رسائل جديدة حالياً ✓");
        }

        return $this->success(null, 'القناة المحددة تعمل عبر الـ Webhook التلقائي');
    }

    /**
     * Helper to poll Telegram once and dispatch to WebhookController.
     */
    private function executeTelegramPollCycle(Channel $channel): int
    {
        $token = $channel->bot_token;
        if (empty($token)) return 0;

        $processed = 0;
        try {
            // Make sure webhook is removed for getUpdates to work
            Http::timeout(5)->post("https://api.telegram.org/bot{$token}/deleteWebhook");

            $response = Http::timeout(10)->get("https://api.telegram.org/bot{$token}/getUpdates", [
                'timeout' => 2,
            ]);

            if ($response->successful() && ($response->json('ok') ?? false)) {
                $updates = $response->json('result') ?? [];
                $webhookController = app(WebhookController::class);
                $lastUpdateId = 0;

                foreach ($updates as $update) {
                    $updateId = $update['update_id'] ?? 0;
                    if ($updateId > $lastUpdateId) {
                        $lastUpdateId = $updateId;
                    }

                    $message = $update['message'] ?? null;
                    if (!$message || !isset($message['text'])) continue;

                    $fakeRequest = new Request($update);
                    $webhookController->handleTelegram($fakeRequest, $channel->workspace_id);
                    $processed++;
                }

                // Acknowledge updates to Telegram
                if ($lastUpdateId > 0) {
                    Http::timeout(5)->get("https://api.telegram.org/bot{$token}/getUpdates", [
                        'offset' => $lastUpdateId + 1,
                    ]);
                }
            }
        } catch (\Throwable $e) {
            \Log::warning('Telegram poll cycle error: ' . $e->getMessage());
        }

        return $processed;
    }

    /**
     * Toggle channel active state.
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


