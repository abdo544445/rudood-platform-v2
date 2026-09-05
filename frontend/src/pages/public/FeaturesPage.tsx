import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, 
  Layers, 
  MessageSquareText, 
  TrendingUp, 
  Mic, 
  ArrowLeft,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';

export const FeaturesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rag');

  const featureTabs = [
    {
      id: 'rag',
      name: 'محرك المعرفة الدلالي (pgvector RAG)',
      icon: Layers,
      title: 'بحث فائق السرعة واسترجاع فوري من ملفات متجرك',
      desc: 'يقوم النظام بتجزئة ملفات الـ PDF وWord إلى متجهات عددية مخزنة بقاعدة بيانات PostgreSQL 16 مدعومة بملحق pgvector، للبحث عن المعنى السياقي بدلاً من مطابقة الكلمات الحرفية.',
      bullets: [
        'دقة إجابة تتجاوز 98% مستخرجة مباشرة من وثائقك',
        'عدم تأليف أو اختلاق إجابات خارج نطاق الكتالوج (Zero Hallucination)',
        'استجابة فائقة السرعة في أقل من 150 ميلي ثانية',
      ],
    },
    {
      id: 'omni',
      name: 'مركز القنوات الموحد (Omni-Channel)',
      icon: Share2,
      title: 'اتصال شامل مع جميع تطبيقات المحادثة',
      desc: 'إدارة جميع محادثات العملاء الواردة من واتساب الرسمي، تليجرام، إنستغرام، وويدجت موقعك في صندوق بريد ذكي ومركزي واحد.',
      bullets: [
        'تكامل WhatsApp Cloud API معتمد بدون حظر',
        'مزامنة فورية للرسائل عبر Webhooks',
        'ويدجت موقع مباشر قابل للتخصيص بالألوان والهوية',
      ],
    },
    {
      id: 'interactive',
      name: 'الرسائل التفاعلية (Interactive Cards)',
      icon: MessageSquareText,
      title: 'أزرار سريعة وقوائم وكتالوج منتجات تفاعلي',
      desc: 'حوّل تجربة الشات إلى متجر مصغر عبر إرسال أزرار الردود السريعة (Quick Replies)، القوائم المنسدلة (List Menus)، وبطاقات المنتجات القابلة للشراء.',
      bullets: [
        'أزرار بنقرة واحدة لتأكيد الطلب أو الاستفسار',
        'قوائم تفاعلية لتصنيفات المنتجات والخدمات',
        'بطاقات كاروسيل بالصور والأسعار وروابط الدفع الفوري',
      ],
    },
    {
      id: 'voice',
      name: 'الذكاء الصوتي وتحويل الصوت لنص',
      icon: Mic,
      title: 'استماع للرسائل الصوتية والرد عليها بدقة',
      desc: 'محرك تفريغ صوتي مدمج يفهم الرسائل الصوتية التي يرسلها العملاء بلهجاتهم المحلية ويجيب عليها نصياً وصوتياً.',
      bullets: [
        'تحويل فوري للتسجيلات الصوتية عبر Whisper AI',
        'فهم الكلمات الشعبية والمصطلحات الخليجية',
        'توفير تجربة طبيعية وسلسة للعميل',
      ],
    },
    {
      id: 'roi',
      name: 'تتبع المبيعات والعائد الاستثماري (ROI)',
      icon: TrendingUp,
      title: 'ربط كل محادثة بقيمة الطلبات الناتجة عنها',
      desc: 'تتبع تلقائي للطلبات التي تمت بعد محادثة البوت خلال نافذة زمنية (72 ساعة) لحساب الإيرادات المباشرة وساعات العمل الموفرة بدقة.',
      bullets: [
        'لوحة إحصائيات مالية واضحة ومحدثة لحظياً',
        'قياس معدل استرجاع السلات المتروكة',
        'تصدير تقارير CSV بنقرة زر واحدة',
      ],
    },
  ];

  const current = featureTabs.find((f) => f.id === activeTab) || featureTabs[0];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 relative font-['Cairo',sans-serif]">
      <AmbientCanvas />
      <PublicNavbar />

      <main className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>البنية التقنية والمميزات المتقدمة</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            أقوى محرك ذكاء اصطناعي مصمم لـ <span className="gold-gradient-text">نمو تجارتك</span>
          </h1>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            تقنيات متطورة تدمج بين الذكاء التوليدي والبحث الدلالي لخدمة عملاء فائقة الذكاء والسرعة.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 justify-start md:justify-center mb-10">
          {featureTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'gold-btn shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Spotlight Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Icon className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-white">{current.title}</h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{current.desc}</p>

            <div className="space-y-3 pt-2">
              {current.bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/register" className="px-6 py-3.5 rounded-xl gold-btn text-xs font-bold inline-flex items-center gap-2">
                <span>جرب هذه الميزة في متجرك مجاناً</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-bold text-amber-300">
              <span>محاكاة تشغيلية مباشرة</span>
              <span className="text-[10px] text-emerald-400">معدل الدقة: 99.2%</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 text-xs font-mono text-slate-300 space-y-2">
              <p className="text-amber-400 font-bold">// تقنية متطورة مدمجة:</p>
              <p>• Model: Google Gemini 2.0 Flash / OpenAI GPT-4o</p>
              <p>• Vector Engine: PostgreSQL 16 + pgvector extension</p>
              <p>• Latency: ~120ms average response time</p>
              <p>• Security: End-to-End Encrypted API Keys</p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
