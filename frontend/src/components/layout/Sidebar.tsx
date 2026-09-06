import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Bot, 
  Sparkles, 
  BookOpen, 
  Share2, 
  ShieldAlert, 
  LogOut,
  Building,
  Users,
  CheckCircle2,
  BookMarked,
  Search,
  ArrowRightLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';

interface WorkspaceOption {
  id: number;
  company_name: string;
  plan_id?: string;
  status?: string;
}

export const Sidebar: React.FC = () => {
  const { user, logout, workspace, login } = useAuthStore();
  const location = useLocation();

  const [allWorkspaces, setAllWorkspaces] = useState<WorkspaceOption[]>([]);
  const [switching, setSwitching] = useState(false);
  const [counts, setCounts] = useState({
    pendingSubscribers: 0,
    totalWorkspaces: 0,
    totalUsers: 0,
    unhandledChats: 0,
  });

  useEffect(() => {
    if (user?.is_super_admin) {
      loadAdminTelemetry();
    }
  }, [user]);

  const loadAdminTelemetry = async () => {
    try {
      const [overRes, subRes] = await Promise.all([
        apiClient.get('/admin/overview').catch(() => null),
        apiClient.get('/admin/subscribers').catch(() => null),
      ]);

      if (overRes?.data?.success) {
        const ov = overRes.data.data;
        setCounts(prev => ({
          ...prev,
          totalWorkspaces: ov.total_workspaces || 0,
          totalUsers: ov.total_users || 0,
        }));
      }

      if (subRes?.data?.success) {
        const reqs = subRes.data.data.requests || [];
        const pending = reqs.filter((r: any) => r.status === 'pending').length;
        setCounts(prev => ({ ...prev, pendingSubscribers: pending }));
      }

      // Fetch all workspaces for switcher
      const wsRes = await apiClient.get('/admin/workspaces', { params: { per_page: 50 } }).catch(() => null);
      if (wsRes?.data?.success) {
        const wsList = (wsRes.data.data.workspaces || []).map((w: any) => ({
          id: w.id,
          company_name: w.company_name,
          plan_id: w.plan_id,
          status: w.status,
        }));
        setAllWorkspaces(wsList);
      }
    } catch {
      // Graceful fallback
    }
  };

  const handleSwitchWorkspace = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wsId = parseInt(e.target.value, 10);
    if (!wsId || wsId === workspace?.id) return;

    setSwitching(true);
    try {
      const res = await apiClient.post('/admin/workspaces/switch', { workspace_id: wsId });
      if (res.data.success) {
        const { token, user: newUser, workspace: newWs } = res.data.data;
        localStorage.setItem('rudood_token', token);
        login(token, newUser, newWs, null);
        toast.success(res.data.message || 'تم تحويل المتجر بنجاح ✓');
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'تعذر تبديل مساحة العمل');
    } finally {
      setSwitching(false);
    }
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <aside className="w-64 bg-[#090d1a]/95 backdrop-blur-xl border-l border-white/5 flex flex-col h-screen fixed top-0 right-0 z-40 font-['Cairo',sans-serif] select-none">
      
      {/* ── Brand Logo Header ──────────────────────────────────────────────── */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5 shrink-0 bg-slate-950/40">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <img
            src="/images/img.png"
            alt="منصة ردود"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h1 className="font-black text-sm tracking-wide gold-gradient-text">منصة ردود</h1>
            <p className="text-[9px] text-amber-400/80 font-bold uppercase tracking-wider">RUDOOD AI</p>
          </div>
        </NavLink>
      </div>

      {/* ── Super Admin Quick Switcher Banner (Laravel Blade Parity) ────────── */}
      {user?.is_super_admin && (
        <div className="p-3 mx-3 my-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg shadow-amber-500/5 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-400 font-black text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>مدير النظام</span>
            </span>
            <NavLink
              to="/admin"
              className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black hover:bg-amber-400 transition-colors shadow-sm"
            >
              لوحة الإدارة
            </NavLink>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3 text-amber-400/70" />
                <span>تصفح بصفتك متجر:</span>
              </span>
              {switching && <span className="text-amber-400 animate-pulse text-[9px]">جاري التبديل...</span>}
            </label>
            <select
              value={workspace?.id || ''}
              onChange={handleSwitchWorkspace}
              disabled={switching}
              className="w-full bg-slate-900/90 text-white text-[11px] font-bold py-1.5 px-2 rounded-xl border border-amber-500/40 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {allWorkspaces.length > 0 ? (
                allWorkspaces.map((ws) => (
                  <option key={ws.id} value={ws.id} className="bg-slate-900 text-white">
                    {ws.company_name} {ws.id === 1 ? '(الرئيسي)' : ''}
                  </option>
                ))
              ) : (
                <option value={workspace?.id || 1}>{workspace?.company_name || 'متجر الأمجاد'}</option>
              )}
            </select>
          </div>
        </div>
      )}

      {/* ── Quick Search Trigger (⌘K) ───────────────────────────────────────── */}
      <div className="px-3 mb-2 shrink-0">
        <button
          onClick={openCommandPalette}
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white transition-all text-xs cursor-pointer group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-medium">بحث سريع...</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-white/10 text-[9px] font-mono text-amber-300">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ── Navigation Menu (Hierarchical Organization) ────────────────────── */}
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* Group 1: لوحة المتجر الحالي */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400/80">
            لوحة المتجر الحالي
          </div>
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-amber-400 shrink-0" />
                <span>الرئيسية</span>
              </div>
            </NavLink>

            <NavLink
              to="/live-chat"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <MessageSquareText className="w-4 h-4 text-sky-400 shrink-0" />
                <span>المحادثات المباشرة</span>
              </div>
              {counts.unhandledChats > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30">
                  {counts.unhandledChats}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Group 2: الذكاء الاصطناعي والتدريب */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400/80">
            الذكاء الاصطناعي والتدريب
          </div>
          <div className="space-y-1">
            <NavLink
              to="/knowledge-base"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تدريب الذكاء وقاعدة المعرفة</span>
            </NavLink>

            <NavLink
              to="/playground"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>اختبار البوت (Playground)</span>
            </NavLink>

            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-800/50'
                }`
              }
            >
              <BookMarked className="w-4 h-4 text-amber-400 shrink-0" />
              <span>دليل تشغيل البوت لمتجرك</span>
            </NavLink>
          </div>
        </div>

        {/* Group 3: القنوات والتكاملات */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400/80">
            القنوات والتكاملات
          </div>
          <div className="space-y-1">
            <NavLink
              to="/channels"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Share2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>ربط القنوات والتكاملات</span>
            </NavLink>

            <NavLink
              to="/bot-settings"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Bot className="w-4 h-4 text-amber-400 shrink-0" />
              <span>إعدادات وتخصيص البوت</span>
            </NavLink>
          </div>
        </div>

        {/* Group 4: لوحة الإدارة العليا (Super Admin Parity) */}
        {user?.is_super_admin && (
          <div className="pt-2 border-t border-white/5">
            <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>لوحة الإدارة العليا</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">PRO</span>
            </div>
            <div className="space-y-1">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive && !location.search
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-dashed border-amber-500/30'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>لوحة Super Admin المركزية</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=subscribers"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>طلبات المشتركين</span>
                </div>
                {counts.pendingSubscribers > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
                    {counts.pendingSubscribers}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin?tab=workspaces"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>إدارة جميع المتاجر</span>
                </div>
                {counts.totalWorkspaces > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                    {counts.totalWorkspaces}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin?tab=users"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-sky-300 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>إدارة جميع المستخدمين</span>
                </div>
                {counts.totalUsers > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-bold border border-sky-500/30">
                    {counts.totalUsers}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        )}

      </nav>

      {/* ── User Account Bar at Bottom ─────────────────────────────────────── */}
      <div className="p-3 border-t border-white/5 bg-slate-950/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-md">
            {user?.name?.charAt(0) || 'م'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-amber-400/80 truncate font-semibold">
              {workspace?.company_name || 'متجري'}
            </p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          title="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
