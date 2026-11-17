import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle2, 
  ShieldCheck,
  Loader2 
} from 'lucide-react';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid work email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    // Simulate auth check
    await new Promise((r) => setTimeout(r, 600));

    // Phase 1 client-side auth redirection / demo access
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Column: Product Branding & Testimonial-free Enterprise Visual */}
      <div className="lg:w-1/2 bg-surface-blue/60 border-r border-border p-8 lg:p-16 flex flex-col justify-between">
        <div>
          <Link to="/" className="inline-block cursor-pointer">
            <CloudOptimizerLogo size="md" />
          </Link>

          <div className="mt-16 max-w-lg space-y-6">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight leading-snug">
              Continuous Cloud Intelligence for Modern Infrastructure
            </h1>
            <p className="text-base text-text-secondary leading-relaxed">
              Log in to access your organization's cloud cost telemetry, pending AI rightsizing recommendations, and realized savings ledger.
            </p>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                <span>Zero root credentials required — AWS STS AssumeRole verified</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                <span>Multi-tenant data isolation and RBAC access policies</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                <span>Human-governed execution with full immutable audit trails</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
          <span>Enterprise Cloud Cost Management</span>
          <Link to="/security" className="hover:text-primary-blue transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Whitepaper</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
              Enter your corporate credentials to access your organization dashboard.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-danger font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                    errors.email ? 'border-danger' : 'border-border'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-danger mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-primary">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••••••"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-border text-primary-blue focus:ring-primary-blue"
                />
                <span>Remember this workstation for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-text-secondary">
            <span>Don't have an organization account yet? </span>
            <Link to="/register?plan=starter" className="font-semibold text-primary-blue hover:underline">
              Start Free Trial →
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
