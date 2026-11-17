import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (currentScroll > 180) {
        setVisible(true);
        if (totalScroll > 0) {
          const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
          setScrollProgress(progress);
        }
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circular progress calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-7 right-7 z-50 flex items-center justify-center cursor-pointer select-none"
          onClick={scrollToTop}
          title="Scroll back to top"
        >
          {/* Circular Scroll Progress Wrapper similar to RestoraPOS */}
          <div className="relative w-12 h-12 flex items-center justify-center group">
            
            {/* SVG Ring */}
            <svg className="w-12 h-12 transform -rotate-90 pointer-events-none" viewBox="0 0 48 48">
              {/* Background Track Circle */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                stroke="#E2E8F0"
                strokeWidth="3.5"
                fill="#FFFFFF"
                className="transition-colors group-hover:stroke-slate-300"
              />
              {/* Dynamic Scroll Progress Circle */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                stroke="#2563EB"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-150 ease-out"
              />
            </svg>

            {/* Inner Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-700 group-hover:text-[#2563EB] transition-colors">
              <ArrowUp className="w-4 h-4 stroke-[2.5] transform group-hover:-translate-y-0.5 transition-transform duration-200" />
            </div>

            {/* Subtle Drop Shadow */}
            <div className="absolute inset-0 rounded-full shadow-lg group-hover:shadow-xl transition-shadow pointer-events-none" />

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
