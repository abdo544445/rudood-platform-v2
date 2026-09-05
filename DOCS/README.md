# 📚 مركز التوثيق الشامل لمنصة ردود للذكاء الاصطناعي
# Rudood AI Omni-Channel Platform Documentation Hub

مرحباً بك في مركز التوثيق الهندسي لمنصة **ردود (Rudood AI)**.  
يحتوي هذا المجلد على أرشيف وثائق المنصة مقسماً حسب المعمارية والإصدارات:

---

## 📂 خريطة مجلدات التوثيق (Documentation Sections)

### 🚀 [1. وثائق الإصدار الثاني الحالية — V2 (Decoupled SPA Architecture)](./v2/README.md)
**الإصدار المعتمد والنشط حالياً على المنصة.**
* **الواجهة الأمامية**: React 19 (`v19.0.0`) + TypeScript (`v5.7`) + Vite 6 + Zustand + Axios.
* **الواجهة الخلفية**: Laravel 11.x REST API (`/api/v1/*`) + PostgreSQL 16 `pgvector` + Redis.
* **الملفات المتوفرة داخل المجلد:**
  1. [`RUDOOD_PLATFORM_V2_COMPLETE_ARCHITECTURE_OUTLINE.md`](./v2/RUDOOD_PLATFORM_V2_COMPLETE_ARCHITECTURE_OUTLINE.md) — المخطط المعماري الكامل ومسارات تدفق البيانات.
  2. [`RUDOOD_PLATFORM_V2_COMPLETE_CODE_AND_SYNTAX_GUIDE.md`](./v2/RUDOOD_PLATFORM_V2_COMPLETE_CODE_AND_SYNTAX_GUIDE.md) — الدليل البرمجي الشامل لكود React و TypeScript و Laravel و SQL.
  3. [`RUDOOD_PLATFORM_V2_BEGINNER_STUDENT_MASTER_GUIDE.md`](./v2/RUDOOD_PLATFORM_V2_BEGINNER_STUDENT_MASTER_GUIDE.md) — الموسوعة التعليمية الشاملة للطلاب والمطورين الجدد مع 10 تمارين محلولة.
  4. [`RUDOOD_PLATFORM_V2_TESTING_AND_VERIFICATION_GUIDE.md`](./v2/RUDOOD_PLATFORM_V2_TESTING_AND_VERIFICATION_GUIDE.md) — دليل تشغيل وتفاصيل 118 فحصاً آلياً (نجاح بنسبة 100%).

---

### 🏛️ [2. وثائق الإصدار الأول — V1 (Legacy Monolith Architecture)](./v1/README.md)
**الأرشيف التاريخي للإصدار الأولي السابق.**
* معمارية موحدة عبر قوالب Laravel 11 Blade Views و Bootstrap 5.3 RTL.
* يحتوي على الكتيبات القديمة بصيغ `.md` و `.html` و `.pdf`.
