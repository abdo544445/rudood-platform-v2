<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Channel;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ListenChannels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'channels:listen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Continuously poll active Telegram channels for new messages (Local Development Daemon)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Starting Telegram long-polling daemon...");
        
        $webhookController = app(WebhookController::class);

        // Keep track of the last update ID for each channel to avoid reprocessing
        $lastUpdateIds = [];

        while (true) {
            $channels = Channel::where('platform', 'telegram')
                ->where('is_active', true)
                ->whereNotNull('bot_token')
                ->get();

            if ($channels->isEmpty()) {
                sleep(5);
                continue;
            }

            foreach ($channels as $channel) {
                $token = $channel->bot_token;
                
                try {
                    // Make sure webhook is removed for getUpdates to work
                    Http::timeout(5)->post("https://api.telegram.org/bot{$token}/deleteWebhook");

                    $offset = isset($lastUpdateIds[$channel->id]) ? $lastUpdateIds[$channel->id] + 1 : 0;
                    
                    // We use timeout=10 for long polling on Telegram side
                    $response = Http::timeout(15)->get("https://api.telegram.org/bot{$token}/getUpdates", [
                        'timeout' => 10,
                        'offset' => $offset,
                    ]);

                    if ($response->successful() && ($response->json('ok') ?? false)) {
                        $updates = $response->json('result') ?? [];
                        
                        foreach ($updates as $update) {
                            $updateId = $update['update_id'] ?? 0;
                            
                            if ($updateId > ($lastUpdateIds[$channel->id] ?? 0)) {
                                $lastUpdateIds[$channel->id] = $updateId;
                            }

                            $message = $update['message'] ?? null;
                            if (!$message || !isset($message['text'])) continue;

                            $this->info("Received message for workspace {$channel->workspace_id} on Telegram.");

                            $fakeRequest = new Request($update);
                            $webhookController->handleTelegram($fakeRequest, $channel->workspace_id);
                        }
                    }
                } catch (\Throwable $e) {
                    Log::error("Error polling Telegram for workspace {$channel->workspace_id}: " . $e->getMessage());
                }
            }

            // Small delay to prevent CPU spinning if there are rapid loops
            sleep(1);
        }
    }
}
