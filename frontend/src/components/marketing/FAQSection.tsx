import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        'CloudOptimizer helped us cut our AWS costs by 38% in just two months. The AI recommendations are practical, and the automation saves us hours every week.',
      name: 'Rohit Mehra',
      role: 'Cloud Infrastructure Lead @ FinTech Scaleup',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    },
    {
      quote:
        'The human-in-the-loop approval gave our security team complete confidence. We identified $4,200/month in orphaned EBS disks on day one.',
      name: 'Ananya Deshmukh',
      role: 'DevOps & Platform Director @ SaaS Enterprise',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
    },
    {
      quote:
        'Managing 40+ AWS accounts across 6 regions was becoming impossible to audit manually. CloudOptimizer rightsizing and Graviton suggestions cut our monthly bill by $18,400.',
      name: 'Marcus Vance',
      role: 'VP of Engineering @ Global Logistics Cloud',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    },
    {
      quote:
        'The zero-trust cross-account IAM role took 3 minutes to set up. Zero access to patient database payloads, 100% read-only, and immediate ROI praised by our CFO.',
      name: 'Priya Sundaram',
      role: 'Head of FinOps @ HealthTech Unicorn',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
    },
    {
      quote:
        'The scheduled shutdown policies for non-prod staging clusters alone paid for our subscription 15x over. The report generator makes monthly budget reviews effortless.',
      name: 'David Lindqvist',
      role: 'Lead SRE & Platform Architect @ MediaStream',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    },
  ];

  const faqs = [
    {
      question: 'How does CloudOptimizer connect to my cloud account?',
      answer:
        'CloudOptimizer connects using secure, read-only IAM cross-account roles via AWS STS AssumeRole and Azure Service Principals. We never store permanent access keys or root passwords.',
    },
    {
      question: 'Is it safe to give access to my cloud environment?',
      answer:
        'Yes. All discovery runs in strictly read-only mode by default. Infrastructure changes require explicit human approval and can be validated in dry-run simulation mode before execution.',
    },
    {
      question: 'Which cloud providers are supported?',
      answer:
        'We provide native production support for Amazon Web Services (AWS), with Microsoft Azure and Google Cloud Platform (GCP) active for multi-cloud enterprise workloads.',
    },
    {
      question: 'Can I try it before subscribing?',
      answer:
        'Yes! You can get started completely free on our Starter Plan or test drive our Growth Plan with a 14-day free trial. No credit card is required to begin.',
    },
  ];

  return (
    <section id="faqs" className="py-24 bg-white border-b border-border relative">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Testimonial Card matching uploaded image */}
          <div className="lg:col-span-5 bg-[#FAFBFD] rounded-3xl border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Quote className="w-5 h-5 fill-[#2563EB]" />
              </div>

              <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-200 overflow-hidden border border-purple-300">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-slate-900">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {testimonials[activeTestimonial].role}
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider Arrows & Indicator Dots */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-1">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTestimonial(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeTestimonial === idx
                          ? 'w-4 bg-[#2563EB]'
                          : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Go to review ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTestimonial((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                  }
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: FAQs Accordion matching uploaded image */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold uppercase tracking-wider border border-blue-200 cursor-default">
                FAQS
              </div>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <Link to="/contact" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = openId === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <span className="font-display font-bold text-sm text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#5B45F6]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
