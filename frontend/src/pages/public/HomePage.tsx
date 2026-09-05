import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Bot, 
  Share2, 
  DollarSign, 
  Play, 
  ChevronDown
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';

export const HomePage: React.FC = () => {
  // ROI Calculator State
  const [monthlyOrders, setMonthlyOrders] = useState(1500);
  const [avgOrderValue, setAvgOrderValue] = useState(250);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live Chat Dynamic Simulation Loop
  const [mockMessages, setMockMessages] = useState<any[]>([
    { id: 1, type: 'incoming', text: 'مرحباً، حاب أعرف هل متوفر عندكم ساعة كلاسيكية جلد أسود وعليها كود خصم اليوم؟', time: 'الآن' },
    { id: 2, type: 'outgoing', text: 'أهلاً بك! نعم متوفرة لدينا «ساعة رويال كلاسيك جلد أسود أصلي» بسعر 340 ريال مع ضمان سنتين ✨\n\n🎁 كود الخصم اليوم: RUDOOD15 يخصم لك 15% فوراً والشحن مجاني!', time: 'الآن' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTyping((prev) => !prev);
    }, 4000);
    return () => clearInterval(timer);
  }, [setMockMessages]);

  // Calculations
  const estimatedConversations = Math.round(monthlyOrders * 1.8);
  const deflectedConversations = Math.round(estimatedConversations * 0.88);
  const hoursSaved = Math.round((deflectedConversations * 4) / 60);
  const financialSavings = Math.round(hoursSaved * 45);
  const additionalRevenue = Math.round(monthlyOrders * 0.12 * avgOrderValue);

  const faqs = [
    {
      q: 'كيف تختلف منصة ردود عن روبوتات المحادثة التقليدية (Chatbots)؟',
      a: 'الروبوتات التقليدية تعتمد على أزرار وقوائم جامدة، بينما منصة ردود تعتمد على الذكاء الاصطناعي التوليدي والبحث الدلالي في المتجهات (Vector RAG). تفهم اللهجة السعودية والخليجية، وتقرأ كتالوج منتجاتك وسياساتك بدقة، وتقدم إجابات بشرية ذكية تدفع العميل لإتمام الشراء.',
    },
    {
      q: 'هل الربط مع واتساب رسمي وآمن من الحظر؟',
      a: 'نعم 100%، نحن نستخدم واجهة WhatsApp Cloud API الرسمية المعتمدة من شركة Meta العالمية، مما يضمن أمان حسابك ورقم متجرك دون أي مخاطر حظر إطلاقاً.',
    },
    {
      q: 'كم يستغرق تجهيز وتدريب البوت لمتجري؟',
      a: 'أقل من 5 دقائق! كل ما عليك هو رفع ملفات سياسات متجرك أو كتالوج المنتجات بصيغة PDF أو Word، ويقوم النظام تلقائياً بتجزئتها وفهرستها والبدء بالرد الفوري.',
    },
    {
      q: 'هل يمكن لفريق الدعم البشري التدخل في أي وقت؟',
      a: 'بالتأكيد. توفر منصة ردود ميزة (Human Takeover) بنقرة زر واحدة لإيقاف الرد الآلي واستلام المحادثة كوكيل بشري، بالإضافة إلى تنبيهات فورية عند اكتشاف استياء العميل أو تصعيد الطلب.',
    },
    {
      q: 'هل تدعم المنصة الربط مع سلة، زد، وشوبيفاي؟',
      a: 'نعم، نوفر تكاملاً سهلاً مع منصات التجارة الإلكترونية لتتبع حالة الطلبات والتحقق من توفر المنتجات في المخزون مباشرة.',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 relative font-['Cairo',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
      <AmbientCanvas />
      <PublicNavbar />

      {/* ── 1. Hero Section: 2-Column Responsive Layout ────────────────── */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>المنصة الرائدة لأتمتة التجارة الإلكترونية بالذكاء الاصطناعي</span>
            </div>

            {/* Arabic 'ردود' Calligraphy Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
                  منصة <span className="gold-gradient-text text-5xl sm:text-7xl lg:text-8xl">ردود</span>
                </h1>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-200 leading-snug">
                ضاعف مبيعات متجرك وأتمت خدمة العملاء عبر واتساب 24/7
              </h2>
            </div>

            <div className="rodood-glass-card max-w-xl">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                روبوت ذكاء اصطناعي يفهم اللهجات المحلية، يقرأ كتالوج متجرك، يجيب عن الأسئلة، يسترجع السلات المتروكة، ويغلق 94% من استفسارات العملاء تلقائياً في أقل من ثانية.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl gold-btn text-sm font-black flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all"
              >
                <span>ابدأ تجربتك المجانية الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                to="/demo"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-bold border border-white/10 flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>شاهد المحاكاة الحية</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ربط رسمي Meta WhatsApp Cloud</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> بحث فائق السرعة بـ pgvector RAG</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> جاهزية خلال 5 دقائق</span>
            </div>
          </div>

          {/* Left Column: 3D Perspective Interactive Mockup */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Glowing Background Blur */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-amber-700/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-500"></div>

              {/* Mockup Frame */}
              <div className="relative bg-slate-900/90 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-300 transform lg:hover:scale-[1.02]">
                
                {/* Window Header */}
                <div className="p-4 border-b border-white/10 bg-slate-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    <span className="text-[11px] font-bold text-amber-300">مساعد متجر النخبة الذكي (متصل)</span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5 font-mono">
                    WhatsApp API
                  </span>
                </div>

                {/* Mockup Chat Stream */}
                <div className="p-5 h-[340px] overflow-y-auto space-y-3 text-xs leading-relaxed bg-[#0b0f19]/60">
                  {mockMessages.map((m) => (
                    <div key={m.id} className={`flex ${m.type === 'incoming' ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl ${
                          m.type === 'incoming'
                            ? 'bg-slate-800 text-slate-100 rounded-br-none border border-white/5'
                            : 'bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/30 text-amber-100 rounded-bl-none shadow-md space-y-2'
                        }`}
                      >
                        <p className="whitespace-pre-line">{m.text}</p>
                        {m.type === 'outgoing' && (
                          <div className="flex gap-2 pt-1">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] cursor-pointer">
                              🛒 إتمام الطلب مباشرة
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 font-bold text-[10px] cursor-pointer">
                              🚚 تتبع الشحنة
                            </span>
                          </div>
                        )}
                        <span className="text-[9px] text-slate-400 block text-left opacity-70 mt-1">{m.time}</span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-2xl rounded-bl-none text-[11px] text-amber-300 flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري صياغة الرد الذكي...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Simulation Input */}
                <div className="p-3 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">⚡ سرعة الاستجابة: <strong className="text-emerald-400">0.4 ثانية</strong></span>
                  <Link to="/demo" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                    <span>افتح المختبر الكامل</span>
                    <ArrowLeft className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Real-Time Stats Counter Grid ──────────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="stat-box">
            <h3 className="stat-number">+500,000</h3>
            <p className="text-xs text-slate-300 font-bold">رسالة معالجة بنجاح</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number text-white">94.8%</h3>
            <p className="text-xs text-slate-300 font-bold">نسبة الإغلاق الآلي (Deflection)</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number text-emerald-400">24/7</h3>
            <p className="text-xs text-slate-300 font-bold">جاهزية واستجابة فورية</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number text-white">+1,200</h3>
            <p className="text-xs text-slate-300 font-bold">متجر ونشاط تجاري معتمد</p>
          </div>
        </div>
      </section>

      {/* ── 3. E-Commerce Platforms Integration Badges ───────────────────── */}
      <section className="py-12 px-6 max-w-7xl mx-auto relative z-10 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          تكامل فوري ومباشر مع كبرى منصات التجارة الإلكترونية
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="px-6 py-3 rounded-2xl bg-slate-900/60 border border-white/5 text-sm font-bold text-slate-200">
            🟢 سلة (Salla)
          </div>
          <div className="px-6 py-3 rounded-2xl bg-slate-900/60 border border-white/5 text-sm font-bold text-slate-200">
            🟣 زد (Zid)
          </div>
          <div className="px-6 py-3 rounded-2xl bg-slate-900/60 border border-white/5 text-sm font-bold text-slate-200">
            🟢 شوبيفاي (Shopify)
          </div>
          <div className="px-6 py-3 rounded-2xl bg-slate-900/60 border border-white/5 text-sm font-bold text-slate-200">
            🔵 ووكومرس (WooCommerce)
          </div>
        </div>
      </section>

      {/* ── 4. Interactive ROI Calculator ────────────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-2xl backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs mb-2">
              <DollarSign className="w-4 h-4" />
              <span>حاسبة العائد الاستثماري المباشر (ROI Calculator)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              احسب كم ستوفر وتربح شهرياً مع منصة ردود
            </h2>
            <p className="text-xs text-slate-400 mt-1">حرك المؤشرات لتخمين التوفير المالي والمبيعات المسترجعة لمتجرك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">عدد الطلبات الشهرية لمتجرك:</span>
                  <span className="text-amber-400 text-sm font-black">{monthlyOrders.toLocaleString()} طلب</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">متوسط قيمة السلة (ريال):</span>
                  <span className="text-amber-400 text-sm font-black">{avgOrderValue} ريال</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-[11px] text-slate-400 font-bold">ساعات العمل الموفرة</span>
                <h4 className="text-2xl font-black text-white mt-1">{hoursSaved} ساعة</h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-[11px] text-slate-400 font-bold">التوفير المالي لفريق الدعم</span>
                <h4 className="text-2xl font-black text-emerald-400 mt-1">{financialSavings.toLocaleString()} ر.س</h4>
              </div>
              <div className="col-span-2 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/40">
                <span className="text-xs text-amber-300 font-bold">المبيعات الإضافية المتوقعة من الشات</span>
                <h3 className="text-3xl font-black text-white mt-1">+{additionalRevenue.toLocaleString()} ر.س / شهرياً</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Core Features Grid ────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-white">كل ما يحتاجه متجرك للنمو بأحدث تقنيات الذكاء الاصطناعي</h2>
          <p className="text-xs text-slate-400 mt-2">منظومة متكاملة من الأدوات المصممة خصيصاً لقطاع التجارة الإلكترونية والخدمات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 hover:border-amber-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">قاعدة معرفة ذكية بـ pgvector</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ارفع ملفات متجرك وسياساتك وسيقوم النظام بتجزئتها واسترجاع الإجابات الدقيقة بسرعة البرق.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 hover:border-amber-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">مركز قنوات موحد (Omni-Channel)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ربط فوري وشامل مع واتساب الرسمي، تليجرام، إنستغرام، وويدجت الشات المباشر على موقعك.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 hover:border-amber-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تتبع المبيعات ونسب التحويل (ROI)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              لوحة تحليلات مخصصة ترصد حجم الإيرادات والطلبات الناتجة مباشرة عن محادثات البوت.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ Accordion ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white">الأسئلة الشائعة</h2>
          <p className="text-xs text-slate-400 mt-2">إجابات عن أبرز الاستفسارات المتعلقة بالمنصة والربط</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-2xl bg-slate-900/80 border border-white/5 overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-right flex items-center justify-between font-bold text-sm text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. Bottom CTA Banner ─────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-slate-900 border border-amber-500/40 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            جاهز لمضاعفة مبيعات متجرك وتوفير 80% من تكاليف خدمة العملاء؟
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            انضم الآن لأكثر من 1,200 متجر ناجح يعتمدون على منصة ردود يومياً.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="px-8 py-4 rounded-2xl gold-btn text-sm font-black shadow-xl">
              إنشاء حساب متجر مجاناً
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Floating Corner Live Demo Floater ─────────────────────────── */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <Link
          to="/demo"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 border border-rose-500/40 text-rose-300 text-xs font-bold shadow-2xl backdrop-blur-md hover:bg-slate-800 transition-all hover:scale-105"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span>تجربة محاكاة مباشرة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      <PublicFooter />
    </div>
  );
};
