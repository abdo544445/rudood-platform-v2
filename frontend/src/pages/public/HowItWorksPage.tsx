import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Upload, 
  Bot, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';

export const HowItWorksPage: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: 0,
      number: '01',
      title: 'ربط قنوات التواصل (Omni-Channel)',
      badge: 'دقيقة واحدة',
      icon: Share2,
      desc: 'قم بربط رقم واتساب الأعمال الرسمي أو بوت تليجرام أو تثبيت ويدجت الموقع المباشر بنقرة زر واحدة عبر مساحة العمل الخاصة بك.',
      details: [
        'تكامل رسمي عبر WhatsApp Cloud API معتمد من Meta',
        'تثبيت سريع للويدجت على متاجر سلة وزد وشوبيفاي',
        'استقبال موحد لكافة الرسائل في صندوق محادثات ذكي واحد',
      ],
      previewTitle: 'شاشة ربط القنوات',
      previewContent: 'تم ربط واتساب وتليجرام بنجاح ✓ النظام متصل وجاهز لاستقبال الرسائل.',
    },
    {
      id: 1,
      number: '02',
      title: 'تغذية المعرفة وتدريب الذكاء الاصطناعي',
      badge: 'دقيقتان',
      icon: Upload,
      desc: 'ارفع ملفات كتالوج المنتجات، سياسات الاسترجاع والشحن، أو أضف قواعد الردود الفورية للأسئلة المتكررة.',
      details: [
        'دعم ملفات PDF، Word، وملفات النصوص TXT حتى 15 ميجابايت',
        'تجزئة تلقائية وتوليد متجهات دلالية في قاعدة بيانات pgvector',
        'استخراج تلقائي للأسئلة الشائعة بنقرة زر واحدة',
      ],
      previewTitle: 'محرك المعرفة المتجهة (Vector RAG)',
      previewContent: 'تم تحليل وتضمين 45 مقطع بحثي دلالي من ملف كتالوج_منتجات_الذهب.pdf بنجاح.',
    },
    {
      id: 2,
      number: '03',
      title: 'تخصيص شخصية ونبرة البوت (Persona)',
      badge: 'دقيقة واحدة',
      icon: Bot,
      desc: 'اختر نبرة الصوت التي تعبر عن هويتك التجارية (ودودة، رسمية، تسويقية)، وضع الرسالة الترحيبية والتوجيهات الخاصة.',
      details: [
        'نماذج ذكاء اصطناعي متطورة (Gemini 2.0, GPT-4o, Claude 3.5)',
        'فهم عميق للهجات السعودية والخليجية والمصطلحات المحلية',
        'تحليل فوري لمشاعر العميل ورصد حالات الاستياء للتصعيد',
      ],
      previewTitle: 'مختبر ضبط المعايير (Playground)',
      previewContent: 'النبرة: ودودة ومرحبة ✨ | سرعة الاستجابة المقاسة: 120ms | مستوى الدقة: 98.4%',
    },
    {
      id: 3,
      number: '04',
      title: 'الانطلاق والأتمتة وتتبع الأرباح (ROI)',
      badge: 'فوري ومستمر',
      icon: Zap,
      desc: 'يبدأ البوت بالرد التلقائي وإغلاق الطلبات على مدار الساعة، مع إمكانية استلام الوكيل البشري للمحادثة في أي لحظة.',
      details: [
        'لوحة تحليلات حية لنسبة الرد الآلي وساعات العمل الموفرة',
        'ربط المبيعات والطلبات المكتملة بالمحادثات لقياس العائد المالي',
        'تنبيهات فورية عند الحاجة لتدخل بشري عاجل',
      ],
      previewTitle: 'لوحة الأداء والعائد الاستثماري',
      previewContent: 'تم إغلاق 94.8% من الاستفسارات آلياً • توفير 85 ساعة عمل • تحقيق 34,500 ريال مبيعات.',
    },
  ];

  const currentStage = stages[activeStage];
  const CurrentIcon = currentStage.icon;

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 relative font-['Cairo',sans-serif]">
      <AmbientCanvas />
      <PublicNavbar />

      <main className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>دليل التشغيل والشرح التفاعلي</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            كيف تعمل منصة ردود في <span className="gold-gradient-text">4 خطوات سهلة</span>؟
          </h1>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            من الربط الأولي وحتى أتمتة الردود وجني الأرباح، كل ما تحتاجه مجهز للعمل في دقائق معدودة.
          </p>
        </div>

        {/* 4 Stages Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stages.map((st) => {
            const Icon = st.icon;
            const isSelected = activeStage === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black font-mono ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                    {st.number}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                </div>
                <h4 className="text-xs font-bold truncate">{st.title}</h4>
                <span className="text-[10px] text-slate-400 mt-1 block">{st.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Interactive Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">المرحلة {currentStage.number}</span>
                <h3 className="text-xl font-black text-white">{currentStage.title}</h3>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {currentStage.desc}
            </p>

            <div className="space-y-2.5 pt-2">
              {currentStage.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex gap-3">
              <Link to="/register" className="px-6 py-3 rounded-xl gold-btn text-xs font-bold flex items-center gap-2">
                <span>ابدأ تطبيق هذه الخطوة لمتجرك</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Visual Preview Emulator */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{currentStage.previewTitle}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                نشط ومكتمل ✓
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-300 leading-relaxed font-mono">
              {currentStage.previewContent}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">وقت الإعداد</span>
                <span className="font-bold text-white mt-0.5 block">{currentStage.badge}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">الحالة التشغيلية</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">مؤتمت بالكامل ⚡</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
