import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Bot, Zap, MessageSquare } from 'lucide-react';

interface TickerEvent {
  id: string;
  icon: any;
  text: string;
  badge: string;
  time: string;
  color: string;
}

const DEFAULT_EVENTS: TickerEvent[] = [
  {
    id: '1',
    icon: ShoppingBag,
    text: 'طلب شراء مكتمل بقيمة 480 ر.س ناتج عن توصية ذكية في واتساب',
    badge: 'مبيعات AI 🛒',
    time: 'منذ دقيقة',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: '2',
    icon: Bot,
    text: 'البوت قام بحل استفسار شحن تلقائياً دون الحاجة لتدخل الموظف',
    badge: 'توفير عمل ⚡',
    time: 'منذ 3 دقائق',
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: '3',
    icon: Zap,
    text: 'تزامن فوري مع قاعدة بيانات pgvector لـ 150 منتج بنجاح',
    badge: 'RAG Search 🧠',
    time: 'منذ 5 دقائق',
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
  {
    id: '4',
    icon: MessageSquare,
    text: 'محادثة جديدة عبر Web Widget في متجر سلة تمت معالجتها بـ 0.3 ثانية',
    badge: 'استجابة فائقة 🚀',
    time: 'منذ 7 دقائق',
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
];

export const ActivityTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEFAULT_EVENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = DEFAULT_EVENTS[currentIndex];
  const Icon = current.icon;

  return (
    <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 backdrop-blur-xl shadow-lg flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Live Pulse Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>مباشر LIVE</span>
        </div>

        {/* Animated Event Text */}
        <div className="flex items-center gap-2 text-xs truncate animate-fadeIn">
          <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold shrink-0 flex items-center gap-1 ${current.color}`}>
            <Icon className="w-3 h-3" />
            <span>{current.badge}</span>
          </span>
          <span className="text-slate-200 font-medium truncate">{current.text}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono shrink-0 pl-2">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>{current.time}</span>
      </div>
    </div>
  );
};
