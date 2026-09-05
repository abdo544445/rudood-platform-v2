<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use Illuminate\Support\Carbon;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'slug'         => 'how-ai-boosts-sales-40-percent',
                'title'        => 'كيف يرفع الذكاء الاصطناعي التكيفي مبيعات متجرك بنسبة 40%؟',
                'summary'      => 'التعرف على كيفية استخدام تقنيات الشات بوت الحديثة للرد اللحظي على استفسارات العملاء ومتابعة السلات المتروكة تلقائياً دون تدخل بشري.',
                'content'      => '<p class="lead text-white font-bold mb-4">في عالم التجارة الإلكترونية السريع، سرعة الرد على العملاء ليست مجرد ميزة رفاهية، بل هي الفارق الحقيقي بين إتمام عملية البيع أو خروج العميل وتوجهه للمنافسين.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">1. الاستجابة اللحظية في جميع الأوقات</h3>
                <p class="text-slate-300 leading-relaxed mb-4">تشير الدراسات إلى أن العميل يتوقع الرد خلال أقل من 5 دقائق عند الاستفسار عبر المحادثات المباشرة أو واتساب. باستخدام شات بوت منصة ردود المتطورة، يتم الرد على استفسارات الأسعار، التوصيل، وحالة الطلبات فوراً في أي وقت على مدار 24 ساعة.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">2. استعادة السلات المتروكة تلقائياً</h3>
                <p class="text-slate-300 leading-relaxed mb-4">يترك معظم المتسوقين أسرّتهم ومشترياتهم في السلة قبل الخطوة الأخيرة. يمكن لربط المتجر بالذكاء الاصطناعي إرسال تذكير مخصص ولطيف للعميل عبر الواتساب مع رابط مباشر لإتمام الشراء، مما يعيد نسبة كبيرة من هذه المبيعات الضائعة.</p>
                <div class="p-4 my-6 rounded-2xl border-r-4 border-amber-400 bg-amber-500/10 text-amber-200">
                    <p class="mb-0 italic font-medium">"العميل لا ينتظر.. السرعة والموثوقية في الرد الآلي هي المفتاح الأول لتحويل الاستفسار العابر إلى صفقة ناجحة."</p>
                </div>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">3. تحليل سلوك العميل وتخصيص العروض</h3>
                <p class="text-slate-300 leading-relaxed mb-4">لا يقتصر دور ردود على الإجابة الجافة، بل يتعلم نظام الذكاء الاصطناعي من تفضيلات العملاء، ويقترح عليهم المنتجات المناسبة بناءً على اهتماماتهم السابقة، مما يرفع متوسط قيمة السلة الشرائية بشكل ملحوظ.</p>',
                'category'     => 'أتمتة وذكاء اصطناعي',
                'read_time'    => '5 دقائق',
                'icon'         => 'bi-robot',
                'is_featured'  => true,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-09-04 10:00:00'),
            ],
            [
                'slug'         => 'vector-rag-future-of-ai-customer-support',
                'title'        => 'ما هي تقنية Vector RAG ولماذا هي مستقبل خدمة العملاء بالذكاء الاصطناعي؟',
                'summary'      => 'شرح معمق لكيفية تدريب البوت على كتالوج ومستندات متجرك باستخدام المتجهات الدلالية لمنع الهلوسة وتقديم إجابات دقيقة 100%.',
                'content'      => '<p class="lead text-white font-bold mb-4">تعتمد أنظمة خدمة العملاء التقليدية على الكلمات المفتاحية الجامدة، مما يؤدي إلى فشلها التام عند صياغة العميل لسؤاله بطريقة غير متوقعة أو باللهجة العامية. هنا يأتي دور تقنية توليد الإجابات المعزز بالاسترجاع الدلالي (RAG).</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">كيف تعمل تقنية Vector RAG داخل منصة ردود؟</h3>
                <p class="text-slate-300 leading-relaxed mb-4">عند قيام التاجر برفع كتالوج المنتجات أو ملفات السياسات (PDF / Word)، يقوم محرك ردود بتقسيم المستند إلى مقاطع دلالية (Chunks) وتحويلها إلى متجهات رقمية متعددة الأبعاد (Vector Embeddings) وتخزينها في قاعدة بيانات PostgreSQL المدعومة بملحق pgvector.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">معالجة استفسار العميل بالبحث الدلالي</h3>
                <p class="text-slate-300 leading-relaxed mb-4">عندما يرسل العميل استفساراً مثل: "هل يشمل التوصيل مناطق أطراف مكة؟"، لا يبحث النظام عن تطابق حرفي، بل يقيس التقارب الدلالي عبر خوارزمية (Cosine Similarity)، ويستخرج الفقرة الدقيقة الخاصة بنطاق الشحن، ثم يوجهها لنموذج الذكاء الاصطناعي ليصيغ رداً سلساً وبلهجة ودية.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">القضاء على مشكلة الهلوسة (Zero Hallucination)</h3>
                <p class="text-slate-300 leading-relaxed mb-4">أكبر تحديات النماذج العامة هو اختلاق معلومات غير صحيحة. يضمن نظام RAG حصر إجابات المساعد الذكي بما هو موجود في مستنداتك المعتمدة فقط، مع توجيه العميل للدعم البشري في حال عدم توفر المعلومة.</p>',
                'category'     => 'تقنية وذكاء اصطناعي',
                'read_time'    => '6 دقائق',
                'icon'         => 'bi-cpu',
                'is_featured'  => true,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-09-03 14:30:00'),
            ],
            [
                'slug'         => 'whatsapp-business-integration-guide',
                'title'        => 'دليل ربط واتساب الأعمال بمنصة ردود خلال 5 دقائق',
                'summary'      => 'شرح خطوة بخطوة لربط رقمك التجاري والاستفادة من الرد الفوري الموحد لجميع عملائك.',
                'content'      => '<p class="lead text-white font-bold mb-4">يعتبر تطبيق واتساب الأعمال الوسيلة الأولى للتواصل والتسويق المباشر في منطقة الشرق الأوسط.</p>
                <p class="text-slate-300 leading-relaxed mb-4">باستخدام واجهات برمجة التطبيقات الرسمية من Meta ومنصة ردود، يمكنك ربط رقمك وتفعيل الردود التلقائية الذكية، وتعيين المحادثات لأفراد الفريق بأسلوب منظم وسلس.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">خطوات الربط الأساسية</h3>
                <ul class="list-disc list-inside text-slate-300 space-y-2 mb-4">
                    <li>إنشاء حساب في Meta Business Suite والتحقق من النشاط التجاري.</li>
                    <li>إصدار مفتاح الوصول الدائم (System User Token) ورقم معرف الهاتف (Phone Number ID).</li>
                    <li>إدخال البيانات في لوحة قنوات منصة ردود وتفعيل الـ Webhook الفوري.</li>
                    <li>اختبار إرسال الرسائل التفاعلية والأزرار السريعة.</li>
                </ul>',
                'category'     => 'أتمتة المحادثات',
                'read_time'    => '4 دقائق',
                'icon'         => 'bi-whatsapp',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-09-02 09:15:00'),
            ],
            [
                'slug'         => 'abandoned-cart-recovery-whatsapp-strategies',
                'title'        => 'استراتيجيات استرجاع السلات المتروكة ومضاعفة معدل الإتمام في المتاجر السعودية',
                'summary'      => 'كيف تساهم رسائل واتساب الذكية والمحفزة في استعادة أكثر من 28% من السلات المتروكة وزيادة الإيرادات الشهرية.',
                'content'      => '<p class="lead text-white font-bold mb-4">يبلغ متوسط معدل السلات المتروكة في التجارة الإلكترونية عالمياً ما يقارب 70%. ولكن مع واتساب، يمتلك التاجر وسيلة وصول مباشرة تفتح خلال 3 دقائق بنسبة تتجاوز 90%.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">التوقيت الذهبي لإرسال التذكير</h3>
                <p class="text-slate-300 leading-relaxed mb-4">أظهرت الإحصائيات أن إرسال رسالة تذكير بعد 30 إلى 60 دقيقة من ترك السلة يحقق أعلى معدل استجابة، حيث يكون العميل لا يزال مهتماً بالمنتج ولكن واجه تشتتاً مؤقتاً.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">استخدام الحوافز الذكية</h3>
                <p class="text-slate-300 leading-relaxed mb-4">تضمين كود خصم إضافي بنسبة 10% أو عرض شحن مجاني محدود الصلاحية (مثلاً: صالح لمدة ساعتين) يخلق شعوراً بإلحاح الفرصة (FOMO) ويدفع العميل لإتمام الدفع فوراً عبر الرابط المباشر المرفق بالرسالة.</p>',
                'category'     => 'استراتيجيات التجارة',
                'read_time'    => '5 دقائق',
                'icon'         => 'bi-cart-check',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-09-01 16:45:00'),
            ],
            [
                'slug'         => '5-fatal-customer-service-mistakes',
                'title'        => '5 أخطاء قاتلة في خدمة العملاء تكلفك فقدان المبيعات',
                'summary'      => 'التأخر في الرد والإجابات الإنشائية قد تبعد عنك العميل. تعرف على كيفية حل هذه المشاكل بذكاء.',
                'content'      => '<p class="lead text-white font-bold mb-4">خدمة العملاء السيئة كفيلة بإغلاق متجرك وإبعاد المبيعات حتى مع وجود ميزانيات تسويق ضخمة.</p>
                <p class="text-slate-300 leading-relaxed mb-4">أبرز هذه الأخطاء هو البطء الشديد في الرد وعدم توفير إجابات واضحة، بالإضافة إلى غياب الدعم خارج ساعات العمل الرسمية.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">أبرز الأخطاء الشائعة:</h3>
                <ol class="list-decimal list-inside text-slate-300 space-y-2 mb-4">
                    <li><strong>البطء في الاستجابة:</strong> انتظار العميل لأكثر من 15 دقيقة يعني بنسبة 60% توجهه لمتجر منافس.</li>
                    <li><strong>الإجابات المنسوخة الباردة:</strong> الردود الآلية الجامدة التي لا تفهم سياق استفسار العميل.</li>
                    <li><strong>عدم متابعة الشكاوى:</strong> ترك شكوى العميل معلقة دون تتبع أو تصعيد.</li>
                    <li><strong>تشتت قنوات التواصل:</strong> الرد على إنستغرام وتجاهل الواتساب أو العكس.</li>
                    <li><strong>غياب الدعم الليلي:</strong> غالبية عمليات التسوق الإلكتروني تتم بين 9 مساءً و 2 صباحاً.</li>
                </ol>',
                'category'     => 'خدمة العملاء',
                'read_time'    => '6 دقائق',
                'icon'         => 'bi-headset',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-08-30 11:20:00'),
            ],
            [
                'slug'         => 'understand-customer-behavior-analytics',
                'title'        => 'كيف تفهم سلوك عملائك من خلال لوحة تحليلات ردود؟',
                'summary'      => 'قراءة البيانات وتحليل أكثر الأسئلة تكراراً تساعدك في تطوير منتجاتك وتسريع عمليات البيع.',
                'content'      => '<p class="lead text-white font-bold mb-4">تعتبر البيانات هي الأصول الأكثر قيمة لأي رائد أعمال في العصر الرقمي.</p>
                <p class="text-slate-300 leading-relaxed mb-4">تقدم لك لوحة تحليلات منصة ردود تقارير فورية عن أكثر الكلمات تكراراً، وأوقات الذروة التي يزداد فيها تواصل العملاء، ونسبة إغلاق المبيعات التلقائية (Deflection Rate).</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">المقاييس الجوهرية للنجاح</h3>
                <p class="text-slate-300 leading-relaxed mb-4">من خلال تتبع مؤشر العائد على الاستثمار (ROI) ومعدل رضا العملاء (CSAT) المدمج، يمكنك معرفة تكلفة المحادثة الواحدة ومقدار التوفير المالي المحقق مقارنة بتوظيف وكلاء خدمة عملاء بشريين بدوام كامل.</p>',
                'category'     => 'تحليلات وأرقام',
                'read_time'    => '5 دقائق',
                'icon'         => 'bi-graph-up-arrow',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-08-28 13:00:00'),
            ],
            [
                'slug'         => 'meta-whatsapp-cloud-api-compliance-guide',
                'title'        => 'دليل الامتثال لسياسات Meta وتأمين أرقام الواتساب التجارية من الحظر',
                'summary'      => 'أهم القواعد لتأكيد توثيق العلامة الخضراء، واعتماد القوالب الرسمية، والحفاظ على تصنيف الجودة العالي.',
                'content'      => '<p class="lead text-white font-bold mb-4">إن استخدام حلول غير معتمدة أو روبوتات غير رسمية يعرض رقم متجرك للحظر الدائم وخسارة قاعدة عملائك. توفر منصة ردود اتصالاً رسمياً 100% عبر Meta Cloud API المعتمد.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">1. الحصول على موافقة العميل المسبقة (Opt-in)</h3>
                <p class="text-slate-300 leading-relaxed mb-4">تشترط سياسات Meta موافقة العميل الصريحة على تلقي إشعارات الطلبات أو الرسائل الترويجية، سواء أثناء مرحلة الدفع في المتجر أو عبر بدء العميل للمحادثة بنفسه.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">2. مراقبة تصنيف جودة الرقم (Quality Rating)</h3>
                <p class="text-slate-300 leading-relaxed mb-4">ينقسم مؤشر الجودة في Meta إلى ثلاثة مستويات: عالي (أخضر)، متوسط (أصفر)، ومنخفض (أحمر). تحافظ منصة ردود على بقاء رقمك في المستوى الأخضر من خلال توزيع فترات الإرسال وتجنب الإرسال الجماعي العشوائي (Spam).</p>',
                'category'     => 'أدلة التشغيل',
                'read_time'    => '7 دقائق',
                'icon'         => 'bi-shield-check',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-08-26 15:10:00'),
            ],
            [
                'slug'         => 'generative-ai-vs-traditional-chatbots',
                'title'        => 'مقارنة شاملة: روبوتات المحادثة التقليدية مقابل الذكاء الاصطناعي التوليدي',
                'summary'      => 'لماذا لم تعد شجرة القرارات والأزرار الجامدة كافية، وكيف يصنع الفهم اللغوي الطبيعي فارقاً جذرياً في تجربة العميل.',
                'content'      => '<p class="lead text-white font-bold mb-4">لأكثر من عقد، اعتمدت المتاجر على شات بوت القوائم الرقمية مثل: "اضغط 1 للأسعار، اضغط 2 للشكاوى". ولكن المستهلك اليوم يبحث عن تجربة تواصل طبيعية ومرنة تحاكي التحدث مع بائع خبير في المتجر الواقعي.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">الفروقات الجوهرية في التجربة</h3>
                <div class="overflow-x-auto my-4">
                    <table class="w-full text-xs text-right border border-white/10 rounded-xl overflow-hidden">
                        <thead class="bg-slate-800 text-amber-300">
                            <tr>
                                <th class="p-3">المعيار</th>
                                <th class="p-3">الروبوتات التقليدية (Rule-Based)</th>
                                <th class="p-3">ذكاء ردود التوليدي (LLM + RAG)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5 text-slate-300">
                            <tr>
                                <td class="p-3 font-bold text-white">فهم اللهجات</td>
                                <td class="p-3">يفشل عند أي كلمة خارج القاموس المحدد</td>
                                <td class="p-3 text-emerald-400 font-medium">يفهم اللهجات الخليجية والعربية بطلاقة</td>
                            </tr>
                            <tr>
                                <td class="p-3 font-bold text-white">المرونة في الإجابة</td>
                                <td class="p-3">إجابات جافة ومحفوظة مسبقاً</td>
                                <td class="p-3 text-emerald-400 font-medium">إجابة صياغية ذكية تناسب نبرة العميل وسؤاله</td>
                            </tr>
                            <tr>
                                <td class="p-3 font-bold text-white">سرعة التحديث</td>
                                <td class="p-3">تتطلب إعادة بناء شجرة القواعد يدوياً</td>
                                <td class="p-3 text-emerald-400 font-medium">تحديث فوري بمجرد رفع ملف الكتالوج الجديد</td>
                            </tr>
                        </tbody>
                    </table>
                </div>',
                'category'     => 'دراسات ومقارنات',
                'read_time'    => '5 دقائق',
                'icon'         => 'bi-diagram-3',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-08-24 12:00:00'),
            ],
            [
                'slug'         => 'saudi-dialect-nlp-ai-customization',
                'title'        => 'كيف تصمم نبرة المساعد الذكي ليتحدث باللهجة السعودية والخليجية الترحيبية؟',
                'summary'      => 'خطوات كتابة موجه النظام (System Prompt) وتحديد الشخصية ليعكس هوية علامتك التجارية بأسلوب محلي دافئ.',
                'content'      => '<p class="lead text-white font-bold mb-4">في الأسواق الخليجية، الكلمات الودية مثل "سمّ"، "أبشر"، "يا هلا ومسهلا" ليست مجرد كلمات عابرة، بل هي جوهر حسن الضيافة وبناء الثقة التجارية بين المتجر والعميل.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">تخصيص الـ Persona داخل منصة ردود</h3>
                <p class="text-slate-300 leading-relaxed mb-4">تتيح لك إعدادات المساعد الذكي في ردود اختيار النبرة المناسبة (سعودية ودودة، خليجية ترحيبية، أو عربية فصحى احترافية). يمكنك تحديد اسم المساعد، والعبارات التي يفضل استخدامها، والعبارات الممنوعة تماماً.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">التعامل مع استفسارات المقاسات وتوصيات الهدايا</h3>
                <p class="text-slate-300 leading-relaxed mb-4">يتدرب المساعد على فهم أسئلة مثل "وش ترشح لي هدية تخرج شبابية بحدود 300 ريال؟" ليقوم فوراً باقتراح أنسب 3 منتجات من كتالوج متجرك مع شرح سبب ملاءمتها ورابط الطلب المباشر.</p>',
                'category'     => 'تخصيص وتجربة العميل',
                'read_time'    => '4 دقائق',
                'icon'         => 'bi-chat-heart',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-08-22 17:30:00'),
            ],
            [
                'slug'         => 'omnichannel-ecommerce-integrations-salla-zid-shopify',
                'title'        => 'الربط الشامل للمتاجر: كيف تتكامل منصة ردود مع سلة، زد، وShopify؟',
                'summary'      => 'أتمتة مزامنة المخزون، تتبع حالة الشحن، وإنشاء طلبات الدفع المباشر من داخل نافذة المحادثة.',
                'content'      => '<p class="lead text-white font-bold mb-4">تعتبر القنوات الموحدة (Omni-Channel) ركيزة التجارة الإلكترونية الحديثة. لا يرغب التاجر في الدخول إلى 5 لوحات تحكم مختلفة لمتابعة استفسارات متجره.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">تكامل سلة وزد التلقائي</h3>
                <p class="text-slate-300 leading-relaxed mb-4">بمجرد ربط متجرك، تقوم منصة ردود بمزامنة كتالوج المنتجات، الأسعار، وحالة المخزون بشكل دوري. عندما ينفد منتج من متجرك، يعرف المساعد الذكي ذلك فوراً ويعتذر بلطف للعميل مقترحاً البديل المناسب المتوفر في المستودع.</p>
                <h3 class="text-amber-400 font-bold text-lg mt-6 mb-3">تتبع الشحنات المباشر برقم الطلب</h3>
                <p class="text-slate-300 leading-relaxed mb-4">عندما يكتب العميل رقم طلبه، يستعلم النظام في ثوانٍ معدودة من واجهة المتجر وشركة الشحن ليعرض للعميل موقع الشحنة الحالي وموعد التسليم المتوقع دون أي تدخل من موظف الدعم.</p>',
                'category'     => 'التكامل والربط',
                'read_time'    => '6 دقائق',
                'icon'         => 'bi-link-45deg',
                'is_featured'  => false,
                'is_published' => true,
                'published_at' => Carbon::parse('2026-08-20 09:00:00'),
            ],
        ];

        foreach ($articles as $data) {
            Article::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
