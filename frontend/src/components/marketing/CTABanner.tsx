import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

export const CTABanner: React.FC = () => {
  return (
    <section className="py-16 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 border border-slate-800">
          
          {/* Subtle Ambient Accent */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 max-w-xl space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight text-white">
              Ready to Cut Your Cloud Costs?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Start your free trial today and see how much you can save with AI-powered optimization.
            </p>
          </div>

          {/* Right CTAs */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            <Link
              to="/register?plan=starter"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span>Live Interactive Demo</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
