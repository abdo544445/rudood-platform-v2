import React from 'react';
import { Wrench } from 'lucide-react';
import { useMaintenanceStore } from '../../store/useMaintenanceStore';

interface MaintenanceButtonProps {
  className?: string;
  showIconOnlyOnMobile?: boolean;
}

export const MaintenanceButton: React.FC<MaintenanceButtonProps> = ({
  className = '',
  showIconOnlyOnMobile = false,
}) => {
  const { maintenance, setIsModalOpen } = useMaintenanceStore();
  const isActive = Boolean(maintenance.is_active);

  return (
    <button
      type="button"
      onClick={() => setIsModalOpen(true)}
      title="التحكم بوضع الصيانة والجدولة"
      className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer select-none ${
        isActive
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
          : 'bg-slate-900/90 text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-white shadow-sm'
      } ${className}`}
    >
      {isActive ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <Wrench className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className={showIconOnlyOnMobile ? 'hidden sm:inline' : 'inline'}>
            وضع الصيانة: نشط الآن
          </span>
        </>
      ) : (
        <>
          <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          <span className={showIconOnlyOnMobile ? 'hidden sm:inline' : 'inline'}>
            وضع الصيانة: معطل
          </span>
        </>
      )}
    </button>
  );
};
