<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Bot;

class BaseApiController extends Controller
{
    /**
     * Return standardized success JSON response.
     */
    protected function success(mixed $data = null, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $statusCode);
    }

    /**
     * Return standardized error JSON response.
     */
    protected function error(string $message = 'An error occurred', int $statusCode = 400, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $statusCode);
    }

    /**
     * Get the authenticated user.
     */
    protected function user(): ?User
    {
        return Auth::user();
    }

    /**
     * Get the current active workspace for the authenticated user.
     */
    protected function workspace(): ?Workspace
    {
        $user = $this->user();
        if (!$user) return null;

        return Workspace::find($user->workspace_id);
    }

    /**
     * Get the active Bot for the current workspace.
     */
    protected function bot(): ?Bot
    {
        $workspace = $this->workspace();
        if (!$workspace) return null;

        return Bot::where('workspace_id', $workspace->id)->first()
            ?? Bot::firstOrCreate([
                'workspace_id' => $workspace->id,
            ], [
                'name'            => 'مساعد المتجر الذكي',
                'system_prompt'   => 'أنت مساعد ذكاء اصطناعي محترف للمتجر.',
                'welcome_message' => 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟',
                'bot_tone'        => 'friendly',
                'ai_provider'     => 'gemini',
                'model_type'      => 'gemini-1.5-flash',
                'is_active'       => true,
            ]);
    }
}
