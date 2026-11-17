import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sprout, 
  Zap, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Building2,
  Users,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Sprout,
      iconColor: 'bg-slate-100 text-slate-700',
      tagline: 'Basic monitoring for individuals exploring cloud cost visibility.',
      priceUSD: 0,
      priceINR: 0,
      period: '/month',
      isPopular: false,
      cloudAccounts: '1 Account',
      regions: '2 Regions',
      resources: '5 Resources',
      features: [
        '1 Cloud Account (AWS/Azure/GCP)',
        '2 Active Cloud Regions',
        'Up to 5 Monitored Resources',
        'Basic monitoring & waste discovery',
        'Standard report generation',
        'Community support (No email support)',
      ],
      ctaText: 'Get Started Free',
      ctaLink: '/register?plan=free',
      btnStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 cursor-pointer',
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      iconColor: 'bg-blue-50 text-[#2563EB]',
      tagline: 'Intelligent AI recommendations for growing infrastructure teams.',
      priceUSD: billingCycle === 'annual' ? 24 : 29,
      priceINR: billingCycle === 'annual' ? 1599 : 1999,
      period: '/month',
      isPopular: false,
      cloudAccounts: '3 Accounts',
      regions: '5 Regions',
      resources: '50 Resources',
      features: [
        'Up to 3 Cloud Accounts',
        '5 Active Cloud Regions',
        'Up to 50 Monitored Resources',
        'Automated AI rightsizing recommendations',
        'Unattached volume & idle disk alerts',
        'Weekly cost digest reports',
        'Standard email support (24h response)',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaLink: '/register?plan=starter',
      btnStyle: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer',
    },
    {
      id: 'business',
      name: 'Business',
      icon: Layers,
      iconColor: 'bg-blue-100 text-[#2563EB]',
      tagline: 'Advanced optimization & governance for production systems.',
      priceUSD: billingCycle === 'annual' ? 64 : 79,
      priceINR: billingCycle === 'annual' ? 4799 : 5999,
      period: '/month',
      isPopular: true,
      cloudAccounts: '10+ Accounts',
      regions: 'All Regions',
      resources: '500 Resources',
      features: [
        '10+ Multi-Cloud Accounts',
        'All Global Regions Supported',
        'Up to 500 Monitored Resources',
        'Advanced multi-agent AI optimization',
        'Human-in-the-loop approval workflows',
        'Cost forecasting & anomaly spike detection',
        'Verified ROI & executive reports',
        'Priority email & ticket support (4h SLA)',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaLink: '/register?plan=business',
      btnStyle: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md cursor-pointer',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: ShieldCheck,
      iconColor: 'bg-purple-50 text-purple-700',
      tagline: 'Maximum security, custom governance, and enterprise scale.',
      priceUSD: 'Custom',
      priceINR: 'Custom',
      period: '',
      isPopular: false,
      cloudAccounts: 'Custom',
      regions: 'All Regions',
      resources: 'Custom (500+)',
      features: [
        'Custom / Unlimited Cloud Accounts',
        'All Global Regions Supported',
        '500+ Monitored Resources',
        'Single Sign-On (SAML / Okta / Azure AD)',
        'Granular Role-Based Access Control (RBAC)',
        'Custom automation policies & rules',
        '99.9% Uptime SLA guarantees',
        'Dedicated Technical Account Manager',
      ],
      ctaText: 'Contact Enterprise Sales',
      ctaLink: '/contact?plan=enterprise',
      btnStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 cursor-pointer',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#FAFBFD] border-b border-border relative overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold uppercase tracking-wider border border-blue-200 cursor-default">
              <span>TRANSPARENT PRICING</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Simple, Predictable Plans for Every Stage
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Start free with basic monitoring, then scale up as your cloud infrastructure expands. All features unlock instantly upon subscription.
            </p>
          </div>

          {/* Controls: Currency (INR / USD) & Billing Cycle (Monthly / Annual) */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            
            {/* Currency Switcher */}
            <div className="inline-flex items-center p-1 bg-white rounded-full border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currency === 'INR'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                INR (₹)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Billing Toggle (Monthly / Annual with 20% discount) */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200/80">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold">
                  Save 20%
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* User Lifecycle Flow (From Spec Image) */}
        <div className="mb-12 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-x-auto text-[11px] font-semibold text-slate-500 flex items-center gap-2 whitespace-nowrap">
          <span className="text-[#2563EB] font-bold">Onboarding Flow:</span>
          <span>Explore Features</span>
          <span className="text-slate-300">→</span>
          <span>View Pricing</span>
          <span className="text-slate-300">→</span>
          <span>Register</span>
          <span className="text-slate-300">→</span>
          <span>Select Plan</span>
          <span className="text-slate-300">→</span>
          <span className="text-slate-800 font-bold">Activate Subscription</span>
          <span className="text-slate-300">→</span>
          <span className="text-emerald-600 font-bold">Configure Cloud IAM</span>
          <span className="text-slate-300">→</span>
          <span className="text-[#2563EB] font-bold">Launch Dashboard</span>
        </div>

        {/* 4 Plans Grid matching uploaded image table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-10">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = currency === 'INR' ? plan.priceINR : plan.priceUSD;
            const isCustom = typeof price === 'string';
            const formattedPrice = isCustom 
              ? price 
              : currency === 'INR' 
              ? `₹${Number(price).toLocaleString('en-IN')}` 
              : `$${price}`;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  plan.isPopular
                    ? 'bg-white border-2 border-[#2563EB] shadow-xl -translate-y-1'
                    : 'bg-white border border-slate-200 shadow-2xs hover:shadow-md'
                }`}
              >
                {/* Most Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm cursor-default">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Icon & Plan Name */}
                  <div className={`w-11 h-11 rounded-2xl ${plan.iconColor} flex items-center justify-center mb-4 cursor-default`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900">
                    {plan.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 min-h-[34px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-5 mb-5 pb-5 border-b border-slate-100 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
                      {formattedPrice}
                    </span>
                    {plan.period && (
                      <span className="text-xs font-semibold text-slate-400">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* Entitlements Badges (From Spec Table) */}
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-center text-[10px] mb-5">
                    <div>
                      <div className="text-slate-400">Accounts</div>
                      <div className="font-bold text-slate-800 truncate">{plan.cloudAccounts}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Regions</div>
                      <div className="font-bold text-slate-800 truncate">{plan.regions}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Resources</div>
                      <div className="font-bold text-slate-800 truncate">{plan.resources}</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-7">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Includes:</div>
                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={plan.ctaLink}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all duration-200 flex items-center justify-center gap-2 ${plan.btnStyle}`}
                >
                  <span>{plan.ctaText}</span>
                  {plan.isPopular && <ArrowRight className="w-4 h-4" />}
                </Link>

              </div>
            );
          })}
        </div>

        {/* MSP & Partner Special Card (From Image Spec) */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MSP & PARTNER PROGRAM
              </span>
              <span className="text-xs text-slate-400 font-mono">Phase 2 / Preview</span>
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Manage Multiple Customer Cloud Accounts Under One Unified Console
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed for Cloud Consultancies, Managed Service Providers, and DevOps Agencies. 
              Features multi-tenant client partitions, white-label executive reporting, and reseller margin analytics.
            </p>
          </div>

          <Link
            to="/contact?inquiry=msp-partner"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>Inquire for Partner Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
