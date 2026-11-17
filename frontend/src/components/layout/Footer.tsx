import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { CloudOptimizerLogo } from '../ui/CloudOptimizerLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block cursor-pointer">
              <CloudOptimizerLogo size="md" />
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The modern B2B SaaS platform for multi-cloud cost visibility, autonomous waste detection, right-sizing recommendations, and human-governed infrastructure savings.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Systems Operational</span>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Read-Only STS Assumed</span>
              </div>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/features#cost-intelligence" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Cost Intelligence
                </Link>
              </li>
              <li>
                <Link to="/features#resource-monitoring" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Resource Monitoring
                </Link>
              </li>
              <li>
                <Link to="/features#ai-recommendations" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  AI Recommendations
                </Link>
              </li>
              <li>
                <Link to="/features#human-approvals" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Approval Governance
                </Link>
              </li>
              <li>
                <Link to="/features#savings-tracking" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Savings Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions & Pricing */}
          <div>
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider mb-4">
              Solutions & Pricing
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/features#for-startups" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  For Startups
                </Link>
              </li>
              <li>
                <Link to="/features#for-engineering" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Cloud Engineering
                </Link>
              </li>
              <li>
                <Link to="/features#for-finops" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  FinOps Leaders
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#2563EB] transition-colors font-semibold text-[#2563EB] cursor-pointer">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/pricing#calculator" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Savings Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div>
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider mb-4">
              Trust & Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/security" className="hover:text-[#2563EB] transition-colors flex items-center gap-1 cursor-pointer">
                  <span>Security Whitepaper</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Live Interactive Demo
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Contact Sales & Support
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-[#2563EB] transition-colors cursor-pointer">
                  Interactive Demo Sandbox
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cloud Optimizer. All rights reserved. Multi-cloud FinOps infrastructure.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero credentials stored</span>
            </span>
            <Link to="/privacy-policy" className="hover:text-[#2563EB] transition-colors cursor-pointer">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-[#2563EB] transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
