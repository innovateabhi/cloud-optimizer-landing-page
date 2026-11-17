import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CloudOptimizerLogo: React.FC<LogoProps> = ({ 
  className = '', 
  iconOnly = false,
  size = 'md' 
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', badge: 'text-[11px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Geometric Logo Icon */}
      <div className={`relative ${currentSize.icon} rounded-xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] p-[1.5px] shadow-sm flex items-center justify-center shrink-0 group-hover:shadow-md transition-all`}>
        <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-[10px] flex items-center justify-center p-1.5 text-white">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Precision Cloud Silhouette */}
            <path
              d="M23.5 19.5C25.433 19.5 27 17.933 27 16C27 14.155 25.57 12.643 23.755 12.512C23.238 9.388 20.536 7 17.2 7C14.34 7 11.905 8.784 10.985 11.315C10.51 11.11 9.988 11 9.444 11C7.542 11 6 12.542 6 14.444C6 14.773 6.046 15.091 6.132 15.393C4.887 16.148 4 17.498 4 19.056C4 21.234 5.766 23 7.944 23H23.5C25.433 23 27 21.433 27 19.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.85"
            />
            {/* Central Upward Optimizer Arrow & Peak Node */}
            <path
              d="M16 21V12M16 12L12.5 15.5M16 12L19.5 15.5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Typography Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className={`font-display font-extrabold ${currentSize.text} tracking-tight leading-none text-slate-900`}>
            Cloud<span className="text-[#2563EB]">Optimizer</span>
          </div>
          <span className={`font-mono ${currentSize.badge} font-semibold uppercase tracking-wider text-slate-400 mt-0.5`}>
            FinOps Platform
          </span>
        </div>
      )}
    </div>
  );
};
