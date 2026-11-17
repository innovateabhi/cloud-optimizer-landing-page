import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  CheckCircle2, 
  DollarSign, 
  Zap,
  TrendingDown
} from 'lucide-react';

export const SolutionSection: React.FC = () => {
  const benefits = [
    'AI-driven cost and usage analysis',
    'Actionable optimization recommendations',
    'Automated, human-approved execution',
    'Multi-cloud support (AWS, Azure, GCP)',
  ];

  return (
    <section className="py-24 bg-white border-b border-border relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: 3D-style Floating Illustration matching uploaded picture */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-premium">
              
              {/* Floating AI Recommendation Badge */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm max-w-xs mb-6 space-y-1 relative z-20"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB]">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>AI Recommendation</span>
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  Right-size 3 EC2 instances
                </div>
              </motion.div>

              {/* Rising 3D-Style Chart Bars & Cloud Graphics */}
              <div className="relative h-44 flex items-end justify-center gap-3.5 pb-2">
                
                {/* Cloud Glow in background */}
                <div className="absolute inset-x-8 bottom-0 h-28 bg-gradient-to-t from-blue-100/40 to-slate-100/20 rounded-full blur-xl pointer-events-none" />

                {/* Bars */}
                <div className="w-8 sm:w-10 h-16 rounded-t-xl bg-gradient-to-t from-slate-200 to-blue-300 relative z-10" />
                <div className="w-8 sm:w-10 h-24 rounded-t-xl bg-gradient-to-t from-blue-300 to-blue-400 relative z-10" />
                <div className="w-8 sm:w-10 h-32 rounded-t-xl bg-gradient-to-t from-blue-400 to-[#2563EB] relative z-10" />
                <div className="w-8 sm:w-10 h-40 rounded-t-xl bg-gradient-to-t from-[#2563EB] to-indigo-600 relative z-10" />

                {/* Floating Estimated Savings Pill Badge */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute right-0 bottom-4 bg-[#ECFDF5] border border-emerald-300 rounded-2xl p-3.5 shadow-md flex items-center gap-3 z-30"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    $
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Estimated Savings
                    </div>
                    <div className="text-base font-extrabold font-display text-emerald-900">
                      $1,240 <span className="text-xs font-medium text-emerald-700">/ month</span>
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

          {/* Right Column: Editorial Pitch matching uploaded image */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold uppercase tracking-wider border border-blue-200 cursor-default">
              THE SOLUTION
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              A Smarter Way to Optimize Your Cloud Infrastructure.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              CloudOptimizer combines AI, real-time analytics, and automation to help you reduce costs, improve efficiency, and maximize cloud value.
            </p>

            {/* Green Checkmarks List */}
            <div className="space-y-3.5 pt-2">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ECFDF5] border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
