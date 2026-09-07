<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WhatsAppCatalogController extends BaseApiController
{
    /**
     * Get the current WhatsApp Catalog settings.
     */
    public function getCatalogConfig(): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('Bot not found', 404);

        $channel = \App\Models\Channel::where('bot_id', $bot->id)
            ->where('platform', 'whatsapp')
            ->first();

        if (!$channel) {
            return $this->error('WhatsApp channel is not connected.', 400);
        }

        $config = $channel->config ?? [];

        return $this->success([
            'catalog_id' => $config['catalog_id'] ?? null,
            'is_catalog_active' => $config['is_catalog_active'] ?? false,
            'auto_reply_with_catalog' => $config['auto_reply_with_catalog'] ?? false,
        ]);
    }

    /**
     * Save WhatsApp Catalog configuration.
     */
    public function saveCatalogConfig(Request $request): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('Bot not found', 404);

        $channel = \App\Models\Channel::where('bot_id', $bot->id)
            ->where('platform', 'whatsapp')
            ->first();

        if (!$channel) {
            return $this->error('WhatsApp channel is not connected.', 400);
        }

        $validated = $request->validate([
            'catalog_id' => 'nullable|string',
            'is_catalog_active' => 'boolean',
            'auto_reply_with_catalog' => 'boolean',
        ]);

        $config = $channel->config ?? [];
        $config['catalog_id'] = $validated['catalog_id'] ?? null;
        $config['is_catalog_active'] = $validated['is_catalog_active'] ?? false;
        $config['auto_reply_with_catalog'] = $validated['auto_reply_with_catalog'] ?? false;

        $channel->config = $config;
        $channel->save();

        return $this->success(null, 'تم حفظ إعدادات الكتالوج والرسائل التفاعلية بنجاح ✓');
    }

    /**
     * Sync catalog from Meta Commerce Manager (Mock).
     */
    public function syncCatalog(): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('Bot not found', 404);

        $channel = \App\Models\Channel::where('bot_id', $bot->id)
            ->where('platform', 'whatsapp')
            ->first();

        if (!$channel) {
            return $this->error('WhatsApp channel is not connected.', 400);
        }

        $config = $channel->config ?? [];
        if (empty($config['catalog_id'])) {
            return $this->error('لم يتم إدخال معرف الكتالوج (Catalog ID)', 400);
        }

        // Simulate syncing from Meta API
        sleep(1);

        return $this->success([
            'total_products_synced' => rand(10, 50),
            'last_sync' => now()->toIso8601String(),
        ], 'تم مزامنة المنتجات من Meta Commerce Manager بنجاح ✓');
    }
}
