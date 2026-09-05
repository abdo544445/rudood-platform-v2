import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonBox: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-white/5 relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-500/5 to-transparent" />
  </div>
);

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="p-5 rounded-3xl bg-slate-900/80 border border-white/5 space-y-3 relative overflow-hidden"
      >
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-5 w-14 rounded-full" />
        </div>
        <SkeletonBox className="h-8 w-32" />
        <SkeletonBox className="h-3 w-40" />
      </div>
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/5 space-y-4">
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
      <SkeletonBox className="h-5 w-36" />
      <SkeletonBox className="h-4 w-20" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center py-2 border-b border-white/5">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBox
              key={c}
              className={`h-4 ${c === 0 ? 'w-28' : c === 1 ? 'w-36' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChat: React.FC = () => (
  <div className="space-y-4 p-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className={`flex items-end gap-2.5 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <SkeletonBox className="w-8 h-8 rounded-full shrink-0" />
        <SkeletonBox className={`h-16 ${i % 2 === 0 ? 'w-64' : 'w-72'} rounded-2xl`} />
      </div>
    ))}
  </div>
);
