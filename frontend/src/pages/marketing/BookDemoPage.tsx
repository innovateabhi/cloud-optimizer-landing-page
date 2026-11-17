import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import type { DemoRequestData } from '../../types';

const demoSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  workEmail: z.string().email('Please enter a valid work email address'),
  companyName: z.string().min(2, 'Please enter your organization or company name'),
  jobRole: z.string().min(2, 'Please select or enter your job role'),
  monthlyCloudSpend: z.string().min(1, 'Please select your approximate cloud spend'),
  awsAccountCount: z.number().min(1, 'At least 1 AWS account required').max(500, 'Max 500 accounts'),
  companySize: z.string().min(1, 'Please select your company size'),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, 'You must agree to continue'),
});

type DemoFormData = z.infer<typeof demoSchema>;

export const BookDemoPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      awsAccountCount: 1,
      consent: false,
    },
  });

  const onSubmit = async (data: DemoFormData) => {
    try {
      const res = await leadService.submitDemoRequest(data as DemoRequestData);
      if (res.success) {
        setSubmittedId(res.id);
        setIsSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        reset();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
            
            {/* Left Column: Context & Benefits */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-blue text-primary-blue text-xs font-semibold border border-primary-blue/20">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>30-Minute Architecture Session</span>
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight leading-tight">
                  Book a Personalized{' '}
                  <span className="text-primary-blue">Product Demo</span>
                </h1>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  Join our principal cloud solutions architects for a live walk-through tailored to your AWS infrastructure footprint and savings targets.
                </p>
              </div>

              {/* What to Expect */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                  What we cover during the demo:
                </span>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-success-green flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary">Read-Only IAM Setup Walkthrough</div>
                    <div className="text-[11px] text-text-secondary">How our STS cross-account assume-role works with zero root keys.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-success-green flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary">Multi-Agent Waste Detection</div>
                    <div className="text-[11px] text-text-secondary">Inspect live heuristics for Graviton3 right-sizing and orphaned volumes.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-success-green flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary">Human-in-the-Loop Governance</div>
                    <div className="text-[11px] text-text-secondary">How your DevOps team retains 100% authorization control over executions.</div>
                  </div>
                </div>
              </div>

              {/* Security Pill */}
              <div className="p-4 rounded-2xl bg-white border border-border text-xs text-text-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                  <ShieldCheck className="w-4 h-4 text-primary-blue" />
                  <span>Confidentiality Guaranteed</span>
                </div>
                <p className="text-[11px]">
                  All architectural details and spend estimates shared are handled under strict enterprise confidentiality.
                </p>
              </div>

            </div>

            {/* Right Column: Book Demo Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-border shadow-premium p-6 sm:p-10">
              
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-success-green flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-text-primary">
                    Demo Request Received!
                  </h3>
                  <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                    Thank you. We have logged your request under reference ticket <strong className="font-mono text-text-primary">{submittedId}</strong>. A FinOps solutions specialist will reach out within 4 business hours to confirm your calendar invitation.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl border border-border text-xs font-semibold text-text-primary hover:bg-surface-blue transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h3 className="font-display font-bold text-xl text-text-primary pb-2 border-b border-border">
                    Schedule Your Session
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-text-primary block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Sarah Jenkins"
                        {...register('fullName')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                          errors.fullName ? 'border-danger bg-rose-50/30' : 'border-border'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-danger mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary block mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        placeholder="sarah@company.com"
                        {...register('workEmail')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                          errors.workEmail ? 'border-danger bg-rose-50/30' : 'border-border'
                        }`}
                      />
                      {errors.workEmail && (
                        <p className="text-[11px] text-danger mt-1">{errors.workEmail.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-text-primary block mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Acme Global Inc."
                        {...register('companyName')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                          errors.companyName ? 'border-danger bg-rose-50/30' : 'border-border'
                        }`}
                      />
                      {errors.companyName && (
                        <p className="text-[11px] text-danger mt-1">{errors.companyName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary block mb-1">
                        Job Role *
                      </label>
                      <select
                        {...register('jobRole')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue bg-white ${
                          errors.jobRole ? 'border-danger bg-rose-50/30' : 'border-border'
                        }`}
                      >
                        <option value="">Select your role</option>
                        <option value="CTO / VP Engineering">CTO / VP Engineering</option>
                        <option value="DevOps / Platform Lead">DevOps / Platform Lead</option>
                        <option value="FinOps Specialist">FinOps Specialist</option>
                        <option value="Cloud Architect">Cloud Architect</option>
                        <option value="Finance / Procurement Director">Finance / Procurement Director</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.jobRole && (
                        <p className="text-[11px] text-danger mt-1">{errors.jobRole.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-text-primary block mb-1">
                        Monthly Cloud Spend *
                      </label>
                      <select
                        {...register('monthlyCloudSpend')}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue bg-white ${
                          errors.monthlyCloudSpend ? 'border-danger bg-rose-50/30' : 'border-border'
                        }`}
                      >
                        <option value="">Select spend tier</option>
                        <option value="Under $5,000 / month">Under $5,000 / month (&lt; ₹4 Lakhs)</option>
                        <option value="$5,000 - $25,000 / month">$5,000 - $25,000 / month (₹4L - ₹20L)</option>
                        <option value="$25,000 - $100,000 / month">$25,000 - $100,000 / month (₹20L - ₹80L)</option>
                        <option value="Over $100,000 / month">Over $100,000 / month (&gt; ₹80 Lakhs)</option>
                      </select>
                      {errors.monthlyCloudSpend && (
                        <p className="text-[11px] text-danger mt-1">{errors.monthlyCloudSpend.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary block mb-1">
                        AWS Accounts *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        {...register('awsAccountCount', { valueAsNumber: true })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                          errors.awsAccountCount ? 'border-danger bg-rose-50/30' : 'border-border'
                        }`}
                      />
                      {errors.awsAccountCount && (
                        <p className="text-[11px] text-danger mt-1">{errors.awsAccountCount.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-primary block mb-1">
                      Company Size *
                    </label>
                    <select
                      {...register('companySize')}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue bg-white ${
                        errors.companySize ? 'border-danger bg-rose-50/30' : 'border-border'
                      }`}
                    >
                      <option value="">Select team size</option>
                      <option value="1-20 employees">1-20 employees</option>
                      <option value="21-100 employees">21-100 employees</option>
                      <option value="101-500 employees">101-500 employees</option>
                      <option value="500+ employees">500+ employees</option>
                    </select>
                    {errors.companySize && (
                      <p className="text-[11px] text-danger mt-1">{errors.companySize.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-primary block mb-1">
                      Specific Infrastructure Questions or Goals (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., We have 14 Kubernetes clusters on EKS and want to evaluate spot/Graviton rightsizing..."
                      {...register('message')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs focus:outline-none focus:border-primary-blue"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2 text-xs text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('consent')}
                        className="mt-0.5 rounded border-border text-primary-blue focus:ring-primary-blue"
                      />
                      <span>
                        I agree to receive a confirmation calendar invite and product correspondence from Cloud Optimizer. You can unsubscribe at any time.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-[11px] text-danger mt-1">{errors.consent.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3.5 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Demonstration Slot...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Demo Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
