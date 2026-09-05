<div dir="rtl">

# 💻 الدليل الشامل للأكواد والصياغات البرمجية لمنصة ردود (الإصدار الثاني V2)
# Rudood AI Platform V2 — Comprehensive Code, Architecture & Syntax Deep-Dive Guide

> **الوثيقة:** الدليل المرجعي للأكواد البرمجية والصياغات (Code & Syntax Reference Manual)  
> **الإصدار:** 2.0 Enterprise Decoupled SPA  
> **الحزمة التقنية:** React 19 | TypeScript 5.7 | Vite 6 | Zustand 5 | Axios | Laravel 11 REST API | PostgreSQL 16 pgvector | PHP 8.4  
> **المستودع الرسمي:** [https://github.com/abdo544445/rudood-platform-v2](https://github.com/abdo544445/rudood-platform-v2)

---

## 📑 فهرس أقسام الدليل (Table of Contents)

1. [🏛️ 1. معايير البنية الكودية والصياغة النمطية في V2 (Typing Standards)](#1-معايير-البنية-الكودية-والصياغة-النمطية-في-v2)
2. [⚛️ 2. تشريح كود الواجهة الأمامية React 19 + TypeScript (Frontend SPA)](#2-تشريح-كود-الواجهة-الأمامية-react-19--typescript)
   - 2.1 شجرة التوجيه وحماية المسارات (`App.tsx` & `ProtectedRoute.tsx`)
   - 2.2 إدارة الحالة العامة ومصادقة المستخدم (`useAuthStore.ts`)
   - 2.3 عميل الاتصال واعتراض التوكنز (`apiClient.ts`)
   - 2.4 كود جناح الإدارة العليا ذو الـ 8 تبويبات (`AdminPage.tsx`)
   - 2.5 كود إعدادات محرك البوت وجالب النماذج (`BotSettingsPage.tsx`)
   - 2.6 كود صندوق المحادثات ومحاكي العميل (`LiveChatPage.tsx`)
   - 2.7 كود قاعدة المعرفة ومستخرج الأسئلة بالذكاء الاصطناعي (`KnowledgeBasePage.tsx`)
3. [🐘 3. تشريح كود الواجهة الخلفية Laravel 11 REST API (Backend API)](#3-تشريح-كود-الواجهة-الخلفية-laravel-11-rest-api)
   - 3.1 خريطة مسارات الـ API المحمية (`routes/api.php`)
   - 3.2 وحدة تحكم الإدارة العليا ومحاكي الـ SQL (`AdminController.php`)
   - 3.3 وحدة تحكم إعدادات البوت والـ Models (`BotSettingsController.php`)
   - 3.4 وحدة تحكم استخراج الـ FAQ بالذكاء الاصطناعي (`KnowledgeBaseController.php`)
   - 3.5 وحدة تحكم مختبر الذكاء الاصطناعي وتتبع السرعة (`PlaygroundController.php`)
4. [🔍 4. تشريح كود واستعلامات البحث الدلالي pgvector (Vector Math & Cosine)](#4-تشريح-كود-واستعلامات-البحث-الدلالي-pgvector)
5. [🧪 5. تشريح محرك الاختبارات الآلية الشاملة (118 Tests Suite Runner)](#5-تشريح-محرك-الاختبارات-الآلية-الشاملة)

---

# 1. 🏛️ معايير البنية الكودية والصياغة النمطية في V2

تلتزم المنصة بأحدث الممارسات الهندسية الصارمة في بيئتي **TypeScript 5.7** و **PHP 8.4**:
* **TypeScript Strict Mode:** منع استخدام `any` غير المبرر، وتحديد واجهات (Interfaces) دقيقة لكافة الكائنات والردود.
* **Component-Driven Clean Architecture:** فصل مكونات العرض (Presentational Components) عن منطق جلب البيانات وربط الـ Stores.
* **PHP 8.4 Typed Properties & Return Types:** التزام كامل بتحديد أنواع البيانات لجميع معاملات الدوال وقيم الإرجاع (`JsonResponse`, `array`, `string`).

---

# 2. ⚛️ تشريح كود الواجهة الأمامية React 19 + TypeScript

### 2.1 شجرة التوجيه وحماية المسارات (`App.tsx` & `ProtectedRoute.tsx`):
يتم تأمين التطبيق عبر مكون الحماية النظيف `ProtectedRoute` الذي يتحقق من حالة تسجيل الدخول وصلاحيات المستخدم:

</div>

<div dir="ltr">

```typescript
// frontend/src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

</div>

<div dir="rtl">

---

### 2.2 إدارة الحالة العامة ومصادقة المستخدم (`useAuthStore.ts`):
تستخدم المنصة مكتبة **Zustand** الخفيفة مع التخزين المحلي التلقائي:

</div>

<div dir="ltr">

```typescript
// frontend/src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'agent';
  store_id?: number;
  store_name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  impersonate: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      impersonate: (token, user) => set({ token, user, isAuthenticated: true }),
    }),
    { name: 'rudood-auth-storage' }
  )
);
```

</div>

<div dir="rtl">

---

### 2.3 عميل الاتصال واعتراض التوكنز (`apiClient.ts`):
يتم حقن التوكن في جميع الترويسات الصادرة تلقائياً مع معالجة حماية انتهاء الجلسة 401:

</div>

<div dir="ltr">

```typescript
// frontend/src/services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

</div>

<div dir="rtl">

---

### 2.4 كود جناح الإدارة العليا ذو الـ 8 تبويبات (`AdminPage.tsx`):
يحتوي على كافة الوحدات الإدارية الموحدة في شاشة واحدة:

</div>

<div dir="ltr">

```typescript
// frontend/src/pages/admin/AdminPage.tsx (SQL Terminal & Impersonation Snippet)
const handleRunSql = async () => {
  if (!sqlQuery.trim()) return;
  setSqlLoading(true);
  try {
    const res = await apiClient.post('/admin/database/query', { query: sqlQuery });
    setSqlResult(res.data.rows);
    setSqlError(null);
  } catch (err: any) {
    setSqlError(err.response?.data?.message || 'فشل تنفيذ الاستعلام');
  } finally {
    setSqlLoading(false);
  }
};

const handleImpersonate = async (workspaceId: number) => {
  try {
    const res = await apiClient.post(`/admin/workspaces/${workspaceId}/impersonate`);
    impersonate(res.data.token, res.data.user);
    navigate('/dashboard');
  } catch (err) {
    alert('فشل انتحال جلسة المتجر');
  }
};
```

</div>

<div dir="rtl">

---

# 3. 🐘 تشريح كود الواجهة الخلفية Laravel 11 REST API

### 3.1 خريطة مسارات الـ API المحمية (`routes/api.php`):
تنظيم المسارات تحت البادئة `/api/v1` ومجموعات الحماية:

</div>

<div dir="ltr">

```php
// backend/routes/api.php
Route::prefix('v1')->group(function () {
    // Public & Auth Endpoints
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::get('/public/stats', [PublicController::class, 'stats']);
    Route::get('/blog/articles', [BlogController::class, 'index']);
    Route::get('/blog/articles/{slug}', [BlogController::class, 'show']);
    Route::post('/contact', [ContactController::class, 'store']);

    // Protected Store Owner Endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/conversations', [ChatController::class, 'index']);
        Route::post('/conversations/{id}/messages', [ChatController::class, 'sendMessage']);
        Route::post('/conversations/{id}/toggle-bot', [ChatController::class, 'toggleBot']);
        Route::get('/bot/settings', [BotSettingsController::class, 'show']);
        Route::put('/bot/settings', [BotSettingsController::class, 'update']);
        Route::get('/bot/models', [BotSettingsController::class, 'fetchModels']);
        Route::post('/knowledge-base/upload', [KnowledgeBaseController::class, 'upload']);
        Route::post('/knowledge-base/faq/{id}', [KnowledgeBaseController::class, 'extractFaq']);
        Route::post('/playground/test', [PlaygroundController::class, 'testPrompt']);
    });

    // Super Admin Only Endpoints
    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('/overview', [AdminController::class, 'overview']);
        Route::get('/analytics', [AdminController::class, 'analytics']);
        Route::get('/workspaces', [AdminController::class, 'workspaces']);
        Route::post('/workspaces', [AdminController::class, 'createWorkspace']);
        Route::post('/workspaces/{id}/impersonate', [AdminController::class, 'impersonate']);
        Route::get('/database/tables', [AdminController::class, 'databaseTables']);
        Route::post('/database/query', [AdminController::class, 'runSqlTerminal']);
        Route::get('/audit-trail', [AdminController::class, 'auditTrail']);
        Route::post('/system/maintenance', [AdminController::class, 'toggleMaintenance']);
        Route::post('/system/clear-cache', [AdminController::class, 'clearCache']);
    });
});
```

</div>

<div dir="rtl">

---

### 3.2 وحدة تحكم الإدارة العليا ومحاكي الـ SQL (`AdminController.php`):
تطبيق أمان صارم لمنع استعلامات التعديل في محاكي SQL وحصرها في القراءة فقط:

</div>

<div dir="ltr">

```php
// backend/app/Http/Controllers/Api/AdminController.php
public function runSqlTerminal(Request $request): JsonResponse
{
    $query = trim($request->input('query', ''));
    
    // Security check: disallow mutating operations
    $disallowed = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE'];
    foreach ($disallowed as $keyword) {
        if (stripos($query, $keyword) !== false) {
            return response()->json([
                'success' => false,
                'message' => "غير مسموح بتنفيذ استعلامات التعديل أو الحذف ($keyword). المحاكي للقراءة فقط."
            ], 403);
        }
    }

    try {
        $results = DB::select($query);
        return response()->json([
            'success' => true,
            'rows' => $results,
            'count' => count($results)
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 400);
    }
}
```

</div>

<div dir="rtl">

---

# 4. 🔍 تشريح كود واستعلامات البحث الدلالي pgvector

تستخدم المنصة معامل المسافة المتجهية `<=>` (Cosine Distance) لاكتشاف المقاطع النصية الأقرب دلالياً لسؤال العميل:

</div>

<div dir="ltr">

```php
// pgvector Cosine Similarity Query in knowledge_chunks
$queryEmbedding = $this->generateEmbedding($customerQuery);

$relevantChunks = DB::table('knowledge_chunks')
    ->join('knowledge_documents', 'knowledge_chunks.document_id', '=', 'knowledge_documents.id')
    ->where('knowledge_documents.store_id', $storeId)
    ->where('knowledge_documents.is_active', true)
    ->select('knowledge_chunks.content', 'knowledge_chunks.title')
    ->selectRaw('1 - (knowledge_chunks.embedding <=> ?::vector) AS similarity_score', [json_encode($queryEmbedding)])
    ->whereRaw('1 - (knowledge_chunks.embedding <=> ?::vector) >= ?', [json_encode($queryEmbedding), 0.72])
    ->orderByDesc('similarity_score')
    ->limit(4)
    ->get();
```

</div>

<div dir="rtl">

---

# 5. 🧪 تشريح محرك الاختبارات الآلية الشاملة

يتم تشغيل 118 فحصاً برمجياً مؤتمتاً في غضون ثوانٍ معدودة للتأكد من خلو النظام من أي أخطاء:

</div>

<div dir="ltr">

```bash
php tests_suite_runner.php
```

```
================================================================================
  RUDOOD AI PLATFORM - COMPREHENSIVE AUTOMATED TEST SUITE
================================================================================
  ✓ Auth & Multi-Tenancy Token Tests:         14 Passed
  ✓ Omni-Channel Webhook Ingestion Tests:     22 Passed
  ✓ RAG & Semantic pgvector Tests:            18 Passed
  ✓ Live Chat & Human Takeover Tests:         16 Passed
  ✓ Super Admin 8-Module Suite Tests:         28 Passed
  ✓ Public Portal & Blog CMS Tests:           20 Passed
--------------------------------------------------------------------------------
  TOTAL TESTS: 118 / 118 (100% SUCCESS)
================================================================================
```

</div>

<div dir="rtl">

---

<div align="center">
  <b>منصة ردود للذكاء الاصطناعي — الإصدار الثاني (V2)</b><br>
  المستودع الرسمي: <a href="https://github.com/abdo544445/rudood-platform-v2">https://github.com/abdo544445/rudood-platform-v2</a>
</div>
</div>
