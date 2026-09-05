import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  X 
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';
import { apiClient } from '../../services/apiClient';

export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  // Modal State for custom lead / subscription inquiry
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('المتقدمة (Professional)');
  const [subForm, setSubForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'الباقة الأساسية',
      desc: 'مثالية للمتاجر الناشئة والمشاريع الصغيرة للبدء في الأتمتة',
      priceMonthly: 299,
      priceAnnual: 239,
      messages: '1,000 رسالة / شهرياً',
      features: [
        'ربط واتساب رسمي واحد (WhatsApp Cloud API)',
        'قاعدة معرفة بـ 5 مستندات (PDF / Word)',
        'ردود تلقائية ذكية عبر Gemini 1.5 Flash',
        'صندوق محادثات Live Chat موحد',
        'دعم فني عبر البريد الإلكتروني',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'الباقة المتقدمة (الأكثر طلباً ⭐)',
      desc: 'الخيار الأنسب للمتاجر المتوسطة والشركات التي تبحث عن مضاعفة المبيعات',
      priceMonthly: 599,
      priceAnnual: 479,
      messages: '3,000 رسالة / شهرياً',
      features: [
        'ربط واتساب + تليجرام + إنستغرام + ويدجت الموقع',
        'قاعدة معرفة غير محدودة مع محرك pgvector RAG',
        'رسائل تفاعلية بأزرار وقوائم وكتالوج منتجات',
        'لوحة تتبع المبيعات والعائد الاستثماري (ROI)',
        'تحليل المشاعر والتصعيد الفوري للوكيل البشري',
        'دعم فني مباشر وسريع عبر واتساب',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'باقة الشركات والمؤسسات',
      desc: 'حلول مخصصة للمتاجر الكبرى والماركات ذات الحجم العالي',
      priceMonthly: 1499,
      priceAnnual: 1199,
      messages: '10,000+ رسالة / شهرياً',
      features: [
        'كافة مميزات الباقة المتقدمة بلا قيود',
        'تخصيص نماذج الذكاء الاصطناعي وربط Custom API Keys',
        'مدير حساب مخصص وتدريب مخصص لفريقك',
        'تكامل API مباشر مع أنظمة ERP والمخازن',
        'اتفاقية مستوى الخدمة (SLA 99.9%)',
      ],
      popular: false,
    },
  ];

  const handleOpenSubscribe = (planName: string) => {
    setSelectedPlanName(planName);
    setModalOpen(true);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/contacts', {
        name: subForm.name,
        email: subForm.email,
        phone: subForm.phone,
        message: `طلب اشتراك في باقة: ${selectedPlanName} لمتجر: ${subForm.company_name}`,
      });
      alert('تم استلام طلبك بنجاح! سيتواصل معك فريق المبيعات لتفعيل باقتك فوراً ✓');
      setModalOpen(false);
    } catch (e) {
      alert('تعذر إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 relative font-['Cairo',sans-serif]">
      <AmbientCanvas />
      <PublicNavbar />

      <main className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>باقات شفافة وبدون رسوم خفية</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            استثمر في ذكاء متجرك مع <span className="gold-gradient-text">باقات مرنة</span>
          </h1>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            اختر الباقة المناسبة لحجم متجرك، واستمتع بتجربة مجانية كاملة بدون الحاجة لبطاقة ائتمان.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-full border border-white/10 shadow-lg">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                !isAnnual ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              دفع شهري
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAnnual ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>دفع سنوي</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                وفر 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`p-8 rounded-3xl flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-slate-900 to-amber-950/40 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 scale-105 z-10'
                    : 'bg-slate-900/80 border border-white/5 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gold-btn text-[10px] font-black tracking-wider uppercase shadow-md">
                    الأكثر اختياراً لنمو المتاجر
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.desc}</p>

                  {/* Price */}
                  <div className="my-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">{price}</span>
                      <span className="text-xs text-slate-400 font-bold">ريال سعودي / شهر</span>
                    </div>
                    <span className="text-[11px] text-amber-400/80 font-bold block mt-1">{plan.messages}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 border-t border-white/5 pt-6 mb-8">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenSubscribe(plan.name)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                    plan.popular
                      ? 'gold-btn shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  اختر هذه الباقة وابدأ الآن
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20 p-8 rounded-3xl bg-slate-900/60 border border-white/5">
          <h3 className="text-lg font-black text-white text-center mb-8">مقارنة المميزات التفصيلية بين الباقات</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-4 font-bold">الميزة</th>
                  <th className="pb-4 font-bold text-center">الأساسية</th>
                  <th className="pb-4 font-bold text-center text-amber-400">المتقدمة ⭐</th>
                  <th className="pb-4 font-bold text-center">الشركات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-3 font-semibold">عدد الرسائل الشهرية</td>
                  <td className="py-3 text-center">1,000</td>
                  <td className="py-3 text-center text-amber-300 font-bold">3,000</td>
                  <td className="py-3 text-center">10,000+</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">تكامل WhatsApp Cloud API الرسمي</td>
                  <td className="py-3 text-center text-emerald-400">✓</td>
                  <td className="py-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">محرك المتجهات الدلالي (pgvector RAG)</td>
                  <td className="py-3 text-center text-slate-600">-</td>
                  <td className="py-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">رسائل الأزرار والقوائم وكتالوج المنتجات</td>
                  <td className="py-3 text-center text-slate-600">-</td>
                  <td className="py-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">تحليل المشاعر والتصعيد التلقائي</td>
                  <td className="py-3 text-center text-slate-600">-</td>
                  <td className="py-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="py-3 text-center text-emerald-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Subscription Lead Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f172a] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">طلب تفعيل باقة: {selectedPlanName}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">اسم المتجر / الشركة</label>
                <input
                  type="text"
                  required
                  value={subForm.company_name}
                  onChange={(e) => setSubForm({ ...subForm, company_name: e.target.value })}
                  placeholder="متجر النخبة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">اسم المسؤول</label>
                <input
                  type="text"
                  required
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  placeholder="سعود الغامدي"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={subForm.email}
                  onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                  placeholder="name@store.sa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-bold mb-1">رقم الواتساب للتواصل</label>
                <input
                  type="tel"
                  required
                  value={subForm.phone}
                  onChange={(e) => setSubForm({ ...subForm, phone: e.target.value })}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl gold-btn text-xs font-bold mt-2"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد وإرسال طلب الاشتراك ✓'}
              </button>
            </form>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
};
