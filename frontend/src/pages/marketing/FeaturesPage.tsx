import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BackToTop } from '../../components/ui/BackToTop';
import { 
  Sparkles, 
  Cpu, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  TrendingDown, 
  Building2, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Server,
  Layers,
  Database,
  BarChart3,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturesPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-blue text-primary-blue text-xs font-semibold border border-primary-blue/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comprehensive SaaS Capabilities</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-text-primary tracking-tight">
              Engineered for Complete{' '}
              <span className="text-primary-blue">Cloud Financial Control</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Explore how Cloud Optimizer combines automated AWS discovery, multi-agent AI rightsizing, and strict engineering governance.
            </p>
          </div>

          {/* Section 1: Cloud Cost Intelligence */}
          <div id="cost-intelligence" className="mb-24 scroll-mt-28">
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-surface-blue text-primary-blue flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">
                  Granular AWS Cost Intelligence
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  Eliminate billing surprises. We connect to AWS Cost Explorer to ingest hourly, daily, and monthly billing logs across all connected member accounts.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>Multi-account spend aggregation and tag-based cost centers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>Automated anomaly detection alerts for unexpected budget spikes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>Unit cost metric allocation per service, cluster, and team</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 bg-background rounded-2xl border border-border p-6 font-mono text-xs space-y-3">
                <div className="text-text-primary font-bold pb-2 border-b border-border">
                  AWS Cost Explorer Normalized Query
                </div>
                <div className="text-text-secondary space-y-1">
                  <div>TimePeriod: [Last 30 Days]</div>
                  <div>Granularity: HOURLY</div>
                  <div>GroupByKey: [SERVICE, REGION, LINKED_ACCOUNT]</div>
                  <div className="text-primary-blue font-semibold mt-2">Anomaly Detected: +42% spike on Amazon RDS ap-south-1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Resource Monitoring */}
          <div id="resource-monitoring" className="mb-24 scroll-mt-28">
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1 bg-background rounded-2xl border border-border p-6 font-mono text-xs space-y-3">
                <div className="text-text-primary font-bold pb-2 border-b border-border">
                  Telemetry Aggregation (CloudWatch)
                </div>
                <div className="space-y-2 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Target: i-0b2a9e14c33891a82 (c5.2xlarge)</span>
                    <span className="text-warning">CPU Avg: 11.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Utilization</span>
                    <span className="text-primary-blue">Peak: 26.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Ingress/Egress</span>
                    <span className="text-success-green">Normal Steady-state</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-surface-blue text-primary-blue flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">
                  Deep Utilization Monitoring
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  Most cost tools only look at the bill. Cloud Optimizer cross-references AWS billing against real CloudWatch utilization metrics to verify true resource demand.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>Hourly telemetry collection for EC2 compute instances</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>EBS storage IOPS analysis to spot unattached and idle volumes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>RDS database connection and query activity baselining</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: AI Recommendations */}
          <div id="ai-recommendations" className="mb-24 scroll-mt-28">
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-surface-blue text-primary-blue flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">
                  Multi-Agent AI Rightsizing
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  Specialized agents analyze resource data to synthesize actionable, risk-evaluated recommendations. Every ticket includes statistical evidence and projected savings.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-text-secondary">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>Automated conversion proposals to AWS Graviton3 (ARM)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>Safe retention snapshotting before orphaned storage release</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success-green shrink-0" />
                    <span>Confidence scoring and risk assessment (Low, Medium, High)</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 bg-background rounded-2xl border border-border p-6 space-y-3">
                <div className="p-3 bg-white rounded-xl border border-border text-xs space-y-1">
                  <div className="flex justify-between font-bold text-text-primary">
                    <span>REC-2024-001: Right-size Analytics Node</span>
                    <span className="text-success-green">+$124/mo</span>
                  </div>
                  <p className="text-text-secondary text-[11px]">
                    Recommendation: Migrate from c5.2xlarge to c6g.xlarge.
                  </p>
                  <div className="text-[10px] text-text-secondary">
                    Risk: Low • Confidence: 96% • Verified Headroom: 48%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Persona Solutions Grid */}
          <div className="mt-28">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">
                Tailored for Every Cloud Stakeholder
              </h2>
              <p className="text-sm text-text-secondary mt-2">
                Whether you are a bootstrapped startup or an enterprise FinOps team, Cloud Optimizer adapts to your governance requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div id="for-startups" className="p-6 rounded-2xl bg-white border border-border shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-blue flex items-center justify-center text-primary-blue mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">For Startups</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">
                    Extend runway by eliminating orphaned development environments and unattached disks. Setup in 5 minutes with zero ongoing maintenance.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/80 mt-6">
                  <Link to="/register?plan=starter" className="text-xs font-semibold text-primary-blue hover:underline">
                    Start on Starter Plan →
                  </Link>
                </div>
              </div>

              <div id="for-engineering" className="p-6 rounded-2xl bg-white border border-border shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-blue flex items-center justify-center text-primary-blue mb-4">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">Cloud Engineering</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">
                    Replace tedious manual spreadsheet audits with continuous rightsizing proposals backed by 30-day statistical utilization telemetry.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/80 mt-6">
                  <Link to="/demo" className="text-xs font-semibold text-primary-blue hover:underline">
                    Try Interactive Demo →
                  </Link>
                </div>
              </div>

              <div id="for-finops" className="p-6 rounded-2xl bg-white border border-border shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-blue flex items-center justify-center text-primary-blue mb-4">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">FinOps Leaders</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">
                    Unit cost allocation, AI budget forecasting, and verified invoice reconciliation to prove positive ROI to executive leadership.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/80 mt-6">
                  <Link to="/pricing" className="text-xs font-semibold text-primary-blue hover:underline">
                    View Business Plan →
                  </Link>
                </div>
              </div>

              <div id="for-enterprises" className="p-6 rounded-2xl bg-white border border-border shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-blue flex items-center justify-center text-primary-blue mb-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary">Enterprises</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">
                    Multi-account AWS Organizations governance, custom Role-Based Access Control (RBAC), SAML SSO, and immutable compliance audit logs.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/80 mt-6">
                  <Link to="/demo" className="text-xs font-semibold text-primary-blue hover:underline flex items-center gap-1.5 cursor-pointer">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Try Live Interactive Demo →</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
};
