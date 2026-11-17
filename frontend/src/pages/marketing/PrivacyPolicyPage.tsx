import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BackToTop } from '../../components/ui/BackToTop';
import { ShieldCheck, Lock, EyeOff, Server, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-4 border-b border-slate-200 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LEGAL & COMPLIANCE</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500">
              Last updated: November 17, 2024 • Version 2.1
            </p>
          </div>

          {/* Key Privacy Highlights Card */}
          <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-3">
            <h2 className="font-display font-bold text-base text-[#2563EB] flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Our Core Privacy Principle: Zero Data-Plane Access</span>
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Cloud Optimizer inspects only cloud infrastructure metadata (such as instance types, disk sizing, CPU utilization percentages, and billing records). 
              <strong> We never read, store, or intercept your application data, customer records, database rows, S3 object contents, or production network traffic.</strong>
            </p>
          </div>

          {/* Detailed Content */}
          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-8 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">1. Information We Collect</h2>
              <p>
                When you use Cloud Optimizer, we collect information necessary to provide cost optimization and FinOps monitoring services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Account & Profile Information:</strong> Name, business email, organization name, and billing credentials processed securely via certified payment gateways.</li>
                <li><strong>Cloud Metadata:</strong> Cloud resource identifiers (e.g., EC2 instance IDs, EBS volume IDs), resource types, regions, tags, and CloudWatch performance metrics (CPU, memory utilization).</li>
                <li><strong>Billing & Spend Telemetry:</strong> Aggregated hourly and daily cost telemetry retrieved via AWS Cost Explorer, Azure Cost Management, or Google Cloud Billing APIs.</li>
                <li><strong>Authentication Audit Logs:</strong> Access timestamps, IP addresses, and user actions taken within the Cloud Optimizer console.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">2. How We Access Your Cloud Infrastructure</h2>
              <p>
                Cloud Optimizer connects to your cloud accounts exclusively via <strong>least-privilege IAM Cross-Account Roles (AWS STS AssumeRole)</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>We do not request or store permanent AWS IAM user access keys, secret keys, or root passwords.</li>
                <li>All sessions use short-lived STS credentials generated on demand with an explicit External ID.</li>
                <li>Access is restricted to read-only policies (<code className="text-[#2563EB] bg-blue-50 px-1 py-0.5 rounded">SecurityAudit</code>, <code className="text-[#2563EB] bg-blue-50 px-1 py-0.5 rounded">CostExplorerReadOnlyAccess</code>).</li>
                <li>You maintain full sovereignty and can revoke our access instantaneously at any time from your cloud management console.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">3. How We Use Your Information</h2>
              <p>Collected telemetry is utilized strictly for:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Analyzing cloud infrastructure utilization and generating rightsizing recommendations.</li>
                <li>Detecting idle, unattached, or orphaned cloud storage volumes and clusters.</li>
                <li>Computing realized savings and generating executive FinOps reports.</li>
                <li>Providing customer support and platform security notifications.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">4. Data Security & Encryption</h2>
              <p>
                All data transmitted between your browser, our API servers, and cloud providers is protected by <strong>TLS 1.3 encryption</strong> in transit. All persistent data in our database is encrypted at rest using <strong>AES-256</strong>. We conduct regular third-party vulnerability assessments and penetration testing.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">5. Contact Us</h2>
              <p className="text-xs">
                If you have questions regarding this Privacy Policy or our security architecture, contact our Data Protection Officer at:
                <br />
                <a href="mailto:privacy@cloudoptimizer.io" className="text-[#2563EB] font-bold hover:underline">
                  privacy@cloudoptimizer.io
                </a>
              </p>
            </section>

          </div>

        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
};
