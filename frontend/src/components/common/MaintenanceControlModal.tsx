import React, { useState, useEffect } from 'react';
import { Wrench, X, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMaintenanceStore } from '../../store/useMaintenanceStore';

export const MaintenanceControlModal: React.FC = () => {
  const { maintenance, isModalOpen, setIsModalOpen, toggleMaintenance } = useMaintenanceStore();

  const [isActive, setIsActive] = useState(maintenance.is_active);
  const [title, setTitle] = useState(maintenance.title || 'أعمال صيانة وتطوير مجدولة 🛠️');
  const [message, setMessage] = useState(maintenance.message || '');
  const [scheduledEndsAt, setScheduledEndsAt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when modal opens or when maintenance changes
  useEffect(() => {
    if (isModalOpen) {
      setIsActive(Boolean(maintenance.is_active));
      setTitle(maintenance.title || 'أعمال صيانة وتطوير مجدولة 🛠️');
      setMessage(
        maintenance.message ||
          'نقوم حالياً بإجراء تحديثات دورية وتطويرات هامة على أنظمة منصة ردود لتعزيز استقرار البنية التحتية وتقديم تجربة ردود ذكية فائقة السرعة.'
      );
      if (maintenance.scheduled_ends_at) {
        try {
          const d = new Date(maintenance.scheduled_ends_at);
          if (!isNaN(d.getTime())) {
            const pad = (n: number) => String(n).padStart(2, '0');
            setScheduledEndsAt(
              `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
            );
          } else {
            setScheduledEndsAt('');
          }
        } catch {
          setScheduledEndsAt('');
        }
      } else {
        setScheduledEndsAt('');
      }
    }
  }, [isModalOpen, maintenance]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const result = await toggleMaintenance({
        is_active: isActive,
        title,
        message,
        scheduled_ends_at: scheduledEndsAt ? scheduledEndsAt : null,
      });

      if (result.success) {
        toast.success(result.message || 'تم تحديث إعدادات وضع الصيانة بنجاح ✓');
        setIsModalOpen(false);
      } else {
        toast.error(result.message || 'تعذر حفظ إعدادات الصيانة');
      }
    } catch {
      toast.error('حدث خطأ غير متوقع أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-['Cairo',sans-serif] animate-fadeIn"
      onClick={() => !isSaving && setIsModalOpen(false)}
    >
      <div
        className="max-w-lg w-full bg-[#0b1120] border border-amber-500/30 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">التحكم بوضع الصيانة والجدولة</h3>
              <p className="text-xs text-slate-400">إدارة وضع الإغلاق العام وشاشة العد التنازلي</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            disabled={isSaving}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Master Switch Box */}
          <div
            onClick={() => setIsActive(!isActive)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-4 ${
              isActive
                ? 'bg-rose-500/15 border-rose-500/40 shadow-lg shadow-rose-500/10'
                : 'bg-slate-900/60 border-white/5 hover:border-white/15'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black ${isActive ? 'text-rose-300' : 'text-white'}`}>
                  تفعيل وضع الصيانة العام للمنصة
                </span>
                {isActive && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold animate-pulse">
                    نشط الآن ⚠️
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                عند التفعيل، سيتم تحويل جميع لوحات المتاجر وصفحات التسجيل والدخول إلى صفحة الصيانة والعد التنازلي.
              </p>
            </div>

            {/* Switch Toggle Icon */}
            <div
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 mt-1 ${
                isActive ? 'bg-rose-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform shadow-md ${
                  isActive ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              عنوان رسالة الصيانة
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أعمال صيانة وتطوير مجدولة 🛠️"
              required
              className="w-full bg-slate-900/90 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
            />
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              نص الرسالة التوضيحية للزوار والعملاء
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="نقوم حالياً بإجراء تحديثات دورية وتطويرات هامة على أنظمة منصة ردود لتعزيز استقرار البنية التحتية..."
              required
              className="w-full bg-slate-900/90 border border-white/10 focus:border-amber-500/50 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner leading-relaxed resize-none"
            />
          </div>

          {/* Scheduled Ends At (Datetime Picker) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>الموعد التقديري لانتهاء الصيانة (جدولة العد التنازلي)</span>
              </label>
              <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-bold">
                اختياري
              </span>
            </div>
            <input
              type="datetime-local"
              value={scheduledEndsAt}
              onChange={(e) => setScheduledEndsAt(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors shadow-inner font-mono"
            />
            <p className="text-[10px] text-slate-400">
              سيظهر هذا التوقيت في شاشة العد التنازلي المباشر (أيام، ساعات، دقائق، ثوانٍ).
            </p>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري التطبيق...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>حفظ وتطبيق فوراً</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
