<div dir="rtl">

# 🎓 الموسوعة التعليمية الشاملة لطلاب هندسة البرمجيات — الإصدار الثاني (V2)
# The Ultimate Software Engineering & Computer Science Student Master Guide (Decoupled V2)

> **إعداد:** إدارة المعمارية التقنية لمنصة ردود للذكاء الاصطناعي (Rudood AI Platform)  
> **الفئة المستهدفة:** طلاب كليات علوم الحاسب، هندسة البرمجيات، ومطورو الويب المبتدئون (Junior Full-Stack Developers)  
> **الحزمة التقنية:** React 19 SPA | TypeScript 5.7 | Vite 6 | Zustand | Axios | Laravel 11 REST API | PostgreSQL 16 pgvector | Redis  
> **المستودع الرسمي:** [https://github.com/abdo544445/rudood-platform-v2](https://github.com/abdo544445/rudood-platform-v2)

---

## 📑 فهرس الموسوعة التعليمية (Table of Contents)

1. [🌟 1. مدخل تمهيدي: ما هي منصة ردود وكيف تفكر كمهندس برمجيات؟](#1-مدخل-تمهيدي-ما-هي-منصة-ردود-وكيف-تفكر-كمهندس-برمجيات)
2. [🔄 2. ما هي المعمارية المفصولة (Decoupled vs Monolith) ولماذا انتقلنا إليها؟](#2-ما-هي-المعمارية-المفصولة-decoupled-vs-monolith-ولماذا-انتقلنا-إليها)
3. [⚛️ 3. كيف تعمل تطبيقات الصفحة الواحدة (SPAs) في React 19؟](#3-كيف-تعمل-تطبيقات-الصفحة-الواحدة-spas-في-react-19)
4. [📘 4. لماذا يعتبر TypeScript 5.7 معيار الشركات الكبرى؟](#4-لماذا-يعتبر-typescript-57-معيار-الشركات-الكبرى)
5. [🔐 5. كيف تعمل المصادقة بالتوكنز (Stateless Token Authentication)؟](#5-كيف-تعمل-المصادقة-بالتوكنز-stateless-token-authentication)
6. [🧠 6. كيف يعمل البحث الدلالي والـ RAG في قواعد البيانات ببساطة؟](#6-كيف-يعمل-البحث-الدلالي-والـ-rag-في-قواعد-البيانات-ببساطة)
7. [⚡ 7. ما هي الطوابير غير المتزامنة (Queues) ولماذا نحتاج Redis؟](#7-ما-هي-الطوابير-غير-المتزامنة-queues-ولماذا-نحتاج-redis)
8. [🛠️ 8. مسار التطبيق العملي: 10 تمارين برمجية للطلاب مع الحلول الكاملة](#8-مسار-التطبيق-العملي-10-تمارين-برمجية-للطلاب-مع-الحلول-الكاملة)
9. [🐞 9. دليل استكشاف الأخطاء وحلها للمطورين الجدد (Troubleshooting)](#9-دليل-استكشاف-الأخطاء-وحلها-للمطورين-الجدد-troubleshooting)

---

# 1. 🌟 مدخل تمهيدي: ما هي منصة ردود وكيف تفكر كمهندس برمجيات؟

تخيل أن متجراً إلكترونياً يتلقى **50,000 رسالة يومياً** عبر قنوات التواصل (WhatsApp، Telegram، Instagram، شات المتجر).
إذا قمت بتوظيف موظفي خدمة عملاء بشريين، ستواجه المشكلات التالية:
1. **تكلفة مالية هائلة** لرواتب الموظفين على مدار الساعة.
2. **بطء زمن الرد** (قد ينتظر العميل ساعات لتلقي إجابة بسيطة).
3. **أخطاء بشرية وتضارب المعلومات** بين الموظفين.

**الحل الهندسي الذكي:**
بناء منصة مركزية تستقبل كافة الرسائل عبر **Webhooks** في أجزاء من الثانية، وتمررها لمحرك ذكاء اصطناعي يفهم اللهجات العربية ويسترجع إجاباته من كتيبات المتجر وسياساته (**RAG**)، ليرد على العميل خلال أقل من ثانية ونصف!

---

# 2. 🔄 ما هي المعمارية المفصولة (Decoupled vs Monolith)؟

### في الإصدار الأول (V1 Monolith):
* كان خادم PHP يقوم بتوليد كود HTML لكل صفحة عبر قوالب Blade وإرسالها للمتصفح.
* عند كل نقرة، يُعاد تحميل الصفحة بالكامل، مما يستهلك موارد الخادم ويزيد زمن الاستجابة.

### في الإصدار الثاني (V2 Decoupled SPA):
* **فصل كامل:** الواجهة الأمامية مبنية كـ SPA مستقل عبر React 19 و TypeScript، ويتم تجميعها لملفات ثابتة (HTML + CSS + JS) تُحمّل لمرة واحدة فقط في متصفح العميل.
* **التخاطب عبر JSON:** يتخاطب المتصفح مع خادم Laravel حصراً عبر استدعاءات REST API ترسل وتستقبل نصوص JSON فقط.

</div>

<div dir="ltr">

```
[ Browser Client ] ◄─── JSON (REST API) ───► [ Laravel 11 Backend ] ◄───► [ PostgreSQL ]
 (React 19 SPA)                                 (Core Engine)
```

</div>

<div dir="rtl">

---

# 3. ⚛️ كيف تعمل تطبيقات الصفحة الواحدة (SPAs) في React 19؟

في تطبيقات الـ SPA:
1. يطلب المتصفح الموقع لأول مرة، فيستقبل ملف `index.html` مع حزمة الجافاسكريبت.
2. عند الضغط على أي رابط (مثل الانتقال من `/dashboard` إلى `/chat`):
   - **لا يُعاد تحميل الصفحة مطلفاً (Zero Reload)**.
   - يتولى `react-router` التقاط الرابط وتغيير المكون المعروض في الـ DOM في أجزاء من الملي ثانية.
   - يطلب تطبيق React البيانات الناقصة من الـ API عبر Axios في الخلفية ويعرضها بسلاسة تامة.

---

# 4. 📘 لماذا يعتبر TypeScript 5.7 معيار الشركات الكبرى؟

في JavaScript العادية، يمكنك ارتكاب أخطاء فادحة لا تظهر إلا للمستخدم النهائي عند تشغيل التطبيق (Runtime Errors):

</div>

<div dir="ltr">

```javascript
// JavaScript: Uncaught TypeError at runtime
function getUserName(user) {
  return user.name.toUpperCase(); // Crashes if user is null or name is undefined!
}
```

</div>

<div dir="rtl">

بينما في TypeScript يتم اكتشاف الخطأ فوراً أثناء الكتابة قبل النشر:

</div>

<div dir="ltr">

```typescript
// TypeScript: Compile-time type safe
interface User {
  id: number;
  name: string;
}

function getUserName(user: User): string {
  return user.name.toUpperCase(); // 100% Type-safe
}
```

</div>

<div dir="rtl">

---

# 5. 🔐 كيف تعمل المصادقة بالتوكنز (Stateless Token Auth)؟

بدلاً من تخزين جلسات المستخدمين في ذاكرة خادم PHP (Sessions):
1. يرسل المستخدم بريده وكلمة المرور إلى `/api/v1/auth/login`.
2. يتحقق الخادم من صحة البيانات ويُصدر نصاً مشفراً (Token) مثل: `1|a8f93bc...`.
3. يحفظ تطبيق React هذا التوكن في متجر **Zustand** المحلي.
4. في كل طلب لاحق، يُحقن التوكن في ترويسة الطلب:

</div>

<div dir="ltr">

```http
GET /api/v1/conversations
Authorization: Bearer 1|a8f93bc...
```

</div>

<div dir="rtl">

5. يتحقق الخادم من التوكن وصلاحياته فوراً دون الحاجة لقراءة ملفات جلسات محلية.

---

# 6. 🧠 كيف يعمل البحث الدلالي والـ RAG ببساطة؟

**RAG (Retrieval-Augmented Generation):**
الذكاء الاصطناعي العام (مثل GPT أو Gemini) لا يعرف تفاصيل متجرك الداخلي وسياسة الإرجاع الخاصة بك.  
بدلاً من إعادة تدريب نموذج الذكاء الاصطناعي (وهو أمر مكلف جداً):
1. نقوم بتقطيع كتيب المتجر إلى فقرات صغيرة (Chunks).
2. نمرر كل فقرة لنموذج ذكاء اصطناعي يحولها إلى **مصفوفة أرقام رياضية (Vector Embedding)** تمثل معناها الدلالي.
3. نخزن هذه المتجهات في قاعدة بيانات **PostgreSQL** عبر إضافة **`pgvector`**.
4. عندما يسأل العميل: *"ما هي مدة إرجاع السماعات؟"*:
   - نحول سؤاله لمتجه أرقام.
   - نقارن المتجه مع متجهات المستندات في قاعدة البيانات عبر حساب زاوية جيب التمام (**Cosine Similarity**).
   - نستخرج الفقرة الأكثر تطابقاً ونمررها للـ LLM ليرد بناءً عليها بدقة 100% دون هلوسة.

---

# 7. ⚡ ما هي الطوابير غير المتزامنة (Queues) ولماذا نحتاج Redis؟

عندما يرسل واتساب Webhook باستفسار عميل، يتوقع واتساب استجابة HTTP 200 خلال **أقل من 3 ثوانٍ** وإلا سيعتبر الخادم معطلاً ويعيد إرسال الرسالة!  
استدعاء الذكاء الاصطناعي والبحث الدلالي قد يستغرق ثانية أو ثانيتين، فإذا استدعيناه مباشرة في مسار الـ Webhook، ستختنق الخوادم عند وصول آلاف الرسائل.

**الحل بالـ Queues:**
1. يستقبل متحكم الـ Webhook الرسالة ويضعها في طابور **Redis** في غضون **5 ملي ثانية**.
2. يُعيد للمرسل فوراً: `{"status": "queued"}` مع كود HTTP 200.
3. في الخلفية، يعمل عامل معالجة مستقل (**Queue Worker**):

</div>

<div dir="ltr">

```bash
php artisan queue:work --queue=ai-processing
```

</div>

<div dir="rtl">

4. يقوم العامل بمعالجة كل رسالة بهدوء وإرسال الرد للعميل دون تعطيل خادم الويب.

---

# 8. 🛠️ مسار التطبيق العملي: 10 تمارين برمجية للطلاب مع الحلول

### التمرين 1: كتابة واجهة TypeScript لمستخدم المتجر
**المطلوب:** اكتب `interface` بلغة TypeScript تُمثل مستخدم النظام `StoreUser` مع الحقول: المعرف الرقمي، الاسم، البريد، الدور (أدمن، مالك، وكيل)، وحقل اختياري للمتجر.

**الحل:**

</div>

<div dir="ltr">

```typescript
export interface StoreUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'agent';
  store_id?: number;
  created_at: string;
}
```

</div>

<div dir="rtl">

---

### التمرين 2: إنشاء دالة فحص الصلاحية في Zustand
**المطلوب:** أضف دالة `isAdmin()` لمتجر Zustand لمعرفة ما إذا كان المستخدم الحالي مديراً أعلى للمنصة.

**الحل:**

</div>

<div dir="ltr">

```typescript
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: () => get().user?.role === 'admin',
}));
```

</div>

<div dir="rtl">

---

### التمرين 3: اعتراض الأخطاء 401 وإعادة التوجيه لصفحة الدخول
**المطلوب:** اكتب Axios Interceptor يقوم بتسجيل خروج المستخدم تلقائياً وتوجيهه لصفحة الدخول عند انتهاء صلاحية التوكن (Status 401).

**الحل:**

</div>

<div dir="ltr">

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rudood-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

</div>

<div dir="rtl">

---

### التمرين 4: إضافة زر التدخل البشري لمحادثة معينة
**المطلوب:** دالة React تستدعي مسار تعطيل البوت `/api/v1/conversations/:id/toggle-bot` وتحدث حالة الزر.

**الحل:**

</div>

<div dir="ltr">

```typescript
const toggleBotStatus = async (conversationId: number, currentStatus: boolean) => {
  try {
    const res = await apiClient.post(`/conversations/${conversationId}/toggle-bot`, {
      bot_enabled: !currentStatus
    });
    setBotActive(!currentStatus);
  } catch (err) {
    console.error('فشل تغيير حالة البوت', err);
  }
};
```

</div>

<div dir="rtl">

---

### التمرين 5: كتابة استعلام استرجاع المقاطع الأكثر شبهاً في Laravel
**المطلوب:** كتابة استعلام Eloquent باستخدام إضافة `pgvector` للبحث عن أقرب 3 مقاطع لسؤال العميل بنسبة تشابه أعلى من 75%.

**الحل:**

</div>

<div dir="ltr">

```php
$chunks = DB::table('knowledge_chunks')
    ->select('content')
    ->selectRaw('1 - (embedding <=> ?::vector) as similarity', [json_encode($queryVector)])
    ->whereRaw('1 - (embedding <=> ?::vector) >= ?', [json_encode($queryVector), 0.75])
    ->orderByDesc('similarity')
    ->limit(3)
    ->get();
```

</div>

<div dir="rtl">

---

# 9. 🐞 دليل استكشاف الأخطاء وحلها للمطورين الجدد

| المشكلة أو رسالة الخطأ | السبب الشائع | طريقة الحل الفورية |
| :--- | :--- | :--- |
| `Network Error` أو `CORS policy` | خادم الـ API غير مشغل أو لم يتم تفعيل الـ CORS في Laravel. | تأكد من تشغيل `php artisan serve --port=8000`، وتحقق من ملف `config/cors.php`. |
| `401 Unauthorized` متكرر | التوكن غير موجود في ترويسة الطلب أو انتهت صلاحيته. | افحص `localStorage` وتأكد من عمل `apiClient.interceptors.request`. |
| `Call to undefined method <=> in Postgres` | إضافة `pgvector` غير مثبتة في قاعدة البيانات. | نفذ الاستعلام: `CREATE EXTENSION IF NOT EXISTS vector;` في قاعدة البيانات. |
| الواجهة لا تحدث الرسائل الجديدة تلقائياً | خادم Socket.IO اللحظي متوقف. | شغل خادم الويب سوكت: `node backend/websocket/server.js`. |

---

<div align="center">
  <b>منصة ردود للذكاء الاصطناعي — الإصدار الثاني (V2)</b><br>
  المستودع الرسمي: <a href="https://github.com/abdo544445/rudood-platform-v2">https://github.com/abdo544445/rudood-platform-v2</a>
</div>
</div>
