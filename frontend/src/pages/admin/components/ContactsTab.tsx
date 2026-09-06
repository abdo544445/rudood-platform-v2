import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  MessageCircle, 
  Eye, 
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../../services/apiClient';

export const ContactsTab: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, new: 0, in_progress: 0, resolved: 0 });

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/contacts', {
        params: { status: statusFilter !== 'all' ? statusFilter : undefined },
      });
      if (res.data.success) {
        setMessages(res.data.data.messages || []);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch {
      toast.error('تعذر جلب رسائل تواصل معنا');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, nextStatus: 'new' | 'in_progress' | 'resolved') => {
    try {
      const res = await apiClient.put(`/admin/contacts/${id}`, { status: nextStatus });
      if (res.data.success) {
        toast.success('تم تحديث حالة الرسالة بنجاح ✓');
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, status: nextStatus });
        }
        fetchContacts();
      }
    } catch {
      toast.error('تعذر تحديث حالة الرسالة');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      msg.name?.toLowerCase().includes(q) ||
      msg.email?.toLowerCase().includes(q) ||
      msg.phone?.toLowerCase().includes(q) ||
      msg.subject?.toLowerCase().includes(q) ||
      msg.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn font-['Cairo',sans-serif]">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
              CONTACT INQUIRIES HUB
            </span>
            <span className="text-xs text-slate-400">صندوق استفسارات ورسائل نموذج اتصل بنا</span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white mt-1">
            رسائل تواصل معنا واستفسارات الزوار
          </h2>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'جميع الرسائل', count: stats.total },
            { id: 'new', label: 'رسائل جديدة', count: stats.new, highlight: true },
            { id: 'in_progress', label: 'قيد المعالجة', count: stats.in_progress },
            { id: 'resolved', label: 'مكتملة ومغلقة', count: stats.resolved },
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

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، الموضوع، أو البريد..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-amber-400 font-black">
                <th className="p-4">المرسل</th>
                <th className="p-4">الموضوع</th>
                <th className="p-4">التواصل</th>
                <th className="p-4">تاريخ الإرسال</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-amber-400 font-bold">
                    جاري تحميل الرسائل...
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400">
                    لا توجد رسائل تطابق التصفية.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => {
                  const cleanPhone = msg.phone?.replace(/[^0-9]/g, '');
                  const whatsappUrl = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}` : null;

                  return (
                    <tr key={msg.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{msg.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{msg.email}</div>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-amber-300 truncate">{msg.subject || 'بدون موضوع'}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{msg.message}</div>
                      </td>

                      <td className="p-4">
                        {whatsappUrl ? (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{msg.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">{msg.phone || '—'}</span>
                        )}
                      </td>

                      <td className="p-4 text-slate-400">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString('ar-SA') : 'N/A'}
                      </td>

                      <td className="p-4">
                        <select
                          value={msg.status}
                          onChange={(e) => handleUpdateStatus(msg.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                            msg.status === 'new'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : msg.status === 'in_progress'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          <option value="new" className="bg-slate-900 text-rose-400">جديدة</option>
                          <option value="in_progress" className="bg-slate-900 text-amber-400">قيد المعالجة</option>
                          <option value="resolved" className="bg-slate-900 text-emerald-400">مكتملة</option>
                        </select>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>عرض</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">تفاصيل استفسار الزائر</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">المرسل: <span className="text-white font-bold">{selectedMessage.name}</span></span>
                  <span className="text-amber-400 font-mono">{selectedMessage.phone}</span>
                </div>
                <div className="text-slate-400">البريد: <span className="text-white font-mono">{selectedMessage.email}</span></div>
                <div className="text-slate-400">التاريخ: <span className="text-white">{new Date(selectedMessage.created_at).toLocaleString('ar-SA')}</span></div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">موضوع الرسالة:</label>
                <div className="p-3 rounded-xl bg-slate-950 font-bold text-amber-300 border border-white/5">
                  {selectedMessage.subject || 'بدون موضوع'}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">نص الاستفسار:</label>
                <div className="p-4 rounded-xl bg-slate-950 text-slate-200 border border-white/5 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">تحديث الحالة:</span>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'resolved')}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                  >
                    تعليم كمكتملة ✓
                  </button>
                </div>

                {selectedMessage.phone && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center gap-1.5 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>مراسلة واتساب</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
