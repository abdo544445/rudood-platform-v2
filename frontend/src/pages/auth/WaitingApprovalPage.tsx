import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

export function WaitingApprovalPage() {
  const location = useLocation();
  const state = location.state as { email?: string; message?: string } | null;

  return (
    <div className="min-h-screen bg-[#080d19] flex items-center justify-center p-4 relative overflow-hidden font-['Cairo',sans-serif]">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 shadow-2xl shadow-black/60 flex flex-col items-center">
          
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-20"></div>
            <Clock className="w-10 h-10 text-amber-400" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-slate-900">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-white mb-2">طلبك قيد المراجعة</h1>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {state?.message || 'تم استلام طلب تسجيل متجرك بنجاح! حسابك الآن قيد المراجعة والاعتماد من قبل مدير النظام.'}
          </p>

          {state?.email && (
            <div className="w-full bg-slate-950 rounded-xl p-4 border border-white/5 mb-6 text-right flex flex-col gap-1">
              <span className="text-[11px] text-slate-500 font-bold">البريد الإلكتروني المسجل</span>
              <span className="text-sm font-mono text-amber-400">{state.email}</span>
            </div>
          )}

          <div className="w-full flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20"
            >
              العودة إلى صفحة الدخول
            </Link>
            
            <a
              href="mailto:support@rudood.com"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all border border-white/5"
            >
              التواصل مع الدعم الفني
            </a>
          </div>

        </div>
        <p className="text-xs text-slate-500 mt-6 font-mono">© 2026 Rudood AI Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
