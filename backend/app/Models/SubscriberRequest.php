<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Workspace;
use App\Models\Bot;
use App\Models\User;
use App\Models\Subscription;

class SubscriberRequest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company_name',
        'selected_plan',
        'notes',
        'status',
        'admin_notes',
        'approved_by',
        'approved_at',
        'created_user_id',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Scope for pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Approver user relation.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Created user relation.
     */
    public function createdUser()
    {
        return $this->belongsTo(User::class, 'created_user_id');
    }

    /**
     * Approve and automatically provision the Workspace, Bot, User, and Subscription.
     *
     * @param array $customParams
     * @param int|null $adminId
     * @return User
     */
    public function approveAndProvision(array $customParams = [], ?int $adminId = null): User
    {
        return DB::transaction(function () use ($customParams, $adminId) {

            // ── Step 0: Check for an existing user by email (prevents duplicate-key crash) ──
            $existingUser = User::where('email', $this->email)->first();

            // ── CASE A: User already exists AND already has a valid workspace ──────────────
            if ($existingUser && $existingUser->workspace_id && $existingUser->workspace) {
                // Just activate the existing workspace + bot, no new records needed
                $existingUser->workspace->update([
                    'status'  => 'active',
                    'plan_id' => $customParams['selected_plan'] ?? $this->selected_plan ?? $existingUser->workspace->plan_id ?? 'starter',
                ]);

                $existingUser->workspace->bots()->update(['is_active' => true]);

                Subscription::updateOrCreate(
                    ['workspace_id' => $existingUser->workspace->id],
                    [
                        'plan_name' => $existingUser->workspace->plan_id ?: 'starter',
                        'price'     => match($existingUser->workspace->plan_id) {
                            'starter'    => 39.00,
                            'enterprise' => 199.00,
                            default      => 79.00,
                        },
                        'status'    => 'active',
                        'renews_at' => now()->addMonth(),
                    ]
                );

                $this->update([
                    'status'          => 'approved',
                    'approved_by'     => $adminId ?? (auth()->id() ?? null),
                    'approved_at'     => now(),
                    'created_user_id' => $existingUser->id,
                    'admin_notes'     => ($customParams['admin_notes'] ?? '') . ' [تم اعتماد وتفعيل مساحة العمل للمستخدم بنجاح]',
                ]);

                return $existingUser;
            }

            // ── CASE B: Either no user at all, OR user exists but has an orphaned/missing workspace ──
            // Build workspace + bot + subscription fresh
            $companyName   = $customParams['company_name']   ?? $this->company_name   ?? ($this->name . "'s Store");
            $plan          = $customParams['selected_plan']  ?? $this->selected_plan  ?? 'professional';
            $password      = $customParams['password']       ?? 'password123';
            $botName       = $customParams['bot_name']       ?? ('مساعد ' . $companyName . ' الذكي');
            $aiProvider    = $customParams['ai_provider']    ?? 'gemini';
            $modelType     = $customParams['model_type']     ?? 'gemini-1.5-flash';
            $botTone       = $customParams['bot_tone']       ?? 'friendly';
            $systemPrompt  = $customParams['system_prompt']  ?? 'أنت مساعد خدمة عملاء ذكي وخبير لمتجر ' . $companyName . '، تجيب على استفسارات الأسعار والمنتجات والشحن بلباقة وسرعة.';
            $welcomeMessage = $customParams['welcome_message'] ?? 'أهلاً بك! 👋 مرحباً بكم في ' . $companyName . '، كيف يمكنني مساعدتك اليوم؟';

            // 1. Create Workspace
            $workspace = Workspace::create([
                'company_name' => $companyName,
                'status'       => 'active',
                'plan_id'      => $plan,
            ]);

            // 2. Create Bot
            Bot::create([
                'workspace_id'    => $workspace->id,
                'name'            => $botName,
                'system_prompt'   => $systemPrompt,
                'welcome_message' => $welcomeMessage,
                'bot_tone'        => $botTone,
                'ai_provider'     => $aiProvider,
                'model_type'      => $modelType,
                'temperature'     => 0.7,
                'max_tokens'      => 600,
                'is_active'       => true,
            ]);

            // 3. Create Subscription
            Subscription::create([
                'workspace_id' => $workspace->id,
                'plan_name'    => $plan,
                'price'        => match($plan) {
                    'starter'    => 39.00,
                    'enterprise' => 199.00,
                    default      => 79.00,
                },
                'status'    => 'active',
                'renews_at' => now()->addMonth(),
            ]);

            // 4. Create or update user — NEVER insert if email already exists
            if ($existingUser) {
                // User exists but workspace was orphaned → assign the new workspace
                $existingUser->update([
                    'workspace_id' => $workspace->id,
                    'role'         => 'owner',
                ]);
                $user = $existingUser;
            } else {
                // Truly new user
                $user = User::create([
                    'name'         => $this->name,
                    'email'        => $this->email,
                    'phone'        => $this->phone,
                    'password'     => Hash::make($password),
                    'workspace_id' => $workspace->id,
                    'role'         => 'owner',
                ]);
            }

            // 5. Mark request as approved
            $this->update([
                'status'          => 'approved',
                'approved_by'     => $adminId ?? (auth()->id() ?? null),
                'approved_at'     => now(),
                'created_user_id' => $user->id,
                'admin_notes'     => ($customParams['admin_notes'] ?? ''),
            ]);

            return $user;
        });
    }


    /**
     * Get the formatted welcome message text.
     */
    public static function getWelcomeNotificationText(string $subscriberName = '', string $companyName = ''): string
    {
        return "تمت إضافتك بنجاح! أهلاً بكم كشريك ومستخدم في منصة ردود. تفضل بالدخول لصفحة متجرك وزود البوت ببيانات وآلية عمل متجرك 🚀";
    }
}
