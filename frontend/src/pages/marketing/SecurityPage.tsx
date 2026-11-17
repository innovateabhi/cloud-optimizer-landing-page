import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  UserCheck, 
  FileCheck2, 
  Database, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Server,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackToTop } from '../../components/ui/BackToTop';

export const SecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-blue text-primary-blue text-xs font-semibold border border-primary-blue/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise Security Whitepaper</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-text-primary tracking-tight">
              Cloud Security & Trust{' '}
              <span className="text-primary-blue">Architecture</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              How Cloud Optimizer inspects AWS environments securely without long-lived credentials, privileged agents, or autonomous destructive permissions.
            </p>
          </div>

          {/* Architecture Deep Dive Grid */}
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* 1. AWS IAM Cross-Account STS AssumeRole */}
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-blue text-primary-blue flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Cross-Account Role Assumption (AWS STS)
                </h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Rather than asking for AWS root credentials or persistent IAM access keys, Cloud Optimizer uses AWS Security Token Service (STS) <code className="text-primary-blue bg-surface-blue px-1.5 py-0.5 rounded font-mono text-xs">AssumeRole</code>. You deploy a minimal IAM role in your AWS account granting trust solely to Cloud Optimizer's backend service.
              </p>
              <div className="p-4 bg-background rounded-xl border border-border font-mono text-xs text-text-secondary">
                <div className="font-semibold text-text-primary mb-1">IAM Trust Policy Enforcing Confused Deputy Protection:</div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed">
{`"Principal": { "AWS": "arn:aws:iam::884192019481:root" },
"Action": "sts:AssumeRole",
"Condition": {
  "StringEquals": {
    "sts:ExternalId": "org_opt_94810283"
  }
}`}
                </pre>
              </div>
            </div>

            {/* 2. Read-Only Least Privilege Discovery */}
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-blue text-primary-blue flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Strict Least-Privilege Read-Only Discovery
                </h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our standard discovery policy is strictly non-destructive. It includes read-only actions such as <code className="text-text-primary font-mono text-xs">ec2:DescribeInstances</code>, <code className="text-text-primary font-mono text-xs">ec2:DescribeVolumes</code>, <code className="text-text-primary font-mono text-xs">rds:DescribeDBInstances</code>, <code className="text-text-primary font-mono text-xs">s3:ListAllMyBuckets</code>, <code className="text-text-primary font-mono text-xs">cloudwatch:GetMetricData</code>, and <code className="text-text-primary font-mono text-xs">ce:GetCostAndUsage</code>.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-success-green bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero terminate, modify, delete, or create permissions granted in the discovery role.</span>
              </div>
            </div>

            {/* 3. Human Approval & Segregated Execution */}
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-blue text-primary-blue flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Human-Approved Optimization & Dry-Run Simulations
                </h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Cloud Optimizer never automatically modifies or restarts customer infrastructure. Recommendations must be reviewed by designated organization approvers. During simulation mode, safety pre-conditions (such as instance backup verification, security group dependencies, and maintenance windows) are checked before any change is authorized.
              </p>
            </div>

            {/* 4. Multi-Tenant Data Isolation & Encryption */}
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-blue text-primary-blue flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Multi-Tenant Data Isolation & Encryption
                </h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Tenant isolation is strictly enforced at the database query layer via validated <code className="text-text-primary font-mono text-xs">organization_id</code> foreign keys. Network data is encrypted in transit using TLS 1.3, and database storage volumes are encrypted at rest using AES-256.
              </p>
            </div>

            {/* 5. Complete Audit Logs */}
            <div className="bg-white rounded-3xl border border-border shadow-premium p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-blue text-primary-blue flex items-center justify-center font-bold">
                  5
                </div>
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Immutable Audit Ledger
                </h2>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every action taken on the platform — connecting an AWS account, triggering discovery runs, reviewing recommendations, and approving optimization tickets — is captured in an immutable audit ledger with user ID, IP address, and UTC timestamp.
              </p>
            </div>

          </div>

          {/* CTA Box */}
          <div className="max-w-4xl mx-auto mt-16 p-8 rounded-3xl bg-surface-blue/50 border border-primary-blue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-lg text-text-primary">
                Ready to review our sample IAM policy document?
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                You can review every JSON permission statement prior to onboarding.
              </p>
            </div>
            <Link
              to="/register?plan=starter"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all shrink-0"
            >
              <span>Start Onboarding Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
};
