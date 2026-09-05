<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\AiService;
use App\Services\RagService;
use App\Models\AiDecisionLog;
use Illuminate\Support\Str;

class PlaygroundController extends BaseApiController
{
    /**
     * Run simulated test message with parameter overrides, RAG chunk retrieval, and latency tracking.
     */
    public function simulate(Request $request, RagService $ragService): JsonResponse
    {
        $bot = $this->bot();
        if (!$bot) return $this->error('لم يتم العثور على البوت', 404);

        $validated = $request->validate([
            'message'           => 'required|string|max:2000',
            'history'           => 'nullable|array',
            'enable_rag'        => 'nullable|boolean',
            'enable_auto_rules' => 'nullable|boolean',
            'overrides'         => 'nullable|array',
            'overrides.ai_provider' => 'nullable|string',
            'overrides.model_type'  => 'nullable|string',
            'overrides.temperature' => 'nullable|numeric|min:0|max:2',
            'overrides.max_tokens'  => 'nullable|integer|min:50|max:4000',
            'overrides.bot_tone'    => 'nullable|string',
            'overrides.system_prompt'=> 'nullable|string',
        ]);

        $message   = $validated['message'];
        $history   = $validated['history'] ?? [];
        $enableRag = $validated['enable_rag'] ?? ($bot->enable_rag ?? true);
        $enableAutoRules = $validated['enable_auto_rules'] ?? ($bot->enable_auto_rules ?? true);
        $overrides = $validated['overrides'] ?? [];

        $start = microtime(true);
        $trigger = 'ai_api';
        $matchedKeywords = null;
        $matchedChunks = [];
        $context = '';

        // 1. Check Auto Rules first
        if ($enableAutoRules) {
            $ruleMatch = $ragService->checkAutoRules($bot->workspace_id, $message);
            if ($ruleMatch !== null) {
                $trigger = 'auto_rule';
                $reply = $ruleMatch['reply'];
                $matchedKeywords = is_array($ruleMatch['keywords'])
                    ? implode(', ', array_slice($ruleMatch['keywords'], 0, 5))
                    : (string) $ruleMatch['keywords'];
            }
        }

        // 2. RAG Retrieval & LLM Generation
        if ($trigger !== 'auto_rule') {
            if ($enableRag) {
                $ragData = $ragService->retrieveRelevantChunks($bot->id, $message);
                $matchedChunks = $ragData['chunks'] ?? [];
                $context = $ragData['context'] ?? '';
            }

            $aiService = new AiService($bot, $overrides);
            $reply = $aiService->generateReply($message, $context, $history);

            if ($reply === $aiService->getFallbackReply()) {
                $trigger = 'fallback';
            }
        }

        $latencyMs = round((microtime(true) - $start) * 1000);

        // Record telemetry log
        try {
            AiDecisionLog::create([
                'conversation_id'  => null,
                'message_id'       => null,
                'trigger'          => $trigger,
                'matched_keywords' => $matchedKeywords,
                'context_sent'     => $context ? Str::limit($context, 2000) : null,
                'ai_provider'      => $overrides['ai_provider'] ?? $bot->ai_provider ?: 'gemini',
                'model_type'       => $overrides['model_type'] ?? $bot->model_type ?: 'default',
                'customer_message' => $message,
                'bot_reply'        => $reply,
                'response_time_ms' => $latencyMs,
            ]);
        } catch (\Throwable $e) {}

        $aiServiceInspector = new AiService($bot, $overrides);
        $systemPromptUsed = $aiServiceInspector->buildSystemPrompt($context);

        return $this->success([
            'reply'              => $reply,
            'trigger'            => $trigger,
            'latency_ms'         => $latencyMs,
            'matched_keywords'   => $matchedKeywords,
            'chunks'             => $matchedChunks,
            'system_prompt_used' => $systemPromptUsed,
        ]);
    }
}
