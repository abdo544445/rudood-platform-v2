<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Bot;

class AuthController extends BaseApiController
{
    /**
     * Authenticate user and generate Sanctum Bearer Token.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return $this->error('البريد الإلكتروني أو كلمة المرور غير صحيحة.', 401);
        }

        // Generate Sanctum plainTextToken
        $token = $user->createToken('react_spa_' . time())->plainTextToken;

        $workspace = Workspace::find($user->workspace_id);
        $bot = $workspace ? Bot::where('workspace_id', $workspace->id)->first() : null;

        return $this->success([
            'token'     => $token,
            'token_type'=> 'Bearer',
            'user'      => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'role'         => $user->role,
                'is_admin'     => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
                'workspace_id' => $user->workspace_id,
            ],
            'workspace' => $workspace ? [
                'id'           => $workspace->id,
                'company_name' => $workspace->company_name,
                'plan_id'      => $workspace->plan_id,
                'status'       => $workspace->status,
                'messages_limit' => $workspace->monthly_messages_limit ?? 1000,
                'messages_used'  => $workspace->messages_used_this_month ?? 0,
            ] : null,
            'bot'       => $bot ? [
                'id'              => $bot->id,
                'name'            => $bot->name,
                'is_active'       => (bool) $bot->is_active,
                'ai_provider'     => $bot->ai_provider,
                'model_type'      => $bot->model_type,
                'bot_tone'        => $bot->bot_tone,
                'welcome_message' => $bot->welcome_message,
            ] : null,
        ], 'تم تسجيل الدخول بنجاح ✓');
    }

    /**
     * Atomic Registration for new merchant & workspace.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:6',
            'company_name' => 'required|string|max:255',
            'plan_id'      => 'nullable|string|in:starter,professional,enterprise',
            'phone'        => 'nullable|string|max:30',
        ]);

        return DB::transaction(function () use ($validated) {
            $plan = $validated['plan_id'] ?? 'starter';

            $workspace = Workspace::create([
                'company_name'                 => $validated['company_name'],
                'plan_id'                      => $plan,
                'status'                       => 'active',
                'monthly_messages_limit'       => match ($plan) {
                    'enterprise'   => 10000,
                    'professional' => 3000,
                    default        => 1000,
                },
                'messages_used_this_month'     => 0,
                'ai_tokens_used_this_month'    => 0,
            ]);

            $user = User::create([
                'name'         => $validated['name'],
                'email'        => $validated['email'],
                'password'     => Hash::make($validated['password']),
                'phone'        => $validated['phone'] ?? null,
                'role'         => 'owner',
                'workspace_id' => $workspace->id,
            ]);

            $bot = Bot::create([
                'workspace_id'    => $workspace->id,
                'name'            => 'مساعد ' . $workspace->company_name,
                'system_prompt'   => "أنت مساعد ذكاء اصطناعي محترف لـ {$workspace->company_name}.",
                'welcome_message' => "مرحباً بك في {$workspace->company_name}! كيف يمكنني مساعدتك؟",
                'bot_tone'        => 'friendly',
                'ai_provider'     => 'gemini',
                'model_type'      => 'gemini-1.5-flash',
                'is_active'       => true,
            ]);

            $token = $user->createToken('react_spa_' . time())->plainTextToken;

            return $this->success([
                'token'     => $token,
                'token_type'=> 'Bearer',
                'user'      => [
                    'id'           => $user->id,
                    'name'         => $user->name,
                    'email'        => $user->email,
                    'role'         => $user->role,
                    'is_admin'     => $user->isAdmin(),
                    'is_super_admin' => $user->isSuperAdmin(),
                    'workspace_id' => $user->workspace_id,
                ],
                'workspace' => $workspace,
                'bot'       => $bot,
            ], 'تم إنشاء حسابك وتفعيل مساحة العمل بنجاح ✓', 201);
        });
    }

    /**
     * Revoke current user's token (Logout).
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()?->delete();
        }

        return $this->success(null, 'تم تسجيل الخروج بنجاح');
    }

    /**
     * Get current authenticated user profile & workspace status.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return $this->error('غير مصرح', 401);
        }

        $workspace = Workspace::find($user->workspace_id);
        $bot = $workspace ? Bot::where('workspace_id', $workspace->id)->first() : null;

        return $this->success([
            'user'      => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'phone'        => $user->phone,
                'role'         => $user->role,
                'is_admin'     => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
                'workspace_id' => $user->workspace_id,
            ],
            'workspace' => $workspace,
            'bot'       => $bot,
        ]);
    }
}
