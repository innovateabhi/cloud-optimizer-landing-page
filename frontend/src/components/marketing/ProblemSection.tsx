import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  TrendingUp, 
  Clock, 
  Target 
} from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: Layers,
      title: 'Unused Resources',
      description: "Paying for instances, storage, and services you don't use.",
    },
    {
      icon: TrendingUp,
      title: 'Uncontrolled Spend',
      description: 'Cloud costs increase without clear visibility.',
    },
    {
      icon: Clock,
      title: 'Manual Monitoring',
      description: 'Time-consuming and error-prone analysis.',
    },
    {
      icon: Target,
      title: 'Missed Opportunities',
      description: 'No proactive recommendations to save costs.',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-border relative">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold uppercase tracking-wider border border-blue-200 cursor-default">
            THE CHALLENGE
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Cloud Costs Grow Fast. We Help You Stay in Control.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Most organizations overpay for cloud due to unused resources, over-provisioning, and lack of real-time visibility. CloudOptimizer brings AI, automation, and actionable insights to fix it.
          </p>
        </div>

        {/* 4 Problem Cards Grid matching uploaded image */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50/80 flex items-center justify-center text-[#2563EB] mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                  {problem.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
