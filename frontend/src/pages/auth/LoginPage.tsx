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
  Loader2,
  Sparkles,
  Zap,
  Layers,
  Sprout,
  Building2,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid work email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2FA / OTP State
  const [requires2Fa, setRequires2Fa] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'priya@technova.com',
      password: '••••••••••••',
      rememberMe: true,
    },
  });

  const currentEmail = watch('email');
  const currentPassword = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);

    // If already waiting for 2FA OTP
    if (requires2Fa) {
      if (!otpCode || otpCode.length < 6) {
        setErrorMsg('Please enter the 6-digit OTP verification code.');
        return;
      }
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          otpCode: requires2Fa ? otpCode : undefined,
        }),
      });

      const result = await res.json();

      if (result.status === '2fa_required') {
        setRequires2Fa(true);
        setTestOtpNotice(`Two-factor code dispatched to ${result.email || data.email}. Demo Code: ${result.testOtp || '123456'}`);
        return;
      }

      if (result.status === 'success') {
        localStorage.setItem('cloud_optimizer_token', result.token);
        localStorage.setItem('cloud_optimizer_user', JSON.stringify(result.user));
        localStorage.setItem('cloud_optimizer_tenant', result.tenant.name);
        localStorage.setItem('cloud_optimizer_plan', result.tenant.plan);
        localStorage.setItem('cloud_optimizer_tenant_id', String(result.tenant.id));

        if (result.user.role === 'admin') {
          navigate('/admin');
          return;
        }

        if (result.tenant.setupCompleted === false) {
          navigate(`/setup-wizard?plan=${result.tenant.plan}&tenant=${encodeURIComponent(result.tenant.name)}`);
          return;
        }

        navigate(`/dashboard?plan=${result.tenant.plan}&tenant=${encodeURIComponent(result.tenant.name)}&tenant_id=${result.tenant.id}`);
        return;
      }

      setErrorMsg(result.message || 'Authentication failed. Please verify credentials.');

    } catch (err: any) {
      // Local fallback in case backend is offline
      if (data.email.toLowerCase().includes('admin')) {
        navigate('/admin');
        return;
      }
      navigate('/dashboard?plan=starter');
    }
  };

  const quickDemoLogin = (role: 'free' | 'starter' | 'business' | 'admin') => {
    if (role === 'admin') {
      setValue('email', 'admin@cloudoptimizer.io');
      setValue('password', '••••••••••••');
      localStorage.setItem('cloud_optimizer_plan', 'enterprise');
      localStorage.setItem('cloud_optimizer_tenant', 'Cloud Optimizer FinOps Technologies');
      localStorage.setItem('cloud_optimizer_tenant_id', '4');
      navigate('/admin');
      return;
    }

    const tenantMap = {
      free: { name: 'Acme Cloud Labs', id: 1, email: 'rahul@acmelabs.io' },
      starter: { name: 'TechNova Solutions', id: 2, email: 'priya@technova.com' },
      business: { name: 'GlobalScale Logistics', id: 3, email: 'vikram@globalscale.com' },
    };

    const target = tenantMap[role];
    setValue('email', target.email);
    setValue('password', '••••••••••••');
    localStorage.setItem('cloud_optimizer_plan', role);
    localStorage.setItem('cloud_optimizer_tenant', target.name);
    localStorage.setItem('cloud_optimizer_tenant_id', String(target.id));
    navigate(`/dashboard?plan=${role}&tenant=${encodeURIComponent(target.name)}&tenant_id=${target.id}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Column: Product Branding */}
      <div className="lg:w-1/2 bg-surface-blue/60 border-r border-border p-8 lg:p-14 flex flex-col justify-between">
        <div>
          <Link to="/" className="inline-block cursor-pointer">
            <CloudOptimizerLogo size="md" />
          </Link>

          <div className="mt-10 max-w-lg space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-xs font-semibold text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent FinOps Telemetry</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight leading-snug">
              Continuous Cloud Intelligence for Modern Infrastructure
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Log in to access your organization's cloud cost telemetry, pending multi-agent rightsizing recommendations, and realized savings ledger.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                <span>Zero root credentials required — AWS STS AssumeRole verified</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                <span>Tenant data isolation across Free, Starter & Business tiers</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                <span>Platform Owner Admin console with real-time UPI transaction ledger</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
          <span>Enterprise Cloud Cost Management</span>
          <Link to="/security" className="hover:text-primary-blue transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Architecture</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Authentication Form + 1-Click Demo Personas */}
      <div className="lg:w-1/2 p-8 lg:p-14 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Enter your corporate credentials or use 1-click test personas below.
            </p>
          </div>

          {/* Quick 1-Click Role Switcher for instant evaluation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ⚡ 1-Click Demo Personas:
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Click to launch</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('free')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100/80 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sprout className="w-3.5 h-3.5 text-slate-500" />
                  <span>Free User</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Acme Cloud Labs (5 Res)</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('starter')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                  <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Starter User</span>
                </div>
                <div className="text-[10px] text-blue-700 mt-0.5">TechNova (Real AWS)</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('business')}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                  <Layers className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Business User</span>
                </div>
                <div className="text-[10px] text-indigo-600 mt-0.5">GlobalScale (Multi-Region)</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Platform Admin</span>
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Owner (/admin Console)</div>
              </button>
            </div>
          </div>

          {testOtpNotice && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium">
              {testOtpNotice}
            </div>
          )}

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

            {/* 2FA / Email OTP Input when 2FA triggered */}
            {requires2Fa && (
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-primary-blue" />
                    <span>Enter 6-Digit Verification Code (OTP) *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpCode('123456')}
                    className="text-[10px] text-primary-blue font-bold hover:underline"
                  >
                    Use Test Code (123456)
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full tracking-[0.25em] font-mono font-bold text-center px-3.5 py-2 rounded-xl border border-primary-blue bg-white text-sm focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-border text-primary-blue focus:ring-primary-blue"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : requires2Fa ? (
                <>
                  <span>Verify OTP & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
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
