import React, { useEffect, useState } from 'react';
import { X, Save, RefreshCw, ShoppingBag, MessageSquare, AlertCircle } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface Props {
  onClose: () => void;
}

export const WhatsAppConfigModal: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [config, setConfig] = useState({
    catalog_id: '',
    is_catalog_active: false,
    auto_reply_with_catalog: false,
  });

  const fetchConfig = async () => {
    try {
      const res = await apiClient.get('/channels/whatsapp/catalog');
      if (res.data.success) {
        setConfig({
          catalog_id: res.data.data.catalog_id || '',
          is_catalog_active: res.data.data.is_catalog_active || false,
          auto_reply_with_catalog: res.data.data.auto_reply_with_catalog || false,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiClient.post('/channels/whatsapp/catalog', config);
      alert(res.data.message);
      onClose();
    } catch (e: any) {
      alert(e.response?.data?.message || 'تعذر حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    if (!config.catalog_id) {
      alert('الرجاء إدخال معرف الكتالوج أولاً وحفظ الإعدادات.');
      return;
    }
    setSyncing(true);
    try {
      const res = await apiClient.post('/channels/whatsapp/catalog/sync');
      alert(res.data.message + `\nالمنتجات المزامنة: ${res.data.data.total_products_synced}`);
    } catch (e: any) {
      alert(e.response?.data?.message || 'فشل مزامنة الكتالوج');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-['Cairo']">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">إعدادات كتالوج واتساب المتقدمة</h3>
              <p className="text-xs text-slate-400">ربط كتالوج Meta Commerce Manager بالبوت</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="text-center text-xs text-slate-400 py-8">جاري تحميل البيانات...</div>
          ) : (
            <>
              {/* Alert */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="text-[11px] text-blue-200 leading-relaxed">
                  يتيح لك الربط عرض منتجاتك كرسائل تفاعلية (Interactive Messages) داخل واتساب. تأكد من أن حساب WhatsApp Business الخاص بك مرتبط بنفس مدير الأعمال (Business Manager) الذي يحتوي على الكتالوج.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">معرف الكتالوج (Catalog ID)</label>
                  <input
                    type="text"
                    value={config.catalog_id}
                    onChange={(e) => setConfig({ ...config, catalog_id: e.target.value })}
                    placeholder="مثال: 123456789012345"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">تجد المعرف في إعدادات Meta Commerce Manager.</p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={config.is_catalog_active}
                      onChange={(e) => setConfig({ ...config, is_catalog_active: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                        تفعيل الكتالوج (رسائل تفاعلية)
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        السماح للبوت باستخدام رسائل القائمة (List Messages) والكتالوج لعرض المنتجات.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={config.auto_reply_with_catalog}
                      onChange={(e) => setConfig({ ...config, auto_reply_with_catalog: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                        الرد التلقائي بزر عرض المنتجات
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        إرسال زر تفاعلي للعملاء يفتح الكتالوج مباشرة عند طلب الشراء أو عرض السلع.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sync Button */}
              {config.catalog_id && (
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    <span>{syncing ? 'جاري المزامنة مع Meta...' : 'مزامنة وتحديث المنتجات من الكتالوج'}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/5 transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات ✓'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
