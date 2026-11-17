import React from 'react';
import { 
  Coins, 
  Clock, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

export const ImpactBanner: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-10 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-800">
          
          {/* Left Title Block */}
          <div className="lg:col-span-4 space-y-2 lg:border-r border-slate-700/60 lg:pr-6">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              Real Savings.<br />Real Impact.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Here's what organizations achieve with CloudOptimizer.
            </p>
          </div>

          {/* Right 4 Stats */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
            
            {/* Stat 1 */}
            <div className="space-y-1 sm:pl-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                30–45%
              </div>
              <div className="text-xs text-slate-400">
                Average cost reduction
              </div>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1 sm:border-l border-slate-700/60 sm:pl-6">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                70%
              </div>
              <div className="text-xs text-slate-400">
                Less time on cost analysis
              </div>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1 sm:border-l border-slate-700/60 sm:pl-6">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                2×
              </div>
              <div className="text-xs text-slate-400">
                Higher resource efficiency
              </div>
            </div>

            {/* Stat 4 */}
            <div className="space-y-1 sm:border-l border-slate-700/60 sm:pl-6">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                100%
              </div>
              <div className="text-xs text-slate-400">
                Secure & read-only access
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
