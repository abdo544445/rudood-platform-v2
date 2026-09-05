import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Bot, 
  Sparkles, 
  BookOpen, 
  Share2, 
  ShieldAlert, 
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Sidebar: React.FC = () => {
  const { user, logout, workspace } = useAuthStore();

  const navItems = [
    { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { to: '/live-chat', label: 'المحادثات المباشرة', icon: MessageSquareText },
    { to: '/playground', label: 'مختبر الذكاء الاصطناعي', icon: Sparkles },
    { to: '/knowledge-base', label: 'قاعدة المعرفة والتدريب', icon: BookOpen },
    { to: '/bot-settings', label: 'تخصيص البوت', icon: Bot },
    { to: '/channels', label: 'قنوات التواصل', icon: Share2 },
  ];

  return (
    <aside className="w-64 bg-[#0b0f19]/95 backdrop-blur-xl border-l border-white/5 flex flex-col h-screen fixed top-0 right-0 z-40">
      {/* Brand Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
        <img
          src="/images/img.png"
          alt="منصة ردود"
          className="h-9 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div>
          <h1 className="font-extrabold text-base tracking-wide gold-gradient-text">منصة ردود</h1>
          <p className="text-[10px] text-slate-400 font-bold -mt-0.5">RUDOOD AI</p>
        </div>
      </div>

      {/* Workspace Indicator */}
      <div className="px-4 py-3 border-b border-white/5 bg-slate-900/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">مساحة العمل:</span>
          <span className="text-amber-400 font-bold truncate max-w-[130px]">
            {workspace?.company_name || 'متجري'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">القائمة الرئيسية</div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Super Admin Section */}
        {user?.is_super_admin && (
          <div className="pt-4 mt-4 border-t border-white/5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-500/80">الإدارة العليا</div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>لوحة السوبر إدمن</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
            {user?.name?.charAt(0) || 'م'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
