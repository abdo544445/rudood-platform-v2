import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  Bot, 
  Share2, 
  ShieldAlert, 
  Power, 
  ArrowRight,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { bot, updateBotStatus, user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: 'dashboard', title: 'لوحة التحكم والمؤشرات', icon: LayoutDashboard, path: '/dashboard', category: 'صفحات' },
    { id: 'chat', title: 'صندوق المحادثات المباشرة (Live Chat)', icon: MessageSquare, path: '/live-chat', category: 'صفحات' },
    { id: 'playground', title: 'مختبر الذكاء الاصطناعي (Playground)', icon: Sparkles, path: '/playground', category: 'صفحات' },
    { id: 'knowledge', title: 'قاعدة المعرفة والتدريب (Knowledge Base)', icon: BookOpen, path: '/knowledge-base', category: 'صفحات' },
    { id: 'bot_settings', title: 'تخصيص نبرة وشخصية البوت', icon: Bot, path: '/bot-settings', category: 'صفحات' },
    { id: 'channels', title: 'قنوات التواصل (WhatsApp, Telegram, Web)', icon: Share2, path: '/channels', category: 'صفحات' },
    { id: 'how_it_works', title: 'دليل التشغيل والشرح', icon: HelpCircle, path: '/how-it-works', category: 'روابط عامة' },
    { id: 'pricing', title: 'باقات الأسعار والترقية', icon: CreditCard, path: '/pricing', category: 'روابط عامة' },
  ];

  if (user?.is_super_admin) {
    actions.push({ id: 'admin', title: 'لوحة تحكم السوبر إدمن (Super Admin)', icon: ShieldAlert, path: '/admin', category: 'إدارة' });
  }

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = async (action: any) => {
    onClose();
    if (action.path) {
      navigate(action.path);
    }
  };

  const handleToggleBot = async () => {
    try {
      const res = await apiClient.post('/bot/toggle');
      if (res.data.success) {
        updateBotStatus(res.data.data.is_active);
        alert(res.data.message);
      }
    } catch (e) {}
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 p-4 font-['Cairo',sans-serif]">
      <div 
        className="w-full max-w-xl bg-[#0f172a] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-slate-900/80">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن صفحة، إجراء سريع، أو اختصار... (اكتب للبحث)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1">
          {/* Quick Action Item */}
          <button
            onClick={handleToggleBot}
            className="w-full p-3 rounded-2xl flex items-center justify-between text-right hover:bg-slate-800/80 transition-all border border-amber-500/20 bg-amber-500/5 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Power className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  تبديل حالة الرد التلقائي للبوت
                </span>
                <span className="text-[10px] text-slate-400">
                  الحالة الحالية: {bot?.is_active ? 'مفعّل 🟢' : 'متوقف ⏸'}
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              إجراء سريع
            </span>
          </button>

          {filtered.map((action, idx) => {
            const Icon = action.icon;
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={action.id}
                onClick={() => handleSelect(action)}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-right transition-all cursor-pointer ${
                  isSelected ? 'bg-amber-500/15 border border-amber-500/30' : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{action.title}</span>
                    <span className="text-[10px] text-slate-400">{action.category}</span>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <span>التنقل بواسطة لوحة المفاتيح</span>
          <span className="font-mono">Cmd + K / Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
