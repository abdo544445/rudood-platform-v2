import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  Coffee, 
  Stethoscope, 
  Building2, 
  RotateCcw,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';
import { apiClient } from '../../services/apiClient';

export const DemoPage: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('ecommerce');
  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'assistant', 
      content: 'أهلاً بك في متجر أريج للعطور والساعات الفاخرة ✨ تفضل بسؤالك عن تشكيلتنا أو الأسعار أو العروض وسأخدمك فوراً!',
      trigger: 'auto_rule' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const industries = [
    {
      id: 'ecommerce',
      name: 'متجر عطور وساعات',
      storeName: 'متجر أريج للعطور والساعات الفاخرة',
      botName: 'مساعد أريج الذكي',
      icon: ShoppingBag,
      color: 'purple',
      welcomeMessage: 'أهلاً بك في متجر أريج للعطور والساعات الفاخرة ✨ تفضل بسؤالك عن تشكيلتنا أو الأسعار أو العروض وسأخدمك فوراً!',
      sampleQuestions: ['كم سعر عطر اللافندر الملكي؟', 'ما هي سياسة الاسترجاع والضمان؟', 'هل يوجد كود خصم اليوم؟'],
    },
    {
      id: 'restaurant',
      name: 'مطعم وكافيه راقي',
      storeName: 'مطعم ومقهى ديوان النخيل',
      botName: 'مساعد ديوان النخيل الذكي',
      icon: Coffee,
      color: 'emerald',
      welcomeMessage: 'مرحباً بك في ديوان النخيل 🍽️☕ كيف يمكننا إسعادك اليوم؟ نسعد بإجابتك عن المنيو، الحجوزات، أو أوقات العمل!',
      sampleQuestions: ['ما هي أوقات العمل اليوم؟', 'هل يتطلب الحجز مسبقاً للعوائل وهل يوجد بارتشن؟', 'ما هو الطبق الأكثر طلباً؟'],
    },
    {
      id: 'clinic',
      name: 'مجمع عيادات وأسنان',
      storeName: 'مجمع عيادات الابتسامة والجلدية',
      botName: 'منسق المواعيد والخدمات الطبية',
      icon: Stethoscope,
      color: 'sky',
      welcomeMessage: 'أهلاً بك في مجمع عيادات الابتسامة والجلدية 🩺✨ يسعدنا مساعدتك في حجز المواعيد ومعرفة تفاصيل خدماتنا الطبية والتجميلية.',
      sampleQuestions: ['كم سعر جلسة تنظيف وتبييض الأسنان بالليزر؟', 'أريد حجز موعد مع طبيب الجلدية غداً', 'أين موقع العيادة؟'],
    },
    {
      id: 'realestate',
      name: 'شركة عقارات وتطوير',
      storeName: 'شركة صروح نجد العقارية',
      botName: 'المستشار العقاري الذكي',
      icon: Building2,
      color: 'amber',
      welcomeMessage: 'مرحباً بك في صروح نجد العقارية 🏢🏡 كيف يمكن لمستشارك العقاري مساعدتك في اختيار عقار أحلامك اليوم؟',
      sampleQuestions: ['هل تتوفر فلل مودرن للبيع شمال الرياض وما هي الضمانات؟', 'ما هي خيارات التمويل البنكي والدعم السكني؟', 'كيف أنسق موعد لمعاينة الفلل ميدانياً؟'],
    },
  ];

  const currentIndustry = industries.find((i) => i.id === selectedIndustry) || industries[0];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    setInput('');
    const newHistory = [...messages, { role: 'user', content: text }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await apiClient.post('/demo/simulate', {
        industry: selectedIndustry,
        message: text,
        history: messages,
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'assistant', 
            content: res.data.data.reply, 
            latency: res.data.data.latency_ms,
            trigger: res.data.data.trigger,
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'أهلاً بك! نسعد بخدمتك وتقديم كافة التفاصيل بدقة واحترافية.',
          trigger: 'domain_dedicated_fallback' 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchIndustry = (id: string) => {
    setSelectedIndustry(id);
    const ind = industries.find((i) => i.id === id) || industries[0];
    setMessages([
      { 
        role: 'assistant', 
        content: ind.welcomeMessage,
        trigger: 'auto_rule'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 relative font-['Cairo',sans-serif]">
      <AmbientCanvas />
      <PublicNavbar />

      <main className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto z-10 space-y-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>تجربة تفاعلية حية لمساعد الذكاء الاصطناعي</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            استعرض ذكاء البوت في <span className="gold-gradient-text">{currentIndustry.name}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            جرب قدرة روبوت ردود الذكي على فهم استفسارات العملاء والرد الفوري بدقة في مختلف المجالات والأنشطة التجارية.
          </p>
        </div>

        {/* Industry Switcher Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = selectedIndustry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => handleSwitchIndustry(ind.id)}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-900/80 border-white/5 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold truncate">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Industry Simulation Status Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{currentIndustry.storeName}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  محاكاة نشطة
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                يمكنك كتابة أي سؤال أو اختيار الأسئلة المقترحة بالأسفل لاختبار دقة وسرعة الاستجابة.
              </p>
            </div>
          </div>

          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
          >
            <span>ابدأ تجربة متجرك مجاناً</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Simulator Frame */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col h-[540px]">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                🤖
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentIndustry.botName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-slate-400">متصل الآن • محاكاة فورية عبر محرك ردود الذكي</span>
              </div>
            </div>

            <button
              onClick={() => handleSwitchIndustry(selectedIndustry)}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="إعادة تعيين المحادثة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2.5 ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                {m.role !== 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 order-2">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-slate-800 text-slate-100 rounded-br-none'
                      : 'bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/30 text-amber-100 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                  
                  <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-amber-500/15">
                    {m.trigger && (
                      <span className="text-[9px] font-bold text-amber-400/90 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {m.trigger === 'auto_rule' && 'قاعدة رد فوري مخصصة ⚡'}
                        {m.trigger === 'ai_api' && 'ذكاء اصطناعي فوري من مستندات النشاط ✨'}
                        {m.trigger === 'domain_dedicated_fallback' && 'إجابة قطاعية معتمدة 🛡️'}
                      </span>
                    )}
                    {m.latency && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        {m.latency}ms
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400 p-2 font-bold">
                <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <span>جاري معالجة الرد الذكي المخصص لـ {currentIndustry.name}...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5 flex gap-2 overflow-x-auto">
            <span className="text-[10px] text-slate-500 font-bold shrink-0 self-center">أسئلة مقترحة:</span>
            {currentIndustry.sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold shrink-0 border border-white/5 transition-colors cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-slate-950/90 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`اسأل مساعد ${currentIndustry.name} عن الأسعار، الشروط، أو التفاصيل...`}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
