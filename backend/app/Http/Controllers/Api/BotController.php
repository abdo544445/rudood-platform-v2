<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Bot;
use App\Services\AiService;

class BotController extends BaseApiController
{
    /**
     * Get Bot configuration, AI provider settings, and status.
     */
    public function getSettings(): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        return $this->success([
            'bot' => [
                'id'              => $bot->id,
                'name'            => $bot->name,
                'is_active'       => (bool) $bot->is_active,
                'bot_tone'        => $bot->bot_tone ?: 'friendly',
                'welcome_message' => $bot->welcome_message,
                'system_prompt'   => $bot->system_prompt,
                'ai_provider'     => $bot->ai_provider ?: 'gemini',
                'model_type'      => $bot->model_type ?: 'gemini-1.5-flash',
                'api_base_url'    => $bot->api_base_url,
                'has_custom_key'  => !empty($bot->api_key),
                'enable_rag'      => (bool) ($bot->enable_rag ?? true),
                'enable_auto_rules'=> (bool) ($bot->enable_auto_rules ?? true),
            ]
        ]);
    }

    /**
     * Update Bot persona, tone, prompt, and active status.
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'bot_tone'         => 'required|string|in:formal,friendly,sales',
            'welcome_message'  => 'required|string',
            'system_prompt'    => 'nullable|string',
            'ai_provider'      => 'nullable|string|in:gemini,openai,anthropic,openai_compatible',
            'model_type'       => 'nullable|string|max:100',
            'api_base_url'     => 'nullable|string|url|max:255',
            'is_active'        => 'nullable|boolean',
            'enable_rag'       => 'nullable|boolean',
            'enable_auto_rules'=> 'nullable|boolean',
        ]);

        $bot->update($validated);

        return $this->success($bot, 'تم حفظ وتحديث إعدادات البوت بنجاح ✓');
    }

    /**
     * Toggle automated responses active status.
     */
    public function toggleActive(Request $request): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $isActive = $request->has('is_active')
            ? $request->boolean('is_active')
            : !$bot->is_active;

        $bot->update(['is_active' => $isActive]);

        return $this->success([
            'is_active' => (bool) $bot->is_active,
        ], $isActive ? 'تم تفعيل الردود التلقائية للبوت بنجاح ✓' : 'تم إيقاف الردود التلقائية مؤقتاً ⏸');
    }

    /**
     * Fetch available AI models for selected provider.
     */
    public function models(Request $request): JsonResponse
    {
        $bot = $this->bot();
        $provider = $request->get('provider', $bot?->ai_provider ?: 'gemini');
        $apiKey = $request->get('api_key');

        $aiService = new AiService($bot);
        $modelsResult = $aiService->fetchAvailableModels($provider, $apiKey);

        return $this->success($modelsResult);
    }

    /**
     * Securely store custom AI API Key.
     */
    public function saveApiKey(Request $request): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $validated = $request->validate([
            'api_key'      => 'required|string|max:500',
            'ai_provider'  => 'required|string|in:gemini,openai,anthropic,openai_compatible',
            'model_type'   => 'nullable|string|max:100',
            'api_base_url' => 'nullable|string|url|max:255',
        ]);

        $bot->update($validated);

        return $this->success(null, 'تم حفظ مفتاح API والربط بنجاح ✓');
    }
}
