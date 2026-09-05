import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Bot, 
  MessageSquare, 
  Users, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Cpu, 
  FileText, 
  ListOrdered, 
  ArrowUpRight, 
  ShoppingBag,
  Activity,
  RefreshCw,
  ChevronLeft
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { apiClient } from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';

export const DashboardPage: React.FC = () => {
  const { user, bot } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (selectedPeriod = period) => {
    setIsRefreshing(true);
    try {
      const res = await apiClient.get(`/dashboard/stats?period=${selectedPeriod}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(period);
  }, [period]);

  const handlePeriodChange = (newPeriod: '7d' | '30d' | '90d' | '12m') => {
    setPeriod(newPeriod);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-amber-400 text-sm font-bold">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>جاري تحميل بيانات لوحة التحكم والمؤشرات...</span>
        </div>
      </div>
    );
  }

  const primaryKpis = data?.primary_kpis || {};
  const secondaryKpis = data?.secondary_kpis || {};
  const roiStats = data?.roi_stats || {};
  const monthlyTrends = data?.monthly_trends || { labels: [], ai_resolved_series: [], hours_saved_series: [] };
  const chart7Days = data?.chart_7days || { labels: [], messages: [] };
  const channelDonut = data?.channel_donut || {};
  const recentConversions = data?.recent_conversions || [];
  const recentConversations = data?.recent_conversations || [];
  const channels = data?.channels || [];
  const recentRules = data?.recent_rules || [];
  const recentDecisions = data?.recent_decisions || [];

  // Format dual-axis trends data for Recharts
  const trendsChartData = (monthlyTrends.labels || []).map((label: string, idx: number) => ({
    name: label,
    ai_resolved: monthlyTrends.ai_resolved_series?.[idx] ?? 0,
    hours_saved: monthlyTrends.hours_saved_series?.[idx] ?? 0,
    revenue: monthlyTrends.revenue_series?.[idx] ?? 0,
  }));

  // Format 7-day activity data
  const activityChartData = (chart7Days.labels || []).map((label: string, idx: number) => ({
    name: label,
    messages: chart7Days.messages?.[idx] ?? 0,
  }));

  // Format Channel Donut data
  const pieData = Object.entries(channelDonut).map(([key, val]) => ({
    name: key === 'whatsapp' ? 'WhatsApp' : key === 'web' ? 'Web Widget' : key === 'telegram' ? 'Telegram' : 'Instagram',
    value: Number(val),
  }));

  const PIE_COLORS = ['#22c55e', '#d4af37', '#0ea5e9', '#f43f5e'];

  const periodLabels: Record<string, string> = {
    '7d': 'آخر 7 أيام',
    '30d': 'آخر 30 يوماً',
    '90d': 'آخر 3 أشهر',
    '12m': 'سنة كاملة',
  };

  return (
    <div className="space-y-8 font-['Cairo',sans-serif] pb-12">
      
      {/* ── 1. Top Greeting Banner & Controls ──────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-xl shadow-2xl">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <span>أهلاً بك، {user?.name || 'متجر الأمجاد'}</span>
            <span>👋</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">إليك ملخص أداء مساعدك الذكي ومبيعات المتجر المحققة لهذا اليوم</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Data Button */}
          <button
            onClick={() => fetchDashboardData(period)}
            title="تحديث البيانات الفوري"
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 text-amber-300 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* Bot Live Status Pill */}
          <Link
            to="/bot-settings"
            className="px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>البوت: {bot?.is_active ? 'متصل ويعمل 🟢' : 'متوقف مؤقتاً ⏸'}</span>
          </Link>

          {/* Monthly Message Quota Pill */}
          <div className="px-3.5 py-2 rounded-full bg-slate-800 border border-white/5 text-xs text-amber-300 font-bold flex items-center gap-2">
            <span>رصيد الرسائل:</span>
            <span className="font-mono text-white">{data?.quota?.used ?? 0} / {data?.quota?.limit ?? 1000}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Conversion Analytics & ROI Ribbon ────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>العائد المالي على الاستثمار ومبيعات الذكاء الاصطناعي (Conversion & ROI Analytics)</span>
          </h3>

          {/* Period Filter Buttons (7d, 30d, 90d, 12m) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
            {(['7d', '30d', '90d', '12m'] as const).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  period === p
                    ? 'gold-btn text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Revenue Generated */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/30 shadow-xl space-y-2 relative overflow-hidden transition-all hover:border-amber-500/50">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-bold">الإيرادات المحققة عبر ردود</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +24.5%
              </span>
            </div>
            <h4 className="text-2xl font-black text-amber-300">
              {Number(roiStats.revenue_generated ?? 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">ر.س</span>
            </h4>
            <span className="text-[10px] text-slate-400 block">مبيعات مكتملة ناتجة عن محادثات AI</span>
          </div>

          {/* 2. Deflection Rate */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/30 shadow-xl space-y-2 transition-all hover:border-emerald-500/50">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-bold">معدل تجنيب الموظفين (Deflection)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                آلي بالكامل
              </span>
            </div>
            <h4 className="text-2xl font-black text-emerald-400">
              {roiStats.deflection_rate ?? 94.8}%
            </h4>
            <span className="text-[10px] text-slate-400 block">{roiStats.bot_resolved ?? 0} استفسار حُل دون تدخل بشري</span>
          </div>

          {/* 3. Hours Saved */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-500/10 to-slate-900 border border-sky-500/30 shadow-xl space-y-2 transition-all hover:border-sky-500/50">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-bold">ساعات عمل الموظفين الموفرة</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black">
                وفر تشغيلي
              </span>
            </div>
            <h4 className="text-2xl font-black text-sky-400">
              {roiStats.hours_saved ?? 0} <span className="text-xs text-slate-400 font-normal">ساعة</span>
            </h4>
            <span className="text-[10px] text-slate-400 block">توفير تكلفة قدره ~{Number(roiStats.cost_savings_amount ?? 0).toLocaleString()} ر.س</span>
          </div>

          {/* 4. Attributed Orders */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-500/10 to-slate-900 border border-orange-500/30 shadow-xl space-y-2 transition-all hover:border-orange-500/50">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-bold">طلبات الشراء المحولة</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-black">
                تحويل {roiStats.conversion_rate ?? 0}%
              </span>
            </div>
            <h4 className="text-2xl font-black text-white">
              {roiStats.converted_orders_count ?? 0} <span className="text-xs text-slate-400 font-normal">طلب</span>
            </h4>
            <span className="text-[10px] text-slate-400 block">متوسط قيمة الطلب: {Number(roiStats.average_order_value ?? 0).toLocaleString()} ر.س</span>
          </div>
        </div>
      </div>

      {/* ── 3. Primary & Secondary Operational KPIs (With Clickable Deep Links) ─ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Conversations -> /live-chat */}
        <Link
          to="/live-chat"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/5 hover:border-amber-500/30 flex items-center gap-3 transition-all hover:scale-[1.02] group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-all">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">إجمالي المحادثات</span>
            <span className="text-lg font-black text-white">{primaryKpis.total_conversations ?? 0}</span>
          </div>
        </Link>

        {/* AI Resolution -> /playground */}
        <Link
          to="/playground"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/5 hover:border-emerald-500/30 flex items-center gap-3 transition-all hover:scale-[1.02] group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">ردود الذكاء الاصطناعي</span>
            <span className="text-lg font-black text-white">{primaryKpis.resolution_rate ?? '94.8%'}</span>
          </div>
        </Link>

        {/* Active Customers -> /live-chat?filter=unhandled */}
        <Link
          to="/live-chat"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/30 flex items-center gap-3 transition-all hover:scale-[1.02] group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-all">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">العملاء النشطون</span>
            <span className="text-lg font-black text-white">{primaryKpis.new_inquiries ?? 0}</span>
          </div>
        </Link>

        {/* Response Time -> /bot-settings */}
        <Link
          to="/bot-settings"
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/5 hover:border-rose-500/30 flex items-center gap-3 transition-all hover:scale-[1.02] group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition-all">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">متوسط سرعة الرد</span>
            <span className="text-lg font-black text-white">{primaryKpis.avg_response_time ?? '0.4 ثانية'}</span>
          </div>
        </Link>

        {/* Active Bots -> /bot-settings */}
        <Link
          to="/bot-settings"
          className="p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-white/5 hover:border-purple-500/30 flex items-center gap-3 transition-all hover:scale-[1.02] group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">البوتات النشطة</span>
            <span className="text-base font-bold text-white">{secondaryKpis.active_bots ?? 1}</span>
          </div>
        </Link>

        {/* Team Users */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">مستخدمو الفريق</span>
            <span className="text-base font-bold text-white">{secondaryKpis.team_users ?? 1}</span>
          </div>
        </div>

        {/* Knowledge Docs -> /knowledge-base */}
        <Link
          to="/knowledge-base"
          className="p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-white/5 hover:border-amber-500/30 flex items-center gap-3 transition-all hover:scale-[1.02] group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">مستندات المعرفة</span>
            <span className="text-base font-bold text-white">{secondaryKpis.knowledge_docs ?? 0}</span>
          </div>
        </Link>

        {/* Connected Channels -> /channels */}
        <Link
          to="/channels"
          className="p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800/60 border border-white/5 hover:border-teal-500/30 flex items-center gap-3 transition-all hover:scale-[1.02] group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-500/20 transition-all">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">القنوات المتصلة</span>
            <span className="text-base font-bold text-white">{secondaryKpis.connected_channels ?? 3}</span>
          </div>
        </Link>
      </div>

      {/* ── 4. Visual Trends & Attributed Orders Grid ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Deflection Trends Dual-Axis Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>اتجاهات تجنيب الموظفين وساعات العمل الموفرة</span>
              </h4>
              <p className="text-[11px] text-slate-400">مقارنة شهرية بين التذاكر المحلولة ذاتياً وساعات وفر العمل</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] text-amber-300 font-bold border border-white/5">
              {periodLabels[period]}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#22c55e" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#d4af37" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar yAxisId="left" dataKey="ai_resolved" name="تذاكر محلولة بالذكاء" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="hours_saved" name="ساعات موفرة" stroke="#d4af37" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recent Attributed Sales Orders Table */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>أحدث المبيعات المحولة عبر AI</span>
              </h4>
              <p className="text-[10px] text-slate-400">طلبات تمت بعد تفاعل مباشر مع المساعد الذكي</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold">
              محققة ✓
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                  <th className="pb-2">الطلب</th>
                  <th className="pb-2">العميل</th>
                  <th className="pb-2">المصدر</th>
                  <th className="pb-2">القيمة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentConversions.length > 0 ? (
                  recentConversions.map((o: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-white text-[11px]">{o.order_number}</td>
                      <td className="py-2.5 text-slate-300 text-[11px]">{o.customer_name || 'عميل المتجر'}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 text-[9px] font-bold border border-white/5">
                          {o.attribution_type === 'catalog_order'
                            ? 'كتالوج 🛍️'
                            : o.attribution_type === 'product_recommendation'
                            ? 'توصية 💡'
                            : 'شات 💬'}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-emerald-400 text-[11px]">{Number(o.total_amount).toLocaleString()} ر.س</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500 text-xs">
                      لا توجد طلبات محولة بعد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">يتم التتبع آلياً عبر محرك التحويلات المباشر</span>
            <Link to="/live-chat" className="text-[10px] text-amber-400 hover:underline flex items-center gap-1">
              <span>عرض المحادثات</span>
              <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 5. Activity Charts (7 Days Area & Channel Donut) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Days Activity Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>نشاط الرسائل (آخر 7 أيام)</span>
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData}>
                <defs>
                  <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11 }} />
                <Area type="monotone" dataKey="messages" name="الرسائل" stroke="#d4af37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMsg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution Donut */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>توزيع القنوات</span>
            </h4>
            <Link to="/channels" className="text-[10px] text-amber-400 hover:underline flex items-center gap-1">
              <span>إدارة القنوات</span>
              <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 6. Operational Real-Time Tables (With Navigation Links) ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table 1: Recent Conversations */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>آخر المحادثات</span>
            </h4>
            <Link to="/live-chat" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>عرض جميع المحادثات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                  <th className="pb-2">العميل</th>
                  <th className="pb-2">القناة</th>
                  <th className="pb-2">حالة الرد</th>
                  <th className="pb-2">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentConversations.length > 0 ? (
                  recentConversations.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-white text-[11px]">{c.customer_name}</td>
                      <td className="py-2.5 text-slate-300 text-[11px]">{c.platform}</td>
                      <td className="py-2.5">
                        {c.is_bot_paused ? (
                          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-bold">
                            محول للموظف
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                            آلي 🤖
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-slate-500 text-[10px]">{c.updated_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="py-6 text-center text-slate-500">لا توجد محادثات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Connected Channels */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>حالة القنوات المتصلة</span>
            </h4>
            <Link to="/channels" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>إدارة القنوات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                  <th className="pb-2">القناة</th>
                  <th className="pb-2">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {channels.length > 0 ? (
                  channels.map((ch: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-white text-[11px]">{ch.platform}</td>
                      <td className="py-2.5">
                        {ch.is_connected ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> متصل
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold text-[11px]">مفصول</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2} className="py-6 text-center text-slate-500">لا توجد قنوات مسجلة</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Recent Auto Rules */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-amber-400" />
              <span>أحدث القواعد المضافة</span>
            </h4>
            <Link to="/knowledge-base" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>إدارة القواعد</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                  <th className="pb-2">السؤال / الكلمة الدلالية</th>
                  <th className="pb-2">الإجابة المخصصة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentRules.length > 0 ? (
                  recentRules.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-white text-[11px] truncate max-w-[120px]">{r.question}</td>
                      <td className="py-2.5 text-slate-400 text-[11px] truncate max-w-[180px]">{r.reply_template}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2} className="py-6 text-center text-slate-500">لا توجد قواعد مضافة بعد</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 4: Recent AI Decisions */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>أحدث قرارات الـ AI</span>
            </h4>
            <Link to="/playground" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>مختبر الـ AI</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                  <th className="pb-2">نوع الرد</th>
                  <th className="pb-2">وقت المعالجة</th>
                  <th className="pb-2">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentDecisions.length > 0 ? (
                  recentDecisions.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                          {d.trigger === 'auto_rule' ? 'قاعدة' : 'ذكاء RAG ⚡'}
                        </span>
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold text-[11px]">{d.response_time_ms} ms</td>
                      <td className="py-2.5 text-slate-500 text-[10px]">{d.created_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="py-6 text-center text-slate-500">لا توجد قرارات مسجلة بعد</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
