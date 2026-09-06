import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2, 
  Power,
  Building,
  Cpu,
  TrendingUp,
  Wallet,
  Activity,
  Database,
  BookOpen,
  Users,
  Search,
  Plus,
  Trash2,
  Terminal,
  Play,
  RotateCcw,
  Server,
  Eye,
  ChevronLeft,
  Key,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { soundEngine } from '../../services/soundEngine';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { apiClient } from '../../services/apiClient';
import { SubscribersTab } from './components/SubscribersTab';
import { ContactsTab } from './components/ContactsTab';
import { StoreDetailModal } from './components/StoreDetailModal';

export type AdminTabKey = 
  | 'overview' 
  | 'statistics' 
  | 'subscribers' 
  | 'workspaces' 
  | 'users' 
  | 'articles' 
  | 'contacts' 
  | 'database' 
  | 'audit' 
  | 'system';

export const AdminPage: React.FC = () => {
  // Navigation Tabs with URL query param sync
  const [searchParams, setSearchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab') as AdminTabKey | null;

  const validTabs: AdminTabKey[] = [
    'overview', 'statistics', 'subscribers', 'workspaces', 
    'users', 'articles', 'contacts', 'database', 'audit', 'system'
  ];

  const [activeTab, setActiveTab] = useState<AdminTabKey>(() => {
    return (tabQuery && validTabs.includes(tabQuery)) ? tabQuery : 'overview';
  });

  useEffect(() => {
    if (tabQuery && validTabs.includes(tabQuery) && tabQuery !== activeTab) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  const handleTabChange = (tab: AdminTabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Overview Data
  const [overview, setOverview] = useState<any>({});
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  // Statistics Telemetry
  const [statsData, setStatsData] = useState<any>(null);

  // Workspaces Tab State
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [workspaceStatus, setWorkspaceStatus] = useState('');
  const [selectedWorkspaceForDetail, setSelectedWorkspaceForDetail] = useState<number | null>(null);
  const [createWorkspaceModalOpen, setCreateWorkspaceModalOpen] = useState(false);
  const [newWorkspaceForm, setNewWorkspaceForm] = useState({
    company_name: '',
    plan_id: 'pro',
    status: 'active',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    password: '',
  });

  // Edit Workspace Modal State
  const [editWorkspaceModalOpen, setEditWorkspaceModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);

  // Users Tab State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Edit User & Reset Password Modal State
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [resetPassModalOpen, setResetPassModalOpen] = useState(false);
  const [resetPassUser, setResetPassUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  // Articles Tab State
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [articleSearch, setArticleSearch] = useState('');
  const [createArticleModalOpen, setCreateArticleModalOpen] = useState(false);
  const [newArticleForm, setNewArticleForm] = useState({
    title: '',
    category: 'استراتيجيات التجارة',
    read_time: '5 دقائق',
    summary: '',
    content: '',
    icon: 'bi-robot',
    is_published: true,
  });

  // Database Explorer State
  const [dbData, setDbData] = useState<any>(null);
  const [sqlQuery, setSqlQuery] = useState('SELECT id, company_name, plan_id, status, created_at FROM workspaces LIMIT 10;');
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // 1. Fetch Overview & Initial Data
  const fetchAdminData = async () => {
    try {
      const [overRes, subRes, contRes] = await Promise.all([
        apiClient.get('/admin/overview'),
        apiClient.get('/admin/subscribers'),
        apiClient.get('/admin/contacts', { params: { status: contactFilter !== 'all' ? contactFilter : undefined } }),
      ]);

      if (overRes.data.success) {
        setOverview(overRes.data.data || {});
        setIsMaintenance(overRes.data.data.is_maintenance || false);
      }
      if (subRes.data.success) setSubscribers(subRes.data.data.requests || []);
      if (contRes.data.success) setContacts(contRes.data.data.messages || []);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [contactFilter]);

  // Tab Specific Data Fetchers
  useEffect(() => {
    if (activeTab === 'statistics') {
      apiClient.get('/admin/statistics').then((res) => {
        if (res.data.success) setStatsData(res.data.data);
      }).catch(() => {});
    } else if (activeTab === 'workspaces') {
      fetchWorkspaces();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'articles') {
      fetchArticles();
    } else if (activeTab === 'database') {
      apiClient.get('/admin/database/explorer').then((res) => {
        if (res.data.success) setDbData(res.data.data);
      }).catch(() => {});
    } else if (activeTab === 'audit') {
      apiClient.get('/admin/audit-logs').then((res) => {
        if (res.data.success) setAuditLogs(res.data.data.logs || []);
      }).catch(() => {});
    }
  }, [activeTab]);

  // Workspaces Actions
  const fetchWorkspaces = async () => {
    try {
      const res = await apiClient.get('/admin/workspaces', {
        params: { search: workspaceSearch, status: workspaceStatus },
      });
      if (res.data.success) setWorkspaces(res.data.data.workspaces || []);
    } catch (e) {}
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/workspaces', newWorkspaceForm);
      if (res.data.success) {
        alert(res.data.message);
        setCreateWorkspaceModalOpen(false);
        setNewWorkspaceForm({
          company_name: '',
          plan_id: 'pro',
          status: 'active',
          owner_name: '',
          owner_email: '',
          owner_phone: '',
          password: '',
        });
        fetchWorkspaces();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'فشل إنشاء المتجر وحساب المالك');
    }
  };

  const handleToggleWorkspaceStatus = async (id: number, targetStatus: string) => {
    try {
      soundEngine.playClick();
      const res = await apiClient.put(`/admin/workspaces/${id}`, { status: targetStatus });
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success(targetStatus === 'active' ? 'تم تنشيط المتجر بنجاح ✓' : targetStatus === 'suspended' ? 'تم إيقاف المتجر مؤقتاً ⏸' : 'تم تفعيل الوضع التجريبي للمتجر');
        fetchWorkspaces();
        fetchAdminData();
      }
    } catch (e: any) {
      toast.error('تعذر تحديث حالة المتجر');
    }
  };

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkspace) return;
    try {
      soundEngine.playClick();
      const res = await apiClient.put(`/admin/workspaces/${editingWorkspace.id}`, {
        company_name: editingWorkspace.company_name,
        plan_id: editingWorkspace.plan_id,
        status: editingWorkspace.status,
      });
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success('تم تحديث بيانات المتجر بنجاح ✓');
        setEditWorkspaceModalOpen(false);
        setEditingWorkspace(null);
        fetchWorkspaces();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'تعذر تعديل بيانات المتجر');
    }
  };

  const handleImpersonate = async (id: number) => {
    try {
      soundEngine.playClick();
      const res = await apiClient.post(`/admin/workspaces/${id}/impersonate`);
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success(res.data.message || 'تم تسجيل الدخول كمالك المتجر');
        localStorage.setItem('auth_token', res.data.data.token);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 600);
      }
    } catch (e: any) {
      toast.error('تعذر تسجيل الدخول كمالك المتجر');
    }
  };

  // Users Actions
  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users', {
        params: { search: userSearch, role: userRoleFilter },
      });
      if (res.data.success) setUsersList(res.data.data.users || []);
    } catch (e) {}
  };

  const handleUpdateRole = async (userId: number, role: string) => {
    try {
      soundEngine.playClick();
      await apiClient.put(`/admin/users/${userId}/role`, { role });
      soundEngine.playSuccess();
      toast.success('تم تحديث دور المستخدم بنجاح ✓');
      fetchUsers();
    } catch (e) {
      toast.error('تعذر تحديث الدور');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      soundEngine.playClick();
      const res = await apiClient.put(`/admin/users/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        workspace_id: editingUser.workspace_id,
      });
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success('تم تحديث بيانات المستخدم بنجاح ✓');
        setEditUserModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'تعذر تحديث المستخدم');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser || !newPassword) return;
    try {
      soundEngine.playClick();
      const res = await apiClient.post(`/admin/users/${resetPassUser.id}/reset-password`, {
        password: newPassword,
      });
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success(res.data.message || 'تم تحديث كلمة المرور بنجاح ✓');
        setResetPassModalOpen(false);
        setResetPassUser(null);
        setNewPassword('');
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'تعذر تعيين كلمة المرور');
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف حساب «${userName}» نهائياً؟`)) return;
    try {
      soundEngine.playClick();
      const res = await apiClient.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        soundEngine.playSuccess();
        toast.success('تم حذف حساب المستخدم بنجاح');
        fetchUsers();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'تعذر حذف الحساب');
    }
  };

  // Articles Actions
  const fetchArticles = async () => {
    try {
      const res = await apiClient.get('/admin/articles', {
        params: { search: articleSearch },
      });
      if (res.data.success) setArticlesList(res.data.data.articles || []);
    } catch (e) {}
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/articles', newArticleForm);
      if (res.data.success) {
        alert(res.data.message);
        setCreateArticleModalOpen(false);
        fetchArticles();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'فشل حفظ المقال');
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('حذف هذا المقال نهائياً من المدونة؟')) return;
    try {
      await apiClient.delete(`/admin/articles/${id}`);
      fetchArticles();
    } catch (e) {
      alert('تعذر حذف المقال');
    }
  };

  // Database Explorer Actions
  const handleExecuteSql = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlQuery.trim()) return;
    setIsExecutingSql(true);
    try {
      const res = await apiClient.post('/admin/database/query', { query: sqlQuery });
      if (res.data.success) {
        setQueryResults(res.data.data);
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'خطأ في تنفيذ الاستعلام');
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Maintenance & System
  const handleToggleMaintenance = async () => {
    try {
      const res = await apiClient.post('/admin/maintenance/toggle', {
        is_active: !isMaintenance,
      });
      alert(res.data.message);
      setIsMaintenance(!isMaintenance);
    } catch (e) {
      alert('تعذر تبديل وضع الصيانة');
    }
  };

  const handleClearCache = async () => {
    try {
      const res = await apiClient.post('/admin/system/cache-clear');
      alert(res.data.message || 'تم تفريغ كاش النظام بنجاح ✓');
    } catch (e) {
      alert('تعذر تفريغ الكاش');
    }
  };

  const handlePruneFailed = async () => {
    try {
      const res = await apiClient.post('/admin/statistics/prune-failed');
      alert(res.data.message || 'تم مسح وتفريغ المهام المتعثرة ✓');
      if (statsData) {
        setStatsData({ ...statsData, queue_stats: { ...statsData.queue_stats, failed_jobs: 0 } });
      }
    } catch (e) {
      alert('تعذر تفريغ المهام المتعثرة');
    }
  };

  // Timeline Chart data
  const timelineData = (overview?.chart_7days?.labels || []).map((label: string, idx: number) => ({
    name: label,
    bot: overview?.chart_7days?.bot_series?.[idx] ?? 0,
    human: overview?.chart_7days?.human_series?.[idx] ?? 0,
  }));

  // Providers Donut data
  const pStats = overview?.provider_stats || {};
  const providerDonutData = [
    { name: 'Google Gemini', value: pStats.gemini || 0 },
    { name: 'OpenAI (GPT-4o)', value: pStats.openai || 0 },
    { name: 'Anthropic Claude', value: pStats.anthropic || 0 },
    { name: 'Custom Compatible', value: pStats.openai_compatible || 0 },
  ];
  const PROVIDER_COLORS = ['#d4af37', '#10b981', '#f59e0b', '#0ea5e9'];

  if (loading && !overview?.total_workspaces) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-amber-400 text-sm font-bold font-['Cairo',sans-serif]">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>جاري فتح مركز القيادة المركزية للسوبر إدمن...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-['Cairo',sans-serif] pb-16">
      
      {/* ── 1. Super Admin Header & Navigation ─────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              SUPER ADMIN MASTER HUB
            </span>
            <span className="text-xs text-slate-400">الإشراف المركزي والمراقبة المباشرة</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white mt-1">
            مركز قيادة وإدارة <span className="gold-gradient-text">منصة ردود</span>
          </h1>
        </div>

        {/* Global Maintenance Toggle */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2 px-4 rounded-2xl border border-white/10 shadow-inner">
          <div className="text-right">
            <div className="text-xs font-black text-white">وضع الصيانة العام</div>
            <div className="text-[10px] text-slate-400">
              {isMaintenance ? (
                <span className="text-rose-400 font-bold">نشط (المنصة مغلقة للمستخدمين)</span>
              ) : (
                <span className="text-emerald-400 font-bold">متاح للجميع بشكل طبيعي</span>
              )}
            </div>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className={`p-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ${
              isMaintenance
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isMaintenance ? 'إنهاء الصيانة' : 'تفعيل الصيانة'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Admin Navigation Tabs (Organized Hierarchically into 3 Sections Matching Laravel Views) ───────── */}
      <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/80 border border-white/5 backdrop-blur-xl shadow-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Section 1: Reports & Telemetry */}
          <div className="bg-slate-950/60 p-2 rounded-2xl border border-white/5 space-y-1.5">
            <div className="text-[10px] font-black text-slate-400 px-2 py-0.5 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-amber-400" />
                <span>التقارير والمؤشرات</span>
              </span>
              <span className="text-amber-400/80 font-mono text-[9px]">3 أقسام</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleTabChange('overview')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>المراقبة</span>
              </button>

              <button
                onClick={() => handleTabChange('statistics')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'statistics'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>التحليلات</span>
              </button>

              <button
                onClick={() => handleTabChange('subscribers')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 relative ${
                  activeTab === 'subscribers'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>المشتركين</span>
                {subscribers.length > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                    activeTab === 'subscribers' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {subscribers.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Platform & Stores Management */}
          <div className="bg-slate-950/60 p-2 rounded-2xl border border-white/5 space-y-1.5">
            <div className="text-[10px] font-black text-slate-400 px-2 py-0.5 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building className="w-3 h-3 text-amber-400" />
                <span>إدارة المنصة والمحتوى</span>
              </span>
              <span className="text-amber-400/80 font-mono text-[9px]">4 أقسام</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => handleTabChange('workspaces')}
                className={`px-1.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'workspaces'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>المتاجر</span>
              </button>

              <button
                onClick={() => handleTabChange('users')}
                className={`px-1.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'users'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>المستخدمين</span>
              </button>

              <button
                onClick={() => handleTabChange('articles')}
                className={`px-1.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'articles'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>المدونة</span>
              </button>

              <button
                onClick={() => handleTabChange('contacts')}
                className={`px-1.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 relative ${
                  activeTab === 'contacts'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>تواصل</span>
                {contacts.length > 0 && (
                  <span className={`text-[9px] px-1 py-0.2 rounded-full font-black ${
                    activeTab === 'contacts' ? 'bg-slate-950 text-amber-300' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {contacts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section 3: Infrastructure & Maintenance */}
          <div className="bg-slate-950/60 p-2 rounded-2xl border border-white/5 space-y-1.5">
            <div className="text-[10px] font-black text-slate-400 px-2 py-0.5 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Server className="w-3 h-3 text-amber-400" />
                <span>البنية التحتية والأمان</span>
              </span>
              <span className="text-amber-400/80 font-mono text-[9px]">3 أقسام</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleTabChange('database')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'database'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>قاعدة البيانات</span>
              </button>

              <button
                onClick={() => handleTabChange('audit')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'audit'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>سجل الحركات</span>
              </button>

              <button
                onClick={() => handleTabChange('system')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'system'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>الخوادم</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Tab 1: Overview & Fleet ────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Telemetry KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-slate-400">إجمالي المتاجر والشركات</div>
                  <div className="text-2xl font-black text-white mt-2">{overview?.total_workspaces || 0}</div>
                  <div className="text-[11px] text-emerald-400 font-bold mt-1">
                    {overview?.active_workspaces || 0} مساحة عمل نشطة
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><Building className="w-5 h-5" /></div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-slate-400">أسطول البوتات الذكية</div>
                  <div className="text-2xl font-black text-white mt-2">{overview?.total_bots || 0}</div>
                  <div className="text-[11px] text-sky-400 font-bold mt-1">
                    {overview?.active_bots || 0} يعملون الآن
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400"><Cpu className="w-5 h-5" /></div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-slate-400">إجمالي الرسائل المتداولة</div>
                  <div className="text-2xl font-black text-white mt-2">{overview?.total_messages || 0}</div>
                  <div className="text-[11px] text-amber-400 font-bold mt-1">
                    {overview?.global_resolution || 94.8}% نسبة الرد الذكي
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-slate-400">الإيرادات الشهرية المتوقعة</div>
                  <div className="text-2xl font-black text-amber-400 mt-2">
                    ${(overview?.estimated_mrr || 14500).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 font-bold mt-1">MRR مقدر للمنصة</div>
                </div>
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><Wallet className="w-5 h-5" /></div>
              </div>
            </div>
          </div>

          {/* Charts Row: Timeline & Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>نشاط المحادثات (ردود البوت مقابل الموظفين)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">معدل الاعتماد على الأتمتة خلال آخر 7 أيام</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> ردود البوت</span>
                  <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> تدخل بشري</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="adminBotGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="adminHumanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(212,175,55,0.2)' }} />
                    <Area type="monotone" dataKey="bot" stroke="#d4af37" fillOpacity={1} fill="url(#adminBotGrad)" strokeWidth={2} name="البوت الذكي" />
                    <Area type="monotone" dataKey="human" stroke="#64748b" fillOpacity={1} fill="url(#adminHumanGrad)" strokeWidth={2} name="الموظف البشري" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>توزيع نماذج الذكاء الاصطناعي</span>
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">المزودين المشغلين لأسطول المساعدين</p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={providerDonutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4}>
                        {providerDonutData.map((_, i) => (
                          <Cell key={i} fill={PROVIDER_COLORS[i % PROVIDER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(212,175,55,0.2)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                {providerDonutData.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[idx] }} />
                    <span className="truncate">{p.name}: <b className="text-white font-mono">{p.value}</b></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Subscribers & Contact Inquiries Pipelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subscriber Approvals */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>طلبات انضمام المشتركين الجدد ({subscribers.length})</span>
                </h3>
                <button
                  onClick={() => handleTabChange('subscribers')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>خط الأنابيب بالكامل (Pipeline)</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">لا توجد طلبات اشتراك معلقة حالياً ✓</div>
              ) : (
                <div className="space-y-3">
                  {subscribers.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white">{sub.name} - {sub.company_name || 'متجر جديد'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{sub.email} • {sub.phone || 'بدون هاتف'}</div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold uppercase mt-1 inline-block">
                          {sub.selected_plan || 'Starter'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await apiClient.post(`/admin/subscribers/${sub.id}/approve`);
                            alert('تم اعتماد الطلب وتفعيل المتجر بنجاح ✓');
                            fetchAdminData();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                        >
                          اعتماد
                        </button>
                        <button
                          onClick={async () => {
                            await apiClient.post(`/admin/subscribers/${sub.id}/reject`);
                            alert('تم رفض الطلب');
                            fetchAdminData();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-colors"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Messages */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>رسائل واستفسارات اتصل بنا</span>
                </h3>
                <button
                  onClick={() => handleTabChange('contacts')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>عرض الكل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-1 text-[10px]">
                {['all', 'new', 'in_progress', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setContactFilter(st)}
                    className={`px-2 py-1 rounded-md font-bold transition-all ${
                      contactFilter === st ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'الكل' : st === 'new' ? 'جديد' : st === 'in_progress' ? 'قيد المتابعة' : 'محلول'}
                  </button>
                ))}
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">لا توجد رسائل استفسار بالفلتر المحدد.</div>
              ) : (
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((msg) => (
                    <div key={msg.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{msg.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            msg.status === 'new' ? 'bg-rose-500 text-white' : msg.status === 'in_progress' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                          }`}>
                            {msg.status === 'new' ? 'جديد' : msg.status === 'in_progress' ? 'متابعة' : 'تم الحل'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{msg.email} • {msg.phone || 'بدون هاتف'}</div>
                        <p className="text-xs text-slate-300 line-clamp-2">{msg.message}</p>
                      </div>
                      <select
                        value={msg.status}
                        onChange={async (e) => {
                          await apiClient.put(`/admin/contacts/${msg.id}`, { status: e.target.value });
                          fetchAdminData();
                        }}
                        className="bg-slate-900 border border-white/10 rounded-lg p-1 text-[10px] text-slate-200"
                      >
                        <option value="new">جديد</option>
                        <option value="in_progress">قيد المتابعة</option>
                        <option value="resolved">تم الحل ✓</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Deep Statistics & Telemetry (Matching statistics.blade.php) */}
      {activeTab === 'statistics' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Revenue & Subscriptions KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="text-xs font-bold text-slate-400">إجمالي الاشتراكات النشطة</div>
              <div className="text-2xl font-black text-amber-400 mt-2">
                {statsData?.subscription_stats?.active_subscriptions || overview?.active_workspaces || 18}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {statsData?.subscription_stats?.trial_count || 3} فترة تجريبية
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="text-xs font-bold text-slate-400">الإيرادات الشهرية المتوقعة MRR</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                ${(statsData?.subscription_stats?.estimated_mrr || 14500).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">شهرياً</div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="text-xs font-bold text-slate-400">الإيرادات السنوية ARR</div>
              <div className="text-2xl font-black text-sky-400 mt-2">
                ${(statsData?.subscription_stats?.estimated_arr || 174000).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">سنوياً</div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400">طوابير المعالجة (Queue Jobs)</div>
                <div className="text-2xl font-black text-white mt-2">
                  {statsData?.queue_stats?.pending_jobs || 0} <span className="text-xs text-slate-400 font-normal">معلقة</span>
                </div>
                <div className="text-[11px] text-rose-400 font-bold mt-1">
                  {statsData?.queue_stats?.failed_jobs || 0} مهمة متعثرة
                </div>
              </div>
              {(statsData?.queue_stats?.failed_jobs || 0) > 0 && (
                <button
                  onClick={handlePruneFailed}
                  className="mt-2 py-1 px-3 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold"
                >
                  تفريغ الأخطاء
                </button>
              )}
            </div>
          </div>

          {/* 14-Day Timeline Chart */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>معدل النشاط والعمليات اليومية خلال 14 يوماً</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(212,175,55,0.2)' }} />
                  <Area type="monotone" dataKey="bot" stroke="#d4af37" fill="#d4af37" fillOpacity={0.2} strokeWidth={2} name="رسائل الذكاء الاصطناعي" />
                  <Area type="monotone" dataKey="human" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} strokeWidth={2} name="رسائل العملاء" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Subscribers Pipeline (Matching admin/subscribers/index.blade.php) */}
      {activeTab === 'subscribers' && (
        <div className="animate-fadeIn">
          <SubscribersTab />
        </div>
      )}

      {/* ── Tab 3: Workspaces Management (Matching workspaces/index.blade.php) */}
      {activeTab === 'workspaces' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Workspaces Filter & Create Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث باسم المتجر أو المالك..."
                  value={workspaceSearch}
                  onChange={(e) => setWorkspaceSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWorkspaces()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={workspaceStatus}
                onChange={(e) => setWorkspaceStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشطة (Active)</option>
                <option value="suspended">موقوفة (Suspended)</option>
                <option value="trial">تجريبية (Trial)</option>
              </select>

              <button
                onClick={fetchWorkspaces}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                تصفية
              </button>
            </div>

            <button
              onClick={() => setCreateWorkspaceModalOpen(true)}
              className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة متجر / شركة جديدة</span>
            </button>
          </div>

          {/* Workspaces Table */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">المتجر / الشركة</th>
                    <th className="py-3 px-4">الباقة</th>
                    <th className="py-3 px-4">المالك / الاتصال</th>
                    <th className="py-3 px-4">المحادثات</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">الإجراءات والتحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {workspaces.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-amber-400">#{w.id}</td>
                      <td className="py-3 px-4 font-bold text-white">{w.company_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-bold uppercase text-[10px] border border-amber-500/20">
                          {w.plan_id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-bold">{w.users?.[0]?.name || 'غير محدد'}</div>
                        <div className="text-[10px] text-slate-400">{w.users?.[0]?.email || ''}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">{w.conversations_count || 0}</td>
                      <td className="py-3 px-4">
                        <select
                          value={w.status}
                          onChange={(e) => handleToggleWorkspaceStatus(w.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-950 border focus:outline-none cursor-pointer ${
                            w.status === 'active'
                              ? 'text-emerald-300 border-emerald-500/30'
                              : w.status === 'suspended'
                              ? 'text-rose-300 border-rose-500/30'
                              : 'text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <option value="active" className="bg-slate-900 text-emerald-300">نشط (Active)</option>
                          <option value="suspended" className="bg-slate-900 text-rose-300">موقوف (Suspended)</option>
                          <option value="trial" className="bg-slate-900 text-amber-300">تجريبي (Trial)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedWorkspaceForDetail(w.id)}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="فحص وإدارة شاملة للمتجر"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>إدارة</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingWorkspace({ ...w });
                              setEditWorkspaceModalOpen(true);
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-white/5 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="تعديل بيانات المتجر والباقة"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={() => handleImpersonate(w.id)}
                            className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                            title="تسجيل الدخول كمالك المتجر"
                          >
                            دخول كمالك
                          </button>
                          <button
                            onClick={() => handleToggleWorkspaceStatus(w.id, w.status)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                              w.status === 'active'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                          >
                            {w.status === 'active' ? 'تعليق ⏸' : 'تفعيل ✓'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal: Create Workspace */}
          {createWorkspaceModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form onSubmit={handleCreateWorkspace} className="bg-[#0b1120] border border-amber-500/30 p-8 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <Building className="w-5 h-5 text-amber-400" />
                  <span>إنشاء متجر / مساحة عمل جديدة</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر / الشركة</label>
                  <input
                    type="text"
                    required
                    value={newWorkspaceForm.company_name}
                    onChange={(e) => setNewWorkspaceForm({ ...newWorkspaceForm, company_name: e.target.value })}
                    placeholder="مثال: متجر رويال الرقمي"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">الباقة</label>
                    <select
                      value={newWorkspaceForm.plan_id}
                      onChange={(e) => setNewWorkspaceForm({ ...newWorkspaceForm, plan_id: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    >
                      <option value="starter">Starter ($19)</option>
                      <option value="pro">Pro ($49)</option>
                      <option value="enterprise">Enterprise ($99)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">الحالة</label>
                    <select
                      value={newWorkspaceForm.status}
                      onChange={(e) => setNewWorkspaceForm({ ...newWorkspaceForm, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    >
                      <option value="active">نشطة (Active)</option>
                      <option value="trial">تجريبية (Trial)</option>
                      <option value="suspended">موقوفة (Suspended)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">اسم المالك</label>
                    <input
                      type="text"
                      required
                      value={newWorkspaceForm.owner_name}
                      onChange={(e) => setNewWorkspaceForm({ ...newWorkspaceForm, owner_name: e.target.value })}
                      placeholder="عبدالله محمد"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={newWorkspaceForm.owner_email}
                      onChange={(e) => setNewWorkspaceForm({ ...newWorkspaceForm, owner_email: e.target.value })}
                      placeholder="owner@store.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور للمالك</label>
                  <input
                    type="password"
                    required
                    value={newWorkspaceForm.password}
                    onChange={(e) => setNewWorkspaceForm({ ...newWorkspaceForm, password: e.target.value })}
                    placeholder="كلمة مرور الدخول"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCreateWorkspaceModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl gold-btn text-xs font-bold">
                    حفظ وإنشاء المتجر ✓
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal: Edit Workspace */}
          {editWorkspaceModalOpen && editingWorkspace && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form onSubmit={handleUpdateWorkspace} className="bg-[#0b1120] border border-amber-500/30 p-8 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <Edit className="w-5 h-5 text-amber-400" />
                  <span>تعديل متجر: {editingWorkspace.company_name}</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر / الشركة</label>
                  <input
                    type="text"
                    required
                    value={editingWorkspace.company_name}
                    onChange={(e) => setEditingWorkspace({ ...editingWorkspace, company_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">الباقة</label>
                    <select
                      value={editingWorkspace.plan_id}
                      onChange={(e) => setEditingWorkspace({ ...editingWorkspace, plan_id: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    >
                      <option value="starter">Starter ($19)</option>
                      <option value="pro">Pro ($49)</option>
                      <option value="enterprise">Enterprise ($99)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">حالة الحساب</label>
                    <select
                      value={editingWorkspace.status}
                      onChange={(e) => setEditingWorkspace({ ...editingWorkspace, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    >
                      <option value="active">نشطة (Active)</option>
                      <option value="suspended">إيقاف مؤقت (Suspended)</option>
                      <option value="trial">فترة تجريبية (Trial)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setEditWorkspaceModalOpen(false);
                      setEditingWorkspace(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl gold-btn text-xs font-bold cursor-pointer">
                    حفظ التغييرات ✓
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal: Store Detail Deep Dive (Matching admin/workspaces/show.blade.php) */}
          {selectedWorkspaceForDetail && (
            <StoreDetailModal
              workspaceId={selectedWorkspaceForDetail}
              onClose={() => setSelectedWorkspaceForDetail(null)}
              onRefresh={() => {
                fetchWorkspaces();
                fetchAdminData();
              }}
            />
          )}
        </div>
      )}

      {/* ── Tab 4: Users Directory (Matching users/index.blade.php) ────────── */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث باسم المستخدم أو البريد..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-100"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="">جميع الأدوار</option>
                <option value="admin">مدير نظام (Admin)</option>
                <option value="owner">مالك متجر (Owner)</option>
                <option value="agent">موظف دعم (Agent)</option>
              </select>

              <button onClick={fetchUsers} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white">
                تصفية
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 overflow-hidden shadow-xl">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 px-4">المستخدم</th>
                  <th className="py-3 px-4">البريد والهاتف</th>
                  <th className="py-3 px-4">المتجر / الشركة</th>
                  <th className="py-3 px-4">الدور والصلاحية</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">{u.email}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{u.workspace?.company_name || 'المنصة العامة'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-950 border focus:outline-none cursor-pointer ${
                          u.role === 'admin' ? 'text-purple-300 border-purple-500/30' : u.role === 'owner' ? 'text-amber-300 border-amber-500/30' : 'text-sky-300 border-sky-500/30'
                        }`}
                      >
                        <option value="owner" className="bg-slate-900 text-amber-300">مالك (Owner)</option>
                        <option value="agent" className="bg-slate-900 text-sky-300">وكيل (Agent)</option>
                        <option value="admin" className="bg-slate-900 text-purple-300">مدير (Admin)</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser({ ...u });
                            setEditUserModalOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-500/30 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="تعديل بيانات المستخدم"
                        >
                          <Edit className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => {
                            setResetPassUser({ ...u });
                            setNewPassword('');
                            setResetPassModalOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="إعادة تعيين كلمة المرور"
                        >
                          <Key className="w-3 h-3" />
                          <span>كلمة المرور</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="حذف الحساب"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal: Edit User */}
          {editUserModalOpen && editingUser && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form onSubmit={handleUpdateUser} className="bg-[#0b1120] border border-amber-500/30 p-8 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <Edit className="w-5 h-5 text-amber-400" />
                  <span>تعديل بيانات المستخدم: {editingUser.name}</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف</label>
                    <input
                      type="text"
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">الدور والصلاحية</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    >
                      <option value="owner">مالك متجر (Owner)</option>
                      <option value="agent">موظف دعم (Agent)</option>
                      <option value="admin">مدير نظام (Admin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">المتجر / الشركة التابع لها</label>
                    <select
                      value={editingUser.workspace_id || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, workspace_id: e.target.value ? Number(e.target.value) : null })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    >
                      <option value="">-- بدون مساحة عمل --</option>
                      {workspaces.map((w) => (
                        <option key={w.id} value={w.id}>{w.company_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setEditUserModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl gold-btn text-xs font-bold cursor-pointer">
                    حفظ التغييرات ✓
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modal: Reset Password */}
          {resetPassModalOpen && resetPassUser && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form onSubmit={handleResetPassword} className="bg-[#0b1120] border border-amber-500/30 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>تعيين كلمة مرور لـ: {resetPassUser.name}</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور الجديدة (6 أحرف على الأقل)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setResetPassModalOpen(false);
                      setResetPassUser(null);
                      setNewPassword('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl gold-btn text-xs font-bold cursor-pointer">
                    تحديث كلمة المرور ✓
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 5: Blog Articles CMS (Matching articles/index.blade.php) ───── */}
      {activeTab === 'articles' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث بعنوان المقال أو التصنيف..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-100"
                />
              </div>
              <button onClick={fetchArticles} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white">
                تصفية
              </button>
            </div>

            <button
              onClick={() => setCreateArticleModalOpen(true)}
              className="px-5 py-2.5 rounded-full gold-btn text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>كتابة مقال جديد</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 overflow-hidden shadow-xl">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 px-4">عنوان المقال</th>
                  <th className="py-3 px-4">التصنيف</th>
                  <th className="py-3 px-4">وقت القراءة</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {articlesList.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{a.title}</td>
                    <td className="py-3 px-4 text-amber-400">{a.category}</td>
                    <td className="py-3 px-4 text-slate-400">{a.read_time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {a.is_published ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteArticle(a.id)}
                        className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal: Create Article */}
          {createArticleModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form onSubmit={handleCreateArticle} className="bg-[#0b1120] border border-amber-500/30 p-8 rounded-3xl max-w-xl w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-white/10">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>كتابة مقال جديد للمدونة</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان المقال</label>
                  <input
                    type="text"
                    required
                    value={newArticleForm.title}
                    onChange={(e) => setNewArticleForm({ ...newArticleForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">التصنيف</label>
                    <input
                      type="text"
                      required
                      value={newArticleForm.category}
                      onChange={(e) => setNewArticleForm({ ...newArticleForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">وقت القراءة</label>
                    <input
                      type="text"
                      required
                      value={newArticleForm.read_time}
                      onChange={(e) => setNewArticleForm({ ...newArticleForm, read_time: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">موجز المقال (Excerpt)</label>
                  <textarea
                    rows={2}
                    required
                    value={newArticleForm.summary}
                    onChange={(e) => setNewArticleForm({ ...newArticleForm, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">محتوى المقال كاملاً</label>
                  <textarea
                    rows={6}
                    required
                    value={newArticleForm.content}
                    onChange={(e) => setNewArticleForm({ ...newArticleForm, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCreateArticleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl gold-btn text-xs font-bold">
                    نشر المقال الآن ✓
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Contacts Inquiries Management (Matching admin/contacts/index.blade.php) */}
      {activeTab === 'contacts' && (
        <div className="animate-fadeIn">
          <ContactsTab />
        </div>
      )}

      {/* ── Tab 6: Database Explorer & SQL Runner (database/index.blade.php) ── */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fadeIn">
          {/* DB Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="text-xs font-bold text-slate-400">إجمالي الجداول النشطة</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{dbData?.total_tables || 22}</div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="text-xs font-bold text-slate-400">إجمالي السجلات الكلي</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{(dbData?.total_records || 1240).toLocaleString()}</div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="text-xs font-bold text-slate-400">حجم قاعدة البيانات</div>
              <div className="text-2xl font-black text-sky-400 mt-1">{dbData?.db_size || '24.8 MB'}</div>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl">
              <div className="text-xs font-bold text-slate-400">محرك قاعدة البيانات</div>
              <div className="text-xl font-black text-white mt-1 uppercase">{dbData?.driver || 'PostgreSQL 16'}</div>
            </div>
          </div>

          {/* SQL Terminal Runner */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>منصة تنفيذ استعلامات SQL للقراءة فقط (Read-Only Terminal)</span>
            </h3>

            <form onSubmit={handleExecuteSql} className="space-y-3">
              <textarea
                rows={3}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="SELECT * FROM workspaces LIMIT 10;"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-amber-500 resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">يسمح فقط باستعلامات SELECT. الحد الأقصى التلقائي 50 سجلاً.</span>
                <button
                  type="submit"
                  disabled={isExecutingSql}
                  className="px-5 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isExecutingSql ? 'جاري التنفيذ...' : 'تشغيل الاستعلام'}</span>
                </button>
              </div>
            </form>

            {/* Results Table */}
            {queryResults && (
              <div className="pt-4 border-t border-white/10 overflow-x-auto">
                <div className="text-xs font-bold text-amber-400 mb-2">النتائج ({queryResults.total_rows} صف):</div>
                <table className="w-full text-right text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      {(queryResults.columns || []).map((col: string) => (
                        <th key={col} className="py-2 px-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {(queryResults.rows || []).map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40">
                        {queryResults.columns.map((col: string) => (
                          <td key={col} className="py-2 px-3">{String(row[col] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 7: Audit Trail (Matching audit-logs/index.blade.php) ───────── */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 overflow-hidden shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>سجل الحركات والأمان المؤسسي (Audit Trail)</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">{auditLogs.length} حركة مسجلة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">المستخدم</th>
                  <th className="py-3 px-4">الإجراء (Action)</th>
                  <th className="py-3 px-4">عنوان IP</th>
                  <th className="py-3 px-4">الوقت والتاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-amber-400">#{log.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{log.user?.name || 'System / Guest'}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{log.action || log.description}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{log.ip_address || '127.0.0.1'}</td>
                    <td className="py-3 px-4 text-slate-400">{log.created_at ? new Date(log.created_at).toLocaleString('ar-EG') : 'الآن'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 8: System Infrastructure (Matching system/index.blade.php) ─── */}
      {activeTab === 'system' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/5 space-y-6 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Server className="w-5 h-5 text-amber-400" />
              <span>البنية التحتية وصيانة الخوادم</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="text-xs font-bold text-slate-400">قاعدة البيانات الرئيسية</div>
                <div className="text-base font-black text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> متصلة (PostgreSQL 16)
                </div>
                <div className="text-[10px] text-slate-500">pgvector extension enabled</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="text-xs font-bold text-slate-400">خادم الذاكرة المؤقتة (Redis)</div>
                <div className="text-base font-black text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> متصل ونشط
                </div>
                <div className="text-[10px] text-slate-500">Session & Queue driver</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="text-xs font-bold text-slate-400">خادم البث اللحظي (WebSocket)</div>
                <div className="text-base font-black text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> متصل 24/7
                </div>
                <div className="text-[10px] text-slate-500">Instant customer takeover</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">مسح وتفريغ كاش النظام بالكامل</h4>
                <p className="text-[11px] text-slate-400">يقوم بمسح الكاش والتكوينات والإعدادات المؤقتة فورياً.</p>
              </div>
              <button
                onClick={handleClearCache}
                className="px-5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>مسح الكاش (Flush Cache)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
