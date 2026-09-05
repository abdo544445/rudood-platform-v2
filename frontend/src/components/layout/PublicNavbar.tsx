import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ArrowLeft, 
  LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const PublicNavbar: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/how-it-works', label: 'دليل التشغيل' },
    { to: '/features', label: 'المميزات' },
    { to: '/pricing', label: 'باقات الأسعار' },
    { to: '/demo', label: 'تجربة حية' },
    { to: '/blog', label: 'المدونة' },
    { to: '/contact', label: 'اتصل بنا' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080d19]/80 backdrop-blur-xl border-b border-white/5 font-['Cairo',sans-serif]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/images/img.png"
            alt="منصة ردود"
            className="h-10 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <span className="text-xl font-black tracking-wide gold-gradient-text block">منصة ردود</span>
            <span className="text-[10px] text-slate-400 font-bold block -mt-1">RUDOOD AI PLATFORM</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/5 shadow-inner relative">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* أقسام المنصة Dropdown */}
          <div className="relative group">
            <button className="px-3.5 py-2 rounded-full text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-slate-800/60 transition-all flex items-center gap-1">
              <span>أقسام المنصة</span>
              <span className="text-[10px]">▼</span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-56 p-2 rounded-2xl bg-[#0b1120] border border-amber-500/30 shadow-2xl backdrop-blur-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
              <Link to="/demo" className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-amber-500/15 hover:text-amber-300 transition-colors">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">🤖</span>
                <div>
                  <div>الرد الآلي والأتمتة</div>
                  <div className="text-[10px] text-slate-400 font-normal">استعراض حي لمحاكاة الردود</div>
                </div>
              </Link>
              <Link to="/demo" className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-amber-500/15 hover:text-amber-300 transition-colors">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">💬</span>
                <div>
                  <div>المحادثات المباشرة</div>
                  <div className="text-[10px] text-slate-400 font-normal">تجربة الشات مع المساعد</div>
                </div>
              </Link>
              <Link to="/demo" className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-amber-500/15 hover:text-amber-300 transition-colors">
                <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">🧠</span>
                <div>
                  <div>الذكاء الاصطناعي 24/7</div>
                  <div className="text-[10px] text-slate-400 font-normal">استرجاع دقيق من الكتالوج</div>
                </div>
              </Link>
              <div className="my-1 border-t border-white/5" />
              <Link to="/how-it-works" className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">📖</span>
                <span>دليل تشغيل البوت الرباعي</span>
              </Link>
              <Link to="/demo" className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors">
                <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">🔴</span>
                <span>استعراض حي شامل للأنشطة</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live Demo Pulsating Pill */}
          <Link
            to="/demo"
            className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 hover:bg-rose-500/20 transition-all shadow-lg shadow-rose-500/10"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>تجربة محاكاة حية</span>
          </Link>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>لوحة التحكم ({user?.name || 'حسابي'})</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <span>ابدأ مجاناً</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl gold-btn text-xs font-bold text-center"
              >
                الانتقال إلى لوحة التحكم
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-bold text-center border border-white/10"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl gold-btn text-xs font-bold text-center"
                >
                  إنشاء متجر جديد الآن
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
