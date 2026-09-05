import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, Shield, Phone, Mail, Globe } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#050811] border-t border-white/5 pt-16 pb-12 relative z-10 font-['Cairo',sans-serif]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <span className="text-xl font-black gold-gradient-text">منصة ردود</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            المنصة الذكية الرائدة في المملكة العربية السعودية والخليج لأتمتة خدمة العملاء والمبيعات عبر واتساب ومختلف القنوات بالذكاء الاصطناعي التوليدي.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <Shield className="w-4 h-4" />
            <span>متوافقة 100% مع الأنظمة السعودية وMeta</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">روابط المنصة</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/how-it-works" className="hover:text-amber-400 transition-colors">دليل التشغيل والشرح</Link></li>
            <li><Link to="/features" className="hover:text-amber-400 transition-colors">المميزات وقدرات الذكاء الاصطناعي</Link></li>
            <li><Link to="/pricing" className="hover:text-amber-400 transition-colors">باقات الأسعار والاشتراكات</Link></li>
            <li><Link to="/demo" className="hover:text-amber-400 transition-colors">تجربة المحاكاة الحية</Link></li>
            <li><Link to="/blog" className="hover:text-amber-400 transition-colors">المدونة والمقالات</Link></li>
          </ul>
        </div>

        {/* Channels Integration */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">التكاملات المدعومة</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2"><span className="text-emerald-400">●</span> واتساب كلاود الرسمي (WhatsApp Cloud API)</li>
            <li className="flex items-center gap-2"><span className="text-sky-400">●</span> تليجرام بوت (Telegram Bot)</li>
            <li className="flex items-center gap-2"><span className="text-rose-400">●</span> إنستغرام دايركت (Instagram Direct)</li>
            <li className="flex items-center gap-2"><span className="text-amber-400">●</span> ويدجت الشات المباشر للمتاجر (Web Widget)</li>
            <li className="flex items-center gap-2"><span className="text-purple-400">●</span> منصات سلة، زد، وشوبيفاي</li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">تواصل معنا</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400" /> support@rudood.com</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> +966 50 000 0000</li>
            <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-amber-400" /> الرياض، المملكة العربية السعودية</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} منصة ردود (Rudood AI). جميع الحقوق محفوظة.</p>
        <p className="flex items-center gap-1">
          صُنعت بكل <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> للتجارة الإلكترونية العربية
        </p>
      </div>
    </footer>
  );
};
