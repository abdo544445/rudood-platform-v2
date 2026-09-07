import React, { useState, useEffect } from 'react';
import { Settings, Wrench, Clock, ServerCog } from 'lucide-react';

interface MaintenancePageProps {
  maintenance: {
    message: string;
    scheduled_ends_at: string | null;
  };
}

export function MaintenancePage({ maintenance }: MaintenancePageProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    if (!maintenance.scheduled_ends_at) return;

    const target = new Date(maintenance.scheduled_ends_at).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [maintenance.scheduled_ends_at]);

  return (
    <div className="min-h-screen bg-[#080d19] flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Cairo',sans-serif]">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 text-center">
        
        {/* Animated Gears Logo */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Settings className="w-24 h-24 text-amber-400 absolute top-0 right-0 animate-[spin_6s_linear_infinite]" />
          <Wrench className="w-16 h-16 text-slate-500 absolute bottom-0 left-0" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white gold-gradient-text mb-4">
          أعمال صيانة وتطوير
        </h1>
        
        <div className="bg-slate-900/60 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 mb-8 shadow-2xl shadow-black/60">
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            {maintenance.message}
          </p>
        </div>

        {timeLeft && (
          <div className="mb-10">
            <h3 className="text-slate-400 font-bold mb-4 flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>الوقت المتبقي لانتهاء الصيانة:</span>
            </h3>
            
            <div className="flex items-center justify-center gap-4 text-center" dir="ltr">
              <div className="bg-slate-900/80 border border-white/5 rounded-2xl w-20 h-24 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{timeLeft.days}</span>
                <span className="text-xs text-slate-400 mt-1">Days</span>
              </div>
              <span className="text-2xl text-slate-600 font-bold">:</span>
              <div className="bg-slate-900/80 border border-white/5 rounded-2xl w-20 h-24 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-xs text-slate-400 mt-1">Hours</span>
              </div>
              <span className="text-2xl text-slate-600 font-bold">:</span>
              <div className="bg-slate-900/80 border border-white/5 rounded-2xl w-20 h-24 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-xs text-slate-400 mt-1">Mins</span>
              </div>
              <span className="text-2xl text-slate-600 font-bold">:</span>
              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl w-20 h-24 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <span className="text-3xl font-black text-amber-400">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-xs text-amber-500/50 mt-1">Secs</span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => window.location.reload()}
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
        >
          <ServerCog className="w-5 h-5" />
          <span>تحديث الصفحة</span>
        </button>

      </div>
    </div>
  );
}
