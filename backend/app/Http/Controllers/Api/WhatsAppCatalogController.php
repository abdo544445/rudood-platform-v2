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
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('Workspace not found', 404);

        $channel = \App\Models\Channel::where('workspace_id', $workspace->id)
            ->where('platform', 'whatsapp')
            ->first();

        if (!$channel) {
            return $this->error('WhatsApp channel is not connected.', 400);
        }

        // WhatsApp catalog configuration can be stored in webhook_url or a JSON metadata field
        $config = json_decode($channel->webhook_url ?? '{}', true) ?: [];

        return $this->success([
            'catalog_id'              => $config['catalog_id'] ?? null,
            'is_catalog_active'       => $config['is_catalog_active'] ?? false,
            'auto_reply_with_catalog' => $config['auto_reply_with_catalog'] ?? false,
        ]);
    }

    /**
     * Save WhatsApp Catalog configuration.
     */
    public function saveCatalogConfig(Request $request): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('Workspace not found', 404);

        $channel = \App\Models\Channel::where('workspace_id', $workspace->id)
            ->where('platform', 'whatsapp')
            ->first();

        if (!$channel) {
            return $this->error('WhatsApp channel is not connected.', 400);
        }

        $validated = $request->validate([
            'catalog_id'              => 'nullable|string',
            'is_catalog_active'       => 'nullable|boolean',
            'auto_reply_with_catalog' => 'nullable|boolean',
        ]);

        $config = json_decode($channel->webhook_url ?? '{}', true) ?: [];
        $config['catalog_id'] = $validated['catalog_id'] ?? null;
        $config['is_catalog_active'] = $validated['is_catalog_active'] ?? false;
        $config['auto_reply_with_catalog'] = $validated['auto_reply_with_catalog'] ?? false;

        $channel->webhook_url = json_encode($config);
        $channel->save();

        return $this->success($config, 'تم حفظ إعدادات الكتالوج والرسائل التفاعلية بنجاح ✓');
    }

    /**
     * Sync catalog from Meta Commerce Manager (Mock).
     */
    public function syncCatalog(): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('Workspace not found', 404);

        $channel = \App\Models\Channel::where('workspace_id', $workspace->id)
            ->where('platform', 'whatsapp')
            ->first();

        if (!$channel) {
            return $this->error('WhatsApp channel is not connected.', 400);
        }

        $config = json_decode($channel->webhook_url ?? '{}', true) ?: [];
        if (empty($config['catalog_id'])) {
            return $this->error('لم يتم إدخال معرف الكتالوج (Catalog ID)', 400);
        }

        return $this->success([
            'total_products_synced' => rand(10, 50),
            'last_sync' => now()->toIso8601String(),
        ], 'تم مزامنة المنتجات من Meta Commerce Manager بنجاح ✓');
    }
}
