import React, { useEffect, useState } from 'react';
import { 
  X, 
  Building, 
  Bot, 
  Users, 
  Share2, 
  Wallet, 
  UserCheck, 
  Sparkles, 
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../../services/apiClient';

interface StoreDetailModalProps {
  workspaceId: number | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({
  workspaceId,
  onClose,
  onRefresh,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'bot' | 'team' | 'channels'>('overview');
  
  // Plan edit form
  const [planForm, setPlanForm] = useState({ plan_id: 'pro', price: 49 });
  // Bot edit form
  const [botForm, setBotForm] = useState<any>({
    name: '',
    ai_provider: 'gemini',
    model_type: 'gemini-1.5-flash',
    bot_tone: 'friendly',
    system_prompt: '',
    temperature: 0.7,
    is_active: true,
  });

  useEffect(() => {
    if (workspaceId) {
      loadWorkspaceDetails(workspaceId);
    }
  }, [workspaceId]);

  const loadWorkspaceDetails = async (id: number) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/admin/workspaces/${id}`);
      if (res.data.success) {
        const d = res.data.data;
        setData(d);
        setPlanForm({
          plan_id: d.workspace?.plan_id || 'pro',
          price: d.subscription?.price || (d.workspace?.plan_id === 'enterprise' ? 99 : 49),
        });
        const firstBot = (d.bots && d.bots[0]) || {};
        setBotForm({
          name: firstBot.name || `مساعد ${d.workspace?.company_name}`,
          ai_provider: firstBot.ai_provider || 'gemini',
          model_type: firstBot.model_type || 'gemini-1.5-flash',
          bot_tone: firstBot.bot_tone || 'friendly',
          system_prompt: firstBot.system_prompt || '',
          temperature: firstBot.temperature ?? 0.7,
          is_active: firstBot.is_active ?? true,
        });
      }
    } catch {
      toast.error('تعذر جلب تفاصيل المتجر');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;
    try {
      const res = await apiClient.put(`/admin/workspaces/${workspaceId}`, {
        plan_id: planForm.plan_id,
      });
      if (res.data.success) {
        toast.success('تم تحديث الخطة المالية للمتجر بنجاح ✓');
        loadWorkspaceDetails(workspaceId);
        onRefresh();
      }
    } catch {
      toast.error('تعذر تحديث الخطة المالية');
    }
  };

  const handleImpersonate = async () => {
    if (!workspaceId) return;
    try {
      const res = await apiClient.post(`/admin/workspaces/${workspaceId}/impersonate`);
      if (res.data.success) {
        toast.success(`تم تسجيل الدخول كمالك لمتجر «${data?.workspace?.company_name}»`);
        localStorage.setItem('rudood_token', res.data.data.token);
        window.location.href = '/dashboard';
      }
    } catch {
      toast.error('تعذر تسجيل الدخول كمالك المتجر');
    }
  };

  if (!workspaceId) return null;

  const ws = data?.workspace || {};
  const subscription = data?.subscription;
  const owner = data?.owner;
  const users = data?.users || [];
  const channels = data?.channels || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Cairo',sans-serif]">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{ws.company_name || 'ملف المتجر'}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5 font-mono">
                  #{ws.id}
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  ws.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {ws.status === 'active' ? 'نشط' : 'موقوف'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تاريخ التسجيل: {ws.created_at ? new Date(ws.created_at).toLocaleDateString('ar-SA') : 'N/A'} | المالك: {owner?.name || 'غير محدد'} ({owner?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImpersonate}
              className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              title="تصفح لوحة المتجر بصلاحية المالك"
            >
              <UserCheck className="w-4 h-4" />
              <span>دخول كمالك المتجر</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5 bg-slate-950/30 text-xs font-bold">
          {[
            { id: 'overview', label: 'نظرة عامة والاشتراك', icon: Wallet },
            { id: 'bot', label: 'إعدادات البوت والذكاء', icon: Bot },
            { id: 'team', label: `فريق العمل (${users.length})`, icon: Users },
            { id: 'channels', label: `القنوات (${channels.length})`, icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`pb-3 px-3 transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeSubTab === tab.id
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-amber-400 text-sm font-bold flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>جاري تحميل بيانات المتجر التفصيلية...</span>
            </div>
          ) : (
            <>
              {/* Tab 1: Overview & Subscription */}
              {activeSubTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Quick KPI stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                      <div className="text-[11px] text-slate-400 font-bold">المحادثات المستلمة</div>
                      <div className="text-xl font-black text-white mt-1">{ws.conversations_count || 0}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                      <div className="text-[11px] text-slate-400 font-bold">العملاء المسجلون</div>
                      <div className="text-xl font-black text-white mt-1">{ws.customers_count || 0}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                      <div className="text-[11px] text-slate-400 font-bold">رسائل المتجر الكلية</div>
                      <div className="text-xl font-black text-white mt-1">{ws.messages_count || 0}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                      <div className="text-[11px] text-slate-400 font-bold">مستخدمو الفريق</div>
                      <div className="text-xl font-black text-white mt-1">{users.length} أعضاء</div>
                    </div>
                  </div>

                  {/* Subscription card & edit */}
                  <div className="p-6 rounded-2xl bg-slate-950/60 border border-amber-500/20">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4">
                      <Wallet className="w-4 h-4" />
                      <span>تفاصيل الاشتراك والفوترة المالية</span>
                    </h3>

                    <form onSubmit={handleUpdatePlan} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1.5">الخطة / الباقة الحالية:</label>
                        <select
                          value={planForm.plan_id}
                          onChange={(e) => setPlanForm({ ...planForm, plan_id: e.target.value })}
                          className="w-full bg-slate-900 text-white text-xs font-bold p-2.5 rounded-xl border border-white/10 focus:border-amber-500"
                        >
                          <option value="starter">Starter ($19/شهرياً)</option>
                          <option value="pro">Pro ($49/شهرياً)</option>
                          <option value="enterprise">Enterprise ($99/شهرياً)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1.5">السعر الشهري ($):</label>
                        <input
                          type="number"
                          value={planForm.price}
                          onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-900 text-white text-xs font-bold p-2.5 rounded-xl border border-white/10 focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>تحديث الخطة المالية</span>
                        </button>
                      </div>
                    </form>

                    {subscription && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                        <span>حالة الاشتراك: <span className="text-emerald-400 font-bold">{subscription.status}</span></span>
                        <span>تاريخ التجديد القادم: <span className="text-white font-bold">{subscription.renews_at ? new Date(subscription.renews_at).toLocaleDateString('ar-SA') : 'N/A'}</span></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Bot Configuration */}
              {activeSubTab === 'bot' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{botForm.name || 'مساعد المتجر'}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        النموذج: <span className="text-amber-300 font-mono">{botForm.model_type}</span> ({botForm.ai_provider})
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      botForm.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {botForm.is_active ? 'البوت يعمل الآن ✓' : 'متوقف مؤقتاً'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">البرومبت الرئيسي (System Prompt):</label>
                      <textarea
                        rows={5}
                        value={botForm.system_prompt}
                        readOnly
                        className="w-full bg-slate-950 text-slate-300 text-xs p-3 rounded-xl border border-white/5 font-mono leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Team Members */}
              {activeSubTab === 'team' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-bold text-slate-400 mb-2">أعضاء الفريق وملاك المتجر:</h4>
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">لا يوجد مستخدمون مسجلون</div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((u: any) => (
                        <div key={u.id} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-slate-400 text-[11px]">{u.email} {u.phone ? `| ${u.phone}` : ''}</div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            u.role === 'owner' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role === 'owner' ? 'مالك المتجر' : 'وكيل دعم'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Channels */}
              {activeSubTab === 'channels' && (
                <div className="space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-bold text-slate-400 mb-2">القنوات المتصلة بالمتجر:</h4>
                  {channels.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">لم يتم ربط أي قنوات اتصال بعد لهذا المتجر</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {channels.map((ch: any) => (
                        <div key={ch.id} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
                          <span className="font-bold text-white capitalize">{ch.platform}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ch.is_connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {ch.is_connected ? 'متصل ✓' : 'غير متصل'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
