import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  TrendingDown, 
  CheckCircle2, 
  DollarSign, 
  Zap, 
  Building2, 
  FileText, 
  HelpCircle, 
  Compass, 
  Calendar,
  Play 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed left-0 top-0 z-[100] w-full transition-all duration-300">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================
            DESKTOP FLOATING PILL NAVBAR (SkillTwin inspired)
           ======================================================== */}
        <div 
          className={`relative hidden h-[64px] items-center justify-between rounded-full border transition-all duration-300 px-6 backdrop-blur-xl lg:flex ${
            isScrolled 
              ? 'lg:mt-3 border-slate-300/90 bg-white/95 shadow-[0_14px_35px_rgba(15,23,42,0.10)]' 
              : 'lg:mt-5 xl:mt-6 border-slate-200/80 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)]'
          }`}
        >
          {/* Subtle inner highlight border */}
          <div className="pointer-events-none absolute inset-0 rounded-full border border-white/60" />

          {/* BRAND LOGO with SkillTwin-style icon frame + subtitle */}
          <Link 
            to="/" 
            className="relative z-10 shrink-0 whitespace-nowrap transition-opacity duration-200 hover:opacity-90 cursor-pointer"
          >
            <div className="flex min-w-0 shrink-0 items-center gap-3">
              {/* Icon Frame */}
              <div className="relative flex shrink-0 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/[0.08] shadow-[0_0_25px_rgba(37,99,235,0.15)] h-10 w-10">
                <svg 
                  className="w-6 h-6 text-[#2563EB]" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M10 22C6.68629 22 4 19.3137 4 16C4 12.9863 6.22271 10.4907 9.15587 10.0667C9.69747 6.6436 12.656 4 16.2857 4C20.3703 4 23.7317 7.15857 24.0322 11.238C26.3142 11.8344 28 13.9189 28 16.4C28 19.4928 25.4928 22 22.4 22H10Z" 
                    fill="#2563EB" 
                    fillOpacity="0.14" 
                    stroke="#2563EB" 
                    strokeWidth="2" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M16 19V11M16 11L12.5 14.5M16 11L19.5 14.5" 
                    stroke="#2563EB" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>

              {/* Brand Typography */}
              <div className="min-w-0 leading-none">
                <div className="whitespace-nowrap font-display font-bold tracking-[-0.03em] text-[17px]">
                  <span className="text-slate-900">Cloud</span>
                  <span className="bg-gradient-to-r from-[#2563EB] via-indigo-600 to-[#1D4ED8] bg-clip-text text-transparent">Optimizer</span>
                </div>
                <div className="mt-1 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  FinOps Intelligence
                </div>
              </div>
            </div>
          </Link>

          {/* CENTER NAVIGATION LINKS (SkillTwin-style glowing underline animation) */}
          <nav className="relative z-10 flex items-center">
            
            {/* 1. PLATFORM DROPDOWN */}
            <div className="group relative mx-0.5">
              <button 
                type="button"
                className="group flex h-10 cursor-pointer items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 group-hover:text-slate-900"
              >
                <span className="relative inline-block">
                  Platform
                  <span className="pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-[width] duration-300 ease-out group-hover:w-full" />
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#2563EB]" />
              </button>

              {/* Mega-menu panel with top gradient accent */}
              <div className="invisible absolute left-1/2 top-[calc(100%+8px)] w-[440px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                <div className="absolute -top-3 left-0 right-0 h-3" />
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl p-2.5">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2563EB]/70 to-transparent mb-2" />
                  <div className="grid grid-cols-2 gap-1.5">
                    <Link to="/features#cost-intelligence" className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 group-hover/item:scale-105 transition-transform">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Cost Intelligence</div>
                        <div className="text-[11px] text-slate-500">Multi-cloud spend breakdown</div>
                      </div>
                    </Link>

                    <Link to="/features#resource-monitoring" className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 group-hover/item:scale-105 transition-transform">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Monitoring</div>
                        <div className="text-[11px] text-slate-500">Real-time resource metrics</div>
                      </div>
                    </Link>

                    <Link to="/features#ai-recommendations" className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 group-hover/item:scale-105 transition-transform">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">AI Recommendations</div>
                        <div className="text-[11px] text-slate-500">Right-sizing & waste detection</div>
                      </div>
                    </Link>

                    <Link to="/features#human-approvals" className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 group-hover/item:scale-105 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Governance</div>
                        <div className="text-[11px] text-slate-500">Human-approved actions</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SOLUTIONS DROPDOWN */}
            <div className="group relative mx-0.5">
              <button 
                type="button"
                className="group flex h-10 cursor-pointer items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 group-hover:text-slate-900"
              >
                <span className="relative inline-block">
                  Solutions
                  <span className="pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-[width] duration-300 ease-out group-hover:w-full" />
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#2563EB]" />
              </button>

              <div className="invisible absolute left-1/2 top-[calc(100%+8px)] w-[400px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                <div className="absolute -top-3 left-0 right-0 h-3" />
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl p-2.5">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2563EB]/70 to-transparent mb-2" />
                  <div className="grid grid-cols-2 gap-1.5">
                    <Link to="/features#for-startups" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <Zap className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Startups</div>
                        <div className="text-[10px] text-slate-500">Extend cloud runway</div>
                      </div>
                    </Link>
                    <Link to="/features#for-engineering" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <Cpu className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Engineering</div>
                        <div className="text-[10px] text-slate-500">Automate audits</div>
                      </div>
                    </Link>
                    <Link to="/features#for-finops" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <TrendingDown className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">FinOps</div>
                        <div className="text-[10px] text-slate-500">Forecast & ROI tracking</div>
                      </div>
                    </Link>
                    <Link to="/features#for-enterprises" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <Building2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Enterprises</div>
                        <div className="text-[10px] text-slate-500">RBAC & Governance</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. HOW IT WORKS / FEATURES */}
            <Link 
              to="/features" 
              className="group mx-0.5 px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 cursor-pointer"
            >
              <span className="relative inline-block">
                How It Works
                <span className="pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-[width] duration-300 ease-out group-hover:w-full" />
              </span>
            </Link>

            {/* 4. PRICING */}
            <Link 
              to="/pricing" 
              className="group mx-0.5 px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 cursor-pointer"
            >
              <span className="relative inline-block">
                Pricing
                <span className="pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-[width] duration-300 ease-out group-hover:w-full" />
              </span>
            </Link>

            {/* 5. RESOURCES DROPDOWN */}
            <div className="group relative mx-0.5">
              <button 
                type="button"
                className="group flex h-10 cursor-pointer items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 group-hover:text-slate-900"
              >
                <span className="relative inline-block">
                  Resources
                  <span className="pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-[width] duration-300 ease-out group-hover:w-full" />
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#2563EB]" />
              </button>

              <div className="invisible absolute left-1/2 top-[calc(100%+8px)] w-[320px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                <div className="absolute -top-3 left-0 right-0 h-3" />
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl p-2.5">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2563EB]/70 to-transparent mb-2" />
                  <div className="space-y-1">
                    <a href="/#faqs" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <HelpCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">Frequently Asked Questions</span>
                    </a>
                    <Link to="/security" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">Security Architecture</span>
                    </Link>
                    <Link to="/demo" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <Compass className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">Interactive Demo Sandbox</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. COMPANY DROPDOWN */}
            <div className="group relative mx-0.5">
              <button 
                type="button"
                className="group flex h-10 cursor-pointer items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 group-hover:text-slate-900"
              >
                <span className="relative inline-block">
                  Company
                  <span className="pointer-events-none absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-[width] duration-300 ease-out group-hover:w-full" />
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#2563EB]" />
              </button>

              <div className="invisible absolute right-0 top-[calc(100%+8px)] w-[280px] translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                <div className="absolute -top-3 left-0 right-0 h-3" />
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl p-2.5">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2563EB]/70 to-transparent mb-2" />
                  <div className="space-y-1">
                    <Link to="/security" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">Security & Trust</span>
                    </Link>
                    <Link to="/contact" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">Contact Us</span>
                    </Link>
                    <Link to="/demo" className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">Live Interactive Demo</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="relative z-10 flex items-center gap-3">
            <Link 
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300/90 bg-white/80 px-5 text-[14px] font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:border-slate-400 hover:bg-white hover:text-slate-900 cursor-pointer"
            >
              Login
            </Link>

            <Link 
              to="/register?plan=starter"
              className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-lg border border-[#2563EB]/30 bg-[#2563EB] px-5 text-[14px] font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] cursor-pointer"
            >
              <span className="relative z-10">Start Free Trial</span>
              <ArrowUpRight className="relative z-10 w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              {/* Shimmer light bar gliding across on hover */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </div>

        </div>

        {/* ========================================================
            MOBILE HEADER BAR (SkillTwin inspired)
           ======================================================== */}
        <div className="relative z-[110] flex h-[72px] w-full items-center justify-between lg:hidden px-1">
          
          {/* Mobile Logo */}
          <Link to="/" className="relative z-[120] flex shrink-0 items-center whitespace-nowrap cursor-pointer">
            <div className="flex min-w-0 shrink-0 items-center gap-2.5">
              <div className="relative flex shrink-0 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/[0.08] shadow-[0_0_20px_rgba(37,99,235,0.12)] h-9 w-9">
                <svg className="w-5 h-5 text-[#2563EB]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M10 22C6.68629 22 4 19.3137 4 16C4 12.9863 6.22271 10.4907 9.15587 10.0667C9.69747 6.6436 12.656 4 16.2857 4C20.3703 4 23.7317 7.15857 24.0322 11.238C26.3142 11.8344 28 13.9189 28 16.4C28 19.4928 25.4928 22 22.4 22H10Z" 
                    fill="#2563EB" 
                    fillOpacity="0.14" 
                    stroke="#2563EB" 
                    strokeWidth="2" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M16 19V11M16 11L12.5 14.5M16 11L19.5 14.5" 
                    stroke="#2563EB" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
              <div className="min-w-0 leading-none">
                <div className="whitespace-nowrap font-display font-bold tracking-[-0.03em] text-[16px]">
                  <span className="text-slate-900">Cloud</span>
                  <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">Optimizer</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Mobile Menu Trigger Button (SkillTwin style) */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative z-[120] flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-50/50 hover:text-blue-600 active:scale-95"
            aria-label="Toggle navigation"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-indigo-500/[0.06]" />
            {mobileMenuOpen ? <X className="relative z-10 w-5 h-5" /> : <Menu className="relative z-10 w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* ========================================================
          MOBILE MENU DRAWER (SkillTwin inspired)
         ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mx-4 my-2 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/98 shadow-[0_25px_60px_rgba(15,23,42,0.15)] backdrop-blur-2xl p-5"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2563EB]/70 to-transparent mb-4" />
            
            <div className="flex flex-col space-y-3">
              <Link to="/features" className="text-sm font-semibold text-slate-800 hover:text-[#2563EB] py-1 cursor-pointer">
                Platform & Capabilities
              </Link>
              <Link to="/features#for-engineering" className="text-sm font-semibold text-slate-800 hover:text-[#2563EB] py-1 cursor-pointer">
                Solutions for Teams
              </Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-800 hover:text-[#2563EB] py-1 cursor-pointer">
                Pricing & Plans
              </Link>
              <Link to="/security" className="text-sm font-semibold text-slate-800 hover:text-[#2563EB] py-1 cursor-pointer">
                Security & Compliance
              </Link>
              <Link to="/demo" className="text-sm font-semibold text-slate-800 hover:text-[#2563EB] py-1 cursor-pointer flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
                <span>Live Interactive Demo</span>
              </Link>

              <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-2.5">
                <Link 
                  to="/login" 
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-700 border border-slate-300/90 rounded-lg bg-white/80 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Login
                </Link>
                <Link 
                  to="/register?plan=starter" 
                  className="group relative w-full overflow-hidden text-center py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
