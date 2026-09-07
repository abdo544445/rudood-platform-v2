<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\StoreIntegration;

class IntegrationController extends BaseApiController
{
    /**
     * Get all store integrations for the active workspace.
     */
    public function index(): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('Workspace not found', 404);

        $integrations = StoreIntegration::where('workspace_id', $workspace->id)->get()->map(function ($integration) {
            return [
                'id' => $integration->id,
                'provider' => $integration->provider,
                'store_url' => $integration->store_url,
                'is_active' => $integration->is_active,
                'has_api_key' => !empty($integration->api_key_encrypted),
                'created_at' => $integration->created_at,
            ];
        });

        return $this->success($integrations);
    }

    /**
     * Save or update a store integration.
     */
    public function store(Request $request): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('Workspace not found', 404);

        $validated = $request->validate([
            'provider' => 'required|string|in:salla,shopify,zid',
            'api_key' => 'nullable|string',
            'store_url' => 'nullable|string|url',
            'is_active' => 'boolean',
        ]);

        $integration = StoreIntegration::firstOrNew([
            'workspace_id' => $workspace->id,
            'provider' => $validated['provider'],
        ]);

        if (!empty($validated['api_key'])) {
            $integration->api_key = $validated['api_key']; // Automatically encrypted via Model accessor
        }

        if (array_key_exists('store_url', $validated)) {
            $integration->store_url = $validated['store_url'];
        }

        if (array_key_exists('is_active', $validated)) {
            $integration->is_active = $validated['is_active'];
        }

        $integration->save();

        return $this->success([
            'id' => $integration->id,
            'provider' => $integration->provider,
            'store_url' => $integration->store_url,
            'is_active' => $integration->is_active,
            'has_api_key' => !empty($integration->api_key_encrypted),
        ], 'تم حفظ إعدادات الربط بنجاح ✓');
    }

    /**
     * Delete an integration (disconnect).
     */
    public function destroy(string $provider): JsonResponse
    {
        $workspace = $this->workspace();
        if (!$workspace) return $this->error('Workspace not found', 404);

        $integration = StoreIntegration::where('workspace_id', $workspace->id)
            ->where('provider', $provider)
            ->first();

        if ($integration) {
            $integration->delete();
        }

        return $this->success(null, 'تم إلغاء الربط بنجاح ✓');
    }
}
