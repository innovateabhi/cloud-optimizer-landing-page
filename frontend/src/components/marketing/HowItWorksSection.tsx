import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link2, 
  Search, 
  Sparkles, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: '1. Connect',
      desc: 'Securely connect your cloud account (AWS, Azure, GCP)',
      icon: Link2,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      num: '2',
      title: '2. Analyze',
      desc: 'We scan your resources, usage, and spending patterns',
      icon: Search,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      num: '3',
      title: '3. Recommend',
      desc: 'Get AI-powered, prioritized actions to reduce costs',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      num: '4',
      title: '4. Optimize',
      desc: 'Review and apply changes with full control',
      icon: Zap,
      color: 'bg-violet-50 text-violet-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-border relative">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold uppercase tracking-wider border border-blue-200 cursor-default">
            HOW IT WORKS
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            From Connection to Savings in 4 Simple Steps.
          </h2>
        </div>

        {/* 4 Steps Row with Connecting Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group"
              >
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>

                {/* Arrow to Next Step on Desktop */}
                {idx < 3 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
