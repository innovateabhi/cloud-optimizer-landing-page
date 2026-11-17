import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  Building2, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  workEmail: z.string().email('Please enter a valid business email address'),
  organizationName: z.string().min(2, 'Organization or company name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  plan: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, 'You must accept terms of service'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'starter';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      plan: initialPlan,
      agreeTerms: false,
    },
  });

  const selectedPlan = watch('plan');

  useEffect(() => {
    const p = searchParams.get('plan');
    if (p) setValue('plan', p);
  }, [searchParams, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    // Simulate server latency for tenant creation
    await new Promise((r) => setTimeout(r, 700));

    // Route to verification notice
    navigate(`/verify-email?email=${encodeURIComponent(data.workEmail)}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Column: Benefits & Trust */}
      <div className="lg:w-1/2 bg-surface-blue/60 border-r border-border p-8 lg:p-16 flex flex-col justify-between">
        <div>
          <Link to="/" className="inline-block cursor-pointer">
            <CloudOptimizerLogo size="md" />
          </Link>

          <div className="mt-14 max-w-lg space-y-6">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight leading-snug">
              Start Cutting AWS Waste in Under 5 Minutes
            </h1>
            <p className="text-base text-text-secondary leading-relaxed">
              Create your organization account to unlock automated resource discovery, AI rightsizing suggestions, and continuous savings tracking.
            </p>

            <div className="pt-4 space-y-3.5">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0 mt-0.5" />
                <span><strong>No Credit Card Required:</strong> Explore waste detection with zero upfront commitment.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0 mt-0.5" />
                <span><strong>AWS STS AssumeRole:</strong> Safe read-only discovery without storing secret keys or passwords.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0 mt-0.5" />
                <span><strong>Full 14-Day Starter Trial:</strong> Test AI rightsizing on up to 50 active resources.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
          <span>Enterprise Multi-Tenant SaaS</span>
          <Link to="/security" className="hover:text-primary-blue transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Architecture</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
              Create your organization
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
              Set up your workspace and select your cloud optimization plan.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Plan Selector Mini Bar */}
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Selected Plan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'free', label: 'Free (₹0)' },
                  { id: 'starter', label: 'Starter (₹1,999/mo)' },
                  { id: 'business', label: 'Business (₹5,999/mo)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setValue('plan', p.id)}
                    className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                      selectedPlan === p.id
                        ? 'border-primary-blue bg-surface-blue text-primary-blue shadow-xs'
                        : 'border-border bg-white text-text-secondary hover:bg-gray-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  {...register('fullName')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                    errors.fullName ? 'border-danger' : 'border-border'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-danger mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="rahul@company.com"
                  {...register('workEmail')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                    errors.workEmail ? 'border-danger' : 'border-border'
                  }`}
                />
              </div>
              {errors.workEmail && (
                <p className="text-[11px] text-danger mt-1">{errors.workEmail.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Organization / Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="TechNova Solutions"
                  {...register('organizationName')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                    errors.organizationName ? 'border-danger' : 'border-border'
                  }`}
                />
              </div>
              {errors.organizationName && (
                <p className="text-[11px] text-danger mt-1">{errors.organizationName.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Create Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  {...register('password')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                    errors.password ? 'border-danger' : 'border-border'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-danger mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="mt-0.5 rounded border-border text-primary-blue focus:ring-primary-blue"
                />
                <span>
                  I agree to Cloud Optimizer's <Link to="/terms-of-service" className="text-primary-blue underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary-blue underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-[11px] text-danger mt-1">{errors.agreeTerms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Organization...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-text-secondary">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-primary-blue hover:underline">
              Log in here →
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
