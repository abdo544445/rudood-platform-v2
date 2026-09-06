import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  MessageCircle, 
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../../services/apiClient';

export const SubscribersTab: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Approval form
  const [approveForm, setApproveForm] = useState({
    plan: 'pro',
    admin_notes: 'تمت الموافقة وتفعيل الحساب والمساعد الذكي بنجاح.',
  });

  // Rejection form
  const [rejectForm, setRejectForm] = useState({
    admin_notes: 'نعتذر عن عدم قبول الطلب في الوقت الحالي لعدم استيفاء الشروط.',
  });

  // Create form
  const [newSubForm, setNewSubForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    selected_plan: 'pro',
    notes: '',
    admin_notes: 'طلب مسجل من لوحة السوبر إدمن',
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/subscribers');
      if (res.data.success) {
        setRequests(res.data.data.requests || []);
      }
    } catch {
      toast.error('تعذر جلب طلبات المشتركين');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    try {
      const res = await apiClient.post(`/admin/subscribers/${selectedSub.id}/approve`, approveForm);
      if (res.data.success) {
        toast.success(res.data.message || `تم اعتماد وتفعيل متجر ${selectedSub.company_name} بنجاح ✓`);
        setApproveModalOpen(false);
        setSelectedSub(null);
        fetchSubscribers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل اعتماد المشترك');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    try {
      const res = await apiClient.post(`/admin/subscribers/${selectedSub.id}/reject`, rejectForm);
      if (res.data.success) {
        toast.success(res.data.message || 'تم رفض الطلب');
        setRejectModalOpen(false);
        setSelectedSub(null);
        fetchSubscribers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل رفض الطلب');
    }
  };

  const handleCreateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/subscribers', newSubForm);
      if (res.data.success) {
        toast.success(res.data.message || 'تمت إضافة المشترك بنجاح ✓');
        setCreateModalOpen(false);
        setNewSubForm({
          name: '',
          email: '',
          phone: '',
          company_name: '',
          selected_plan: 'pro',
          notes: '',
          admin_notes: 'طلب مسجل من لوحة السوبر إدمن',
        });
        fetchSubscribers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل إضافة المشترك');
    }
  };

  // Filter & Search logic
  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !query ||
      r.name?.toLowerCase().includes(query) ||
      r.email?.toLowerCase().includes(query) ||
      r.phone?.toLowerCase().includes(query) ||
      r.company_name?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  return (
    <div className="space-y-6 animate-fadeIn font-['Cairo',sans-serif]">
      
      {/* Header & Actions Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
              SUBSCRIBERS PIPELINE
            </span>
            <span className="text-xs text-slate-400">إدارة طلبات الانضمام والاشتراكات الجديدة</span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white mt-1">
            طلبات المشتركين وتفعيل المتاجر والشركات
          </h2>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشترك جديد يدوياً</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'pending', label: 'بانتظار المراجعة', count: pendingCount, color: 'text-amber-400' },
            { id: 'approved', label: 'المعتمدة والنشطة', count: approvedCount, color: 'text-emerald-400' },
            { id: 'rejected', label: 'المرفوضة', count: rejectedCount, color: 'text-rose-400' },
            { id: 'all', label: 'جميع الطلبات', count: requests.length, color: 'text-slate-300' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                statusFilter === tab.id ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، المتجر، أو الهاتف..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-amber-400 font-black">
                <th className="p-4">المشترك</th>
                <th className="p-4">الشركة / المتجر</th>
                <th className="p-4">بيانات التواصل</th>
                <th className="p-4">الخطة المطلوبة</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-amber-400 font-bold">
                    جاري تحميل طلبات المشتركين...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400">
                    لا توجد طلبات مشتركين في هذه الحالة حالياً.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((sub) => {
                  const cleanPhone = sub.phone?.replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}`;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Subscriber Name */}
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{sub.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString('ar-SA') : 'مؤخراً'}
                        </div>
                      </td>

                      {/* Company */}
                      <td className="p-4">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-amber-400" />
                          <span>{sub.company_name || 'متجر جديد'}</span>
                        </div>
                        {sub.notes && (
                          <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {sub.notes}
                          </div>
                        )}
                      </td>

                      {/* Contact & WhatsApp */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20 transition-colors"
                            title="فتح محادثة واتساب مباشرة مع التاجر"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{sub.phone || 'واتساب'}</span>
                          </a>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">{sub.email}</div>
                      </td>

                      {/* Plan */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                          sub.selected_plan === 'enterprise' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : sub.selected_plan === 'pro' || sub.selected_plan === 'professional'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {sub.selected_plan || 'Pro'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                          sub.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : sub.status === 'rejected'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                        }`}>
                          {sub.status === 'approved' ? 'معتمد ✓' : sub.status === 'rejected' ? 'مرفوض' : 'بانتظار المراجعة'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {sub.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedSub(sub);
                                  setApproveForm({ ...approveForm, plan: sub.selected_plan || 'pro' });
                                  setApproveModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-bold border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>اعتماد وتفعيل</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedSub(sub);
                                  setRejectModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>رفض</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-[11px]">
                              {sub.status === 'approved' ? 'تم تفعيل مساحة العمل' : 'تم الرفض'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Approve Subscriber ──────────────────────────────────────── */}
      {approveModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">اعتماد وتفعيل حساب المشترك</h3>
                <p className="text-xs text-slate-400">{selectedSub.name} ({selectedSub.company_name})</p>
              </div>
            </div>

            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">الخطة المعينة للمتجر:</label>
                <select
                  value={approveForm.plan}
                  onChange={(e) => setApproveForm({ ...approveForm, plan: e.target.value })}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                >
                  <option value="starter">Starter (1,000 رسالة)</option>
                  <option value="pro">Pro (3,000 رسالة - الموصى بها)</option>
                  <option value="enterprise">Enterprise (10,000 رسالة)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">ملاحظات الإدارة:</label>
                <textarea
                  rows={3}
                  value={approveForm.admin_notes}
                  onChange={(e) => setApproveForm({ ...approveForm, admin_notes: e.target.value })}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApproveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition-colors shadow-md"
                >
                  تأكيد الاعتماد وتوليد الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Reject Subscriber ───────────────────────────────────────── */}
      {rejectModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">رفض طلب المشترك</h3>
                <p className="text-xs text-slate-400">{selectedSub.name}</p>
              </div>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">سبب الرفض والملاحظات:</label>
                <textarea
                  rows={3}
                  value={rejectForm.admin_notes}
                  onChange={(e) => setRejectForm({ ...rejectForm, admin_notes: e.target.value })}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-rose-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-black hover:bg-rose-600 transition-colors shadow-md"
                >
                  تأكيد رفض الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Create Subscriber Manually ──────────────────────────────── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">إضافة طلب مشترك جديد</h3>
                <p className="text-xs text-slate-400">تسجيل بيانات تاجر جديد في خط أنابيب المشتركين</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubscriber} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">اسم المشترك / التاجر:</label>
                  <input
                    type="text"
                    value={newSubForm.name}
                    onChange={(e) => setNewSubForm({ ...newSubForm, name: e.target.value })}
                    placeholder="مثال: فيصل القحطاني"
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">اسم المتجر / الشركة:</label>
                  <input
                    type="text"
                    value={newSubForm.company_name}
                    onChange={(e) => setNewSubForm({ ...newSubForm, company_name: e.target.value })}
                    placeholder="مثال: متجر أصالة للعود"
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={newSubForm.email}
                    onChange={(e) => setNewSubForm({ ...newSubForm, email: e.target.value })}
                    placeholder="owner@store.com"
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">رقم الهاتف (مع الرمز):</label>
                  <input
                    type="text"
                    value={newSubForm.phone}
                    onChange={(e) => setNewSubForm({ ...newSubForm, phone: e.target.value })}
                    placeholder="966500000000"
                    className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">الخطة المطلوبة:</label>
                <select
                  value={newSubForm.selected_plan}
                  onChange={(e) => setNewSubForm({ ...newSubForm, selected_plan: e.target.value })}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Professional (Pro)</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">ملاحظات إضافية:</label>
                <textarea
                  rows={2}
                  value={newSubForm.notes}
                  onChange={(e) => setNewSubForm({ ...newSubForm, notes: e.target.value })}
                  placeholder="ملاحظات حول منصة المتجر (سلة، زد) وحجم الطلبات..."
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-colors shadow-md"
                >
                  حفظ المشترك في الانتظار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
