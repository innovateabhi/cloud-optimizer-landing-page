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
  Loader2,
  Sparkles,
  QrCode,
  Zap,
  Layers,
  Sprout,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';
import { MockUpiPaymentModal, PaymentSuccessData } from '../../components/payment/MockUpiPaymentModal';

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

  // SBI Mock UPI Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<RegisterFormData | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      workEmail: '',
      organizationName: '',
      password: '',
      plan: initialPlan,
      agreeTerms: true,
    },
  });

  const selectedPlan = watch('plan');

  useEffect(() => {
    const p = searchParams.get('plan');
    if (p && ['free', 'starter', 'business'].includes(p)) {
      setValue('plan', p);
    }
  }, [searchParams, setValue]);

  const handlePreFill = (plan: 'free' | 'starter' | 'business') => {
    setValue('plan', plan);
    if (plan === 'free') {
      setValue('fullName', 'Rahul Sharma');
      setValue('workEmail', 'rahul@acmelabs.io');
      setValue('organizationName', 'Acme Cloud Labs');
      setValue('password', 'AcmeLabs@2026');
    } else if (plan === 'starter') {
      setValue('fullName', 'Priya Patel');
      setValue('workEmail', 'priya@technova.com');
      setValue('organizationName', 'TechNova Solutions');
      setValue('password', 'TechNova@2026');
    } else {
      setValue('fullName', 'Vikram Malhotra');
      setValue('workEmail', 'vikram@globalscale.com');
      setValue('organizationName', 'GlobalScale Logistics');
      setValue('password', 'GlobalScale@2026');
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    // If Free plan: no payment required, immediate registration & proceed to setup wizard
    if (data.plan === 'free') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        if (!res.ok && result.status === 'error') {
          setServerError(result.message || 'Registration failed. Please try a different email or log in.');
          return;
        }

        const userObj = result.user || {
          id: 1,
          email: data.workEmail,
          fullName: data.fullName,
          role: 'user',
          twoFactorEnabled: false
        };

        const token = result.token || `co_free_token_${Date.now()}`;
        const tenantId = String(result.tenant?.id || '1');
        const tenantName = result.tenant?.name || data.organizationName;

        localStorage.setItem('cloud_optimizer_token', token);
        localStorage.setItem('cloud_optimizer_user', JSON.stringify(userObj));
        localStorage.setItem('cloud_optimizer_plan', 'free');
        localStorage.setItem('cloud_optimizer_tenant', tenantName);
        localStorage.setItem('cloud_optimizer_tenant_id', tenantId);

        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        navigate(`/setup-wizard?plan=free&tenant=${encodeURIComponent(tenantName)}&tenant_id=${tenantId}`);
        return;
      } catch (err: any) {
        console.warn('Register fallback:', err);
        // Fallback for offline mode so user is never blocked
        const fallbackUser = {
          id: 1,
          email: data.workEmail,
          fullName: data.fullName,
          role: 'user',
          twoFactorEnabled: false
        };
        const token = `co_offline_free_${Date.now()}`;
        localStorage.setItem('cloud_optimizer_token', token);
        localStorage.setItem('cloud_optimizer_user', JSON.stringify(fallbackUser));
        localStorage.setItem('cloud_optimizer_plan', 'free');
        localStorage.setItem('cloud_optimizer_tenant', data.organizationName);
        localStorage.setItem('cloud_optimizer_tenant_id', '1');
        navigate(`/setup-wizard?plan=free&tenant=${encodeURIComponent(data.organizationName)}&tenant_id=1`);
        return;
      }
    }

    // For Starter & Business plans: open the Mock SBI UPI QR Payment Modal
    setPendingRegistration(data);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (payment: PaymentSuccessData) => {
    setShowPaymentModal(false);
    if (pendingRegistration) {
      let result: any = null;
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pendingRegistration),
        });
        result = await res.json();
      } catch (err) {
        console.warn('Register fallback:', err);
      }

      const userObj = result?.user || {
        id: Date.now(),
        email: pendingRegistration.workEmail,
        fullName: pendingRegistration.fullName,
        role: 'user',
        twoFactorEnabled: false
      };

      const token = result?.token || `co_paid_token_${Date.now()}`;
      const tenantId = String(result?.tenant?.id || (pendingRegistration.plan === 'business' ? '3' : '2'));
      const tenantName = result?.tenant?.name || pendingRegistration.organizationName;

      localStorage.setItem('cloud_optimizer_token', token);
      localStorage.setItem('cloud_optimizer_user', JSON.stringify(userObj));
      localStorage.setItem('cloud_optimizer_plan', pendingRegistration.plan);
      localStorage.setItem('cloud_optimizer_tenant', tenantName);
      localStorage.setItem('cloud_optimizer_tenant_id', tenantId);

      confetti({ particleCount: 100, spread: 75, origin: { y: 0.6 } });
      // Directs to Cloud IAM Setup Wizard post payment
      navigate(`/setup-wizard?plan=${pendingRegistration.plan}&tenant=${encodeURIComponent(tenantName)}&tenant_id=${tenantId}&paid=true`);
    } else {
      navigate(`/setup-wizard?plan=${payment.planId}&paid=true`);
    }
  };

  const planOptions = [
    {
      id: 'free',
      name: 'Free Tier',
      price: '₹0',
      period: 'Forever free',
      desc: '1 Account · 1 Region · 5 Resources',
      icon: Sprout,
      badge: 'Basic Monitoring',
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '₹1,999',
      period: '/month',
      desc: '3 Accounts · 3 Regions · 50 Resources',
      icon: Zap,
      badge: 'AI Rightsizing',
    },
    {
      id: 'business',
      name: 'Business',
      price: '₹5,999',
      period: '/month',
      desc: '10+ Accounts · All Regions · 500 Resources',
      icon: Layers,
      badge: 'Auto-Fix & Approvals',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Column: Benefits & Trust */}
      <div className="lg:w-1/2 bg-surface-blue/60 border-r border-border p-8 lg:p-14 flex flex-col justify-between">
        <div>
          <Link to="/" className="inline-block cursor-pointer">
            <CloudOptimizerLogo size="md" />
          </Link>

          <div className="mt-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-xs font-semibold text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tenant Enterprise FinOps</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight leading-snug">
              Start Cutting AWS Waste in Under 5 Minutes
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Create your organization account to unlock automated resource discovery, multi-agent AI rightsizing, and continuous savings tracking.
            </p>

            {/* Quick Persona Fill Buttons for Fast Testing */}
            <div className="pt-2 p-4 rounded-2xl bg-white/80 border border-blue-200/60 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Quick Fill Test Persona:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePreFill('free')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer transition-all shadow-2xs"
                >
                  🌱 Free Plan (Acme Labs)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreFill('starter')}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-xs font-semibold text-[#2563EB] cursor-pointer transition-all shadow-2xs"
                >
                  ⚡ Starter Plan (TechNova)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreFill('business')}
                  className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-xs font-semibold text-indigo-700 cursor-pointer transition-all shadow-2xs"
                >
                  🏢 Business Plan (GlobalScale)
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0 mt-0.5" />
                <span><strong>Instant Demo UPI Checkout:</strong> Safe SBI Bank QR code simulation with real-time UTR receipt.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0 mt-0.5" />
                <span><strong>AWS STS AssumeRole:</strong> Safe read-only discovery without storing secret keys or passwords.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success-green shrink-0 mt-0.5" />
                <span><strong>Plan-Enforced Dashboards:</strong> Dedicated quota meters, approvals, and AI capabilities matched to your tier.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/80 flex items-center justify-between text-xs text-text-secondary">
          <span>Enterprise Multi-Tenant SaaS</span>
          <Link to="/security" className="hover:text-primary-blue transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Architecture</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="lg:w-1/2 p-8 lg:p-14 flex items-center justify-center">
        <div className="w-full max-w-lg space-y-5">
          
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
              Create your organization
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Select your plan and set up your cloud optimization tenant.
            </p>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{serverError}</span>
              </div>
              {serverError.includes('already exists') && (
                <Link to="/login" className="font-bold underline text-rose-900 shrink-0 hover:text-rose-950">
                  Log In →
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Plan Selector Cards */}
            <div>
              <label className="text-xs font-bold text-text-primary block mb-2">
                1. Select Pricing Plan *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {planOptions.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setValue('plan', p.id)}
                      className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-primary-blue bg-blue-50/50 ring-2 ring-primary-blue/30 shadow-xs'
                          : 'border-border bg-white hover:bg-slate-50/80 text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-primary-blue' : 'text-slate-500'}`}>
                          {p.name}
                        </span>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-blue' : 'text-slate-400'}`} />
                      </div>
                      <div className="text-base font-extrabold text-slate-900 leading-none">
                        {p.price}
                        <span className="text-[10px] font-normal text-slate-500 ml-1">{p.period}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1.5 leading-tight font-medium">
                        {p.desc}
                      </p>
                      {isSelected && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-primary-blue bg-white px-1.5 py-0.5 rounded border border-blue-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Rahul Sharma"
                    {...register('fullName')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
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
                  <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="rahul@company.com"
                    {...register('workEmail')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                      errors.workEmail ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                {errors.workEmail && (
                  <p className="text-[11px] text-danger mt-1">{errors.workEmail.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-primary block mb-1">
                  Organization / Company Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="TechNova Solutions"
                    {...register('organizationName')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
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
                  <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    {...register('password')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                      errors.password ? 'border-danger' : 'border-border'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-danger mt-1">{errors.password.message}</p>
                )}
              </div>
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
              className="w-full py-3.5 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Registration...</span>
                </>
              ) : selectedPlan === 'free' ? (
                <>
                  <span>Create Free Account & Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>Proceed to SBI UPI QR Payment ({selectedPlan === 'starter' ? '₹1,999' : '₹5,999'}/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <span>Already have an account?</span>
            <Link to="/login" className="font-semibold text-primary-blue hover:underline">
              Log in with credentials →
            </Link>
          </div>

        </div>
      </div>

      {/* Mock SBI Bank UPI Payment Modal */}
      <MockUpiPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planId={selectedPlan === 'business' ? 'business' : 'starter'}
        planName={selectedPlan === 'business' ? 'Business Plan' : 'Starter Plan'}
        amountINR={selectedPlan === 'business' ? 5999 : 1999}
        companyName={watch('organizationName') || 'Cloud Optimizer Tenant'}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};
