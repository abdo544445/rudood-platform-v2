<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController as ApiAuthController;
use App\Http\Controllers\Api\DashboardController as ApiDashboardController;
use App\Http\Controllers\Api\ConversationController as ApiConversationController;
use App\Http\Controllers\Api\BotController as ApiBotController;
use App\Http\Controllers\Api\PlaygroundController as ApiPlaygroundController;
use App\Http\Controllers\Api\KnowledgeBaseController as ApiKnowledgeBaseController;
use App\Http\Controllers\Api\ChannelController as ApiChannelController;
use App\Http\Controllers\Api\AdminController as ApiAdminController;
use App\Http\Controllers\WebhookController;

/*
|--------------------------------------------------------------------------
| API V1 Routes (React SPA & Decoupled Endpoints)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {

    // ── Public Auth & Demo Simulation Endpoints ─────────────────────────────
    Route::middleware(['throttle:login'])->group(function () {
        Route::post('/auth/login', [ApiAuthController::class, 'login']);
        Route::post('/auth/register', [ApiAuthController::class, 'register']);
    });
    Route::post('/demo/simulate', [\App\Http\Controllers\Api\DemoSimulationController::class, 'simulate']);

    // ── Public Blog Articles Endpoints ─────────────────────────────────────
    Route::get('/articles', function () {
        $articles = \App\Models\Article::published()
            ->latest('published_at')
            ->get();
        return response()->json([
            'success' => true,
            'data'    => $articles,
        ]);
    });

    Route::get('/articles/{slug}', function ($slug) {
        $article = \App\Models\Article::published()
            ->where('slug', $slug)
            ->first();

        if (!$article) {
            return response()->json(['success' => false, 'message' => 'المقال غير موجود'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $article,
        ]);
    });

    // ── Protected Endpoints (Requires Sanctum Bearer Token) ─────────────────
    Route::middleware(['auth:sanctum'])->group(function () {

        // User & Session
        Route::get('/auth/user', [ApiAuthController::class, 'me']);
        Route::post('/auth/logout', [ApiAuthController::class, 'logout']);

        // Dashboard & ROI Analytics
        Route::get('/dashboard/stats', [ApiDashboardController::class, 'stats']);
        Route::get('/dashboard/charts', [ApiDashboardController::class, 'charts']);

        // Live Chat 2.0 & Inbox
        Route::get('/conversations', [ApiConversationController::class, 'index']);
        Route::get('/conversations/{id}', [ApiConversationController::class, 'show']);
        Route::post('/conversations/{id}/messages', [ApiConversationController::class, 'sendMessage']);
        Route::post('/conversations/{id}/toggle-bot', [ApiConversationController::class, 'toggleBotTakeover']);
        Route::post('/conversations/{id}/resolve', [ApiConversationController::class, 'resolve']);
        Route::post('/conversations/{id}/crm', [ApiConversationController::class, 'updateCrm']);
        Route::get('/canned-replies', [ApiConversationController::class, 'cannedReplies']);
        Route::post('/canned-replies', [ApiConversationController::class, 'storeCannedReply']);
        Route::delete('/canned-replies/{id}', [ApiConversationController::class, 'deleteCannedReply']);

        // Bot Configuration & AI Provider
        Route::get('/bot/settings', [ApiBotController::class, 'getSettings']);
        Route::put('/bot/settings', [ApiBotController::class, 'updateSettings']);
        Route::post('/bot/toggle', [ApiBotController::class, 'toggleActive']);
        Route::get('/bot/models', [ApiBotController::class, 'models']);
        Route::post('/bot/api-key', [ApiBotController::class, 'saveApiKey']);

        // AI Playground Simulator
        Route::post('/playground/simulate', [ApiPlaygroundController::class, 'simulate']);

        // Knowledge Base & RAG Vector Management
        Route::get('/knowledge-base/documents', [ApiKnowledgeBaseController::class, 'documents']);
        Route::post('/knowledge-base/upload', [ApiKnowledgeBaseController::class, 'upload']);
        Route::delete('/knowledge-base/documents/{id}', [ApiKnowledgeBaseController::class, 'deleteDocument']);
        Route::post('/knowledge-base/reindex', [ApiKnowledgeBaseController::class, 'reindex']);
        Route::post('/knowledge-base/faq/{id}', [ApiKnowledgeBaseController::class, 'generateFaq']);
        Route::get('/auto-rules', [ApiKnowledgeBaseController::class, 'autoRules']);
        Route::post('/auto-rules', [ApiKnowledgeBaseController::class, 'storeAutoRule']);
        Route::delete('/auto-rules/{id}', [ApiKnowledgeBaseController::class, 'deleteAutoRule']);

        // Omni-Channel Hub
        Route::get('/channels', [ApiChannelController::class, 'index']);
        Route::post('/channels/{platform}/connect', [ApiChannelController::class, 'connect']);
        Route::post('/channels/{platform}/toggle', [ApiChannelController::class, 'toggle']);
        Route::match(['get', 'post', 'put'], '/channels/widget/config', [ApiChannelController::class, 'widgetConfig']);

        // Super Admin Management (Role Protected)
        Route::prefix('admin')->middleware(['super_admin'])->group(function () {
            Route::get('/overview', [ApiAdminController::class, 'overview']);
            Route::get('/subscribers', [ApiAdminController::class, 'subscribers']);
            Route::post('/subscribers', [ApiAdminController::class, 'storeSubscriber']);
            Route::post('/subscribers/{id}/approve', [ApiAdminController::class, 'approveSubscriber']);
            Route::post('/subscribers/{id}/reject', [ApiAdminController::class, 'rejectSubscriber']);
            Route::get('/contacts', [ApiAdminController::class, 'contactMessages']);
            Route::put('/contacts/{id}', [ApiAdminController::class, 'updateContactStatus']);
            Route::get('/audit-logs', [ApiAdminController::class, 'auditLogs']);
            Route::post('/maintenance/toggle', [ApiAdminController::class, 'toggleMaintenance']);

            // Workspaces Management
            Route::get('/workspaces', [ApiAdminController::class, 'workspaces']);
            Route::post('/workspaces', [ApiAdminController::class, 'storeWorkspace']);
            Route::get('/workspaces/{id}', [ApiAdminController::class, 'showWorkspace']);
            Route::put('/workspaces/{id}', [ApiAdminController::class, 'updateWorkspace']);
            Route::delete('/workspaces/{id}', [ApiAdminController::class, 'deleteWorkspace']);
            Route::post('/workspaces/{id}/impersonate', [ApiAdminController::class, 'impersonateWorkspace']);
            Route::post('/workspaces/switch', [ApiAdminController::class, 'switchWorkspace']);

            // Users Directory
            Route::get('/users', [ApiAdminController::class, 'users']);
            Route::put('/users/{id}/role', [ApiAdminController::class, 'updateUserRole']);
            Route::delete('/users/{id}', [ApiAdminController::class, 'deleteUser']);

            // Database Explorer & Query Runner
            Route::get('/database/explorer', [ApiAdminController::class, 'databaseExplorer']);
            Route::post('/database/query', [ApiAdminController::class, 'runQuery']);

            // Articles CMS
            Route::get('/articles', [ApiAdminController::class, 'articles']);
            Route::post('/articles', [ApiAdminController::class, 'storeArticle']);
            Route::put('/articles/{id}', [ApiAdminController::class, 'updateArticle']);
            Route::delete('/articles/{id}', [ApiAdminController::class, 'deleteArticle']);

            // Deep Statistics Telemetry
            Route::get('/statistics', [ApiAdminController::class, 'statistics']);
            Route::post('/statistics/prune-failed', [ApiAdminController::class, 'pruneFailedJobs']);

            // Infrastructure & System
            Route::post('/system/cache-clear', [ApiAdminController::class, 'clearCache']);
        });
    });
});

/*
|--------------------------------------------------------------------------
| Webhook & Public Integration Endpoints
|--------------------------------------------------------------------------
*/
Route::middleware(['throttle:webhook'])->group(function () {
    Route::post('/webhook/incoming', [WebhookController::class, 'incoming']);
    Route::get('/webhook/test', [WebhookController::class, 'test']);
    Route::post('/webhook/test', [WebhookController::class, 'incoming']);

    // Meta WhatsApp Cloud API Webhook Handshake & Ingestion
    Route::get('/webhook/whatsapp', [WebhookController::class, 'verifyWhatsApp']);
    Route::post('/webhook/whatsapp', [WebhookController::class, 'handleWhatsApp']);

    // Meta Instagram Direct & Comments Webhook Handshake & Ingestion
    Route::get('/webhook/instagram', [WebhookController::class, 'verifyInstagram']);
    Route::post('/webhook/instagram', [WebhookController::class, 'handleInstagram']);

    // Telegram Bot Webhook Ingestion
    Route::match(['get', 'post'], '/webhook/telegram/{workspace_id?}', [WebhookController::class, 'handleTelegram']);

    // Web Live Chat Widget Endpoints (Embedded Script)
    Route::get('/widget/config/{workspace_id}', [\App\Http\Controllers\WidgetController::class, 'getConfig']);
    Route::post('/widget/message', [\App\Http\Controllers\WidgetController::class, 'sendMessage']);
    Route::get('/widget/history/{conversation_id}', [\App\Http\Controllers\WidgetController::class, 'getHistory']);
    Route::post('/widget/csat/{conversation_id}', [\App\Http\Controllers\WidgetController::class, 'submitCsat']);
    Route::post('/conversations/{id}/csat', [\App\Http\Controllers\ConversationController::class, 'submitCsat']);
});

// Production Health Check Endpoint
Route::get('/health', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbStatus = 'OK';
    } catch (\Exception $e) {
        $dbStatus = 'ERROR: ' . $e->getMessage();
    }

    $statusCode = ($dbStatus === 'OK') ? 200 : 500;

    return response()->json([
        'status'    => $statusCode === 200 ? 'healthy' : 'unhealthy',
        'database'  => $dbStatus,
        'timestamp' => now()->toIso8601String(),
    ], $statusCode);
});

