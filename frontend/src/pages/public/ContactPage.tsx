import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageCircle 
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { AmbientCanvas } from '../../components/common/AmbientCanvas';
import { apiClient } from '../../services/apiClient';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post('/admin/contacts', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `[الموضوع: ${formData.subject || 'عام'}] ${formData.message}`,
      });

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (e) {
      alert('تعذر إرسال الرسالة، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 relative font-['Cairo',sans-serif]">
      <AmbientCanvas />
      <PublicNavbar />

      <main className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span>فريق خدمة العملاء والحلول المخصصة</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            نحن هنا لـ <span className="gold-gradient-text">مساعدتك والرد على استفساراتك</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2">
            تواصل معنا لأي استفسار أو لطلب حلول مخصصة وشراكات تجارية لمؤسستك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details Column */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">البريد الإلكتروني المباشر</h4>
              <p className="text-xs text-slate-400">support@rudood.com</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">خدمة العملاء والواتساب</h4>
              <p className="text-xs text-slate-400">+966 50 000 0000</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white">المقر الرئيسي</h4>
              <p className="text-xs text-slate-400">طريق الملك فهد، الرياض، المملكة العربية السعودية</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 p-8 md:p-10 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-2xl backdrop-blur-xl">
            {isSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-white">تم استلام رسالتك بنجاح!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  شكراً لتواصلك معنا، سيقوم فريق الدعم بالرد عليك خلال أقل من ساعتين عمل.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold mt-4"
                >
                  إرسال استفسار آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم الكريم</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أحمد علي"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ahmed@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الهاتف / الواتساب</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 50 123 4567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">موضوع الاستفسار</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="طلب اشتراك للشركات / استفسار تقني"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">تفاصيل الرسالة</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب استفسارك بالتفصيل هنا..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
