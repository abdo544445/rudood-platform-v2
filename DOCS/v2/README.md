# 🚀 وثائق الإصدار الثاني — Rudood Platform V2 Documentation (Decoupled SPA Architecture)

مرحباً بك في المركز التوثيقي الشامل لـ **الإصدار الثاني (V2)** لمنصة ردود للذكاء الاصطناعي (Rudood AI Omni-Channel Platform).  
تمت إعادة هيكلة المنصة في هذا الإصدار بالكامل لتعمل بنمط **المعمارية المستقلة (Decoupled Client-Server Architecture)**، بفصل كامل بين الواجهة الأمامية والخلفية:

* **الواجهة الأمامية (Frontend SPA)**: مبنية بأحدث إصدار من مكتبة **React 19 (`v19.0.0`)** مع لغة **TypeScript (`v5.7`)** وأداة البناء الخارقة **Vite (`v6.2`)** وتصميم زجاجي فاخر بالكامل (**Vanilla CSS Design System & Cairo Font**).
* **النواة الخلفية (Backend Core)**: واجهات برمجة تطبيقات مستقلة بنمط **Laravel 11 REST API** تعمل عبر مسارات `/api/v1/*` مع نظام صلاحيات التوكنز والـ Multi-Tenancy.
* **قاعدة البيانات والذكاء الاصطناعي**: محرك استرجاع المعرفة الدلالي بالمتجهات عبر **PostgreSQL 16 + `pgvector`** وطوابير **Redis** المعزولة وخدمة الويب سوكت اللحظية عبر **Node.js Socket.IO**.

---

## 📑 فهرس وثائق الإصدار الثاني (V2 Documentation Suite)

تم إعداد وثائق V2 بنفس الهيكلية التفصيلية السابقة، مع تحديث شامل لكافة الشيفرات البرمجية، المخططات، والمفاهيم لتغطي الحزمة التقنية الجديدة:

| المستند | الوصف والمحتوى |
| :--- | :--- |
| **[1. المخطط المعماري الكامل (Architecture Outline)](file:///Users/alatrash/Documents/work/lara%20/HERE%20PROJECT/rudood-platform/DOCS/v2/RUDOOD_PLATFORM_V2_COMPLETE_ARCHITECTURE_OUTLINE.md)** | تشريح معماري شامل لطبقات النظام الخمس، دورة حياة الطلب عبر Axios و REST API، نظام الـ WebSockets اللحظي، ومسار الذكاء الاصطناعي متعدد المستويات (3-Tier AI Engine). |
| **[2. الدليل البرمجي والصيغ التراكيبية (Code & Syntax Guide)](file:///Users/alatrash/Documents/work/lara%20/HERE%20PROJECT/rudood-platform/DOCS/v2/RUDOOD_PLATFORM_V2_COMPLETE_CODE_AND_SYNTAX_GUIDE.md)** | تحليل برمجي مفصل سطراً بسطر لمكونات React 19، الخطافات (Hooks)، إدارة الحالة عبر Zustand، متحكمات Laravel REST، استعلامات pgvector، وجناح Super Admin ذو الـ 8 تبويبات. |
| **[3. الموسوعة التعليمية الشاملة للطلاب (Student Master Guide)](file:///Users/alatrash/Documents/work/lara%20/HERE%20PROJECT/rudood-platform/DOCS/v2/RUDOOD_PLATFORM_V2_BEGINNER_STUDENT_MASTER_GUIDE.md)** | مرجع تعليمي ضخم ينطلق من الصفر لشرح المعمارية المفصولة (Decoupled vs Monolith)، كيف تعمل الـ SPAs، مصادقة JWT، والرياضيات وراء متجهات الذكاء الاصطناعي مع 10 تمارين عملية وحلولها. |
| **[4. دليل الاختبارات والتحقق البرمجي (Testing & Verification Guide)](file:///Users/alatrash/Documents/work/lara%20/HERE%20PROJECT/rudood-platform/DOCS/v2/RUDOOD_PLATFORM_V2_TESTING_AND_VERIFICATION_GUIDE.md)** | توثيق كامل لـ 118 اختباراً آلياً تغطي وحدات النظام بنسبة نجاح 100%، مع خطوات تشغيل الفحوصات والتحقق الأمني. |

---

## 🔄 المقارنة بين V1 و V2 (Key Architectural Upgrades)

| وجه المقارنة | الإصدار الأول (V1) | الإصدار الثاني (V2) | الفائدة والقيمة التقنية المضافة |
| :--- | :--- | :--- | :--- |
| **واجهة المستخدم** | Laravel Blade Views (Monolith) | **React 19 SPA + TypeScript** | سرعة فائقة في التنقل بدون إعادة تحميل الصفحة (Zero Reloads) وتجربة مستخدم شبيهة بالتطبيقات الأصلية. |
| **أداة البناء** | Vite (Laravel Plugin) | **Vite 6 Client SPA** | زمن بناء فائق الصغر (`292ms`)، وفصل كامل لملفات الإنتاج الثابتة. |
| **إدارة الحالة** | جلسات المتصفح (PHP Sessions) | **Zustand (`useAuthStore`)** | تخزين الحالة محلياً وإعادة المزامنة التلقائية مع الخادم بدون استهلاك موارد الذاكرة في PHP. |
| **بروتوكول الاتصال** | Form Submits + AJAX جزئي | **REST API (`/api/v1/*`) + Axios** | استقلالية تامة للواجهة الخلفية، مما يسمح بتوصيل تطبيقات Mobile أو أنظمة خارجية بنفس الـ API. |
| **لوحة الإدارة العليا** | لوحة عادية بتبويبات متباعدة | **جناح 8 تبويبات شامل (/admin)** | إدارة الشركات، التحليلات المتقدمة (MRR/ARR)، محاكي استعلامات SQL، وسجل التدقيق في شاشة واحدة. |
| **محرك البوت** | إعدادات محدودة في المتجر | **Omni-Channel Hub متكامل** | مفتاح تشغيل رئيسي، جالب نماذج AI لحظي، ومحدد دقيق للتوكنز والحرارة. |
| **حزمة الاختبارات** | 102 اختباراً | **118 اختباراً مؤتمتاً (100% Pass)** | تغطية شاملة لكافة وحدات الـ API الجديدة ونظام الصلاحيات. |

---

> 🔗 للاطلاع على وثائق الإصدار الأول القديمة، يمكنك الرجوع إلى: **[DOCS/v1/](../v1/README.md)**.
