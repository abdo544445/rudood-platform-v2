import React, { useState, useEffect } from 'react';
import { Bot, Power, MessageSquare, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';
import { CommandPalette } from '../common/CommandPalette';

export const Header: React.FC = () => {
  const { bot, workspace, updateBotStatus } = useAuthStore();
  const [isToggling, setIsToggling] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global Cmd + K key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleBot = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const res = await apiClient.post('/bot/toggle', {
        is_active: !(bot?.is_active ?? true),
      });
      if (res.data.success) {
        updateBotStatus(res.data.data.is_active);
      }
    } catch (e) {
      alert('تعذر تحديث حالة البوت');
    } finally {
      setIsToggling(false);
    }
  };

  const isActive = bot?.is_active ?? true;

  return (
    <>
      <header className="h-16 bg-[#080d19]/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30 mr-64 font-['Cairo',sans-serif]">
        {/* Left Side: Spotlight Search & Quota */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-400 hover:border-amber-500/30 hover:text-slate-200 transition-all cursor-pointer shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>بحث سريع أو تنفيذ إجراء...</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 text-xs text-slate-300">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>رصيد الرسائل:</span>
            <span className="font-bold text-amber-300">
              {workspace?.messages_used ?? 0} / {workspace?.messages_limit ?? 1000}
            </span>
          </div>
        </div>

        {/* Right Side: Bot Status Toggle & Persona */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleBot}
            disabled={isToggling}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 shadow-lg shadow-emerald-500/10'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25 shadow-lg shadow-rose-500/10'
            }`}
          >
            <Power className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span>{isActive ? 'الرد التلقائي: مفعّل 🤖' : 'الرد التلقائي: متوقف ⏸'}</span>
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs font-medium text-amber-200">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>{bot?.name || 'مساعد المتجر'}</span>
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
};
