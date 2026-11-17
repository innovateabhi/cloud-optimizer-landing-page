import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BackToTop } from '../../components/ui/BackToTop';
import { FileText, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-4 border-b border-slate-200 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-blue-200">
              <FileText className="w-3.5 h-3.5" />
              <span>TERMS & CONDITIONS</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500">
              Last updated: November 17, 2024 • Version 2.1
            </p>
          </div>

          {/* Quick Notice Card */}
          <div className="p-6 rounded-3xl bg-slate-100/80 border border-slate-200 space-y-2">
            <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2563EB]" />
              <span>Subscription Agreement Summary</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              These Terms of Service govern your access to and use of the Cloud Optimizer platform. By registering an account or connecting your cloud infrastructure, you agree to be bound by these terms.
            </p>
          </div>

          {/* Detailed Terms */}
          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-8 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">1. Cloud Optimizer SaaS Platform Services</h2>
              <p>
                Cloud Optimizer provides multi-cloud cost intelligence, resource telemetry monitoring, automated waste identification, and FinOps reporting for Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP). Cloud capabilities and entitlements unlock based on your selected subscription plan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">2. Account Registration and Customer Responsibilities</h2>
              <p>
                You must provide accurate, complete registration information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your organization's account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">3. Human-in-the-Loop Approval & Execution</h2>
              <p>
                Cloud Optimizer operates in read-only discovery mode by default. While our multi-agent AI algorithms generate optimization recommendations, <strong>all rightsizing, stopping, or termination of cloud resources require explicit review and authorization by your team</strong>.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong>Important Notice:</strong> You retain final operational control over your cloud infrastructure. Cloud Optimizer is not liable for service interruptions resulting from actions explicitly approved and executed by your authorized administrators.
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">4. Subscription Plans, Billing & Cancellation</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Free Plan:</strong> Allows 1 cloud account, 2 regions, and up to 5 monitored resources. Includes basic monitoring and standard report generation. Does not include email support.</li>
                <li><strong>Paid Tiers (Starter & Business):</strong> Billed monthly or annually in advance in INR (₹) or USD ($). Subscriptions automatically renew unless cancelled prior to the renewal date.</li>
                <li><strong>Cancellation:</strong> You may cancel your subscription at any time from your account settings. You retain access through the end of your prepaid billing period.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, Cloud Optimizer shall not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">6. Governing Law & Contact</h2>
              <p className="text-xs">
                These terms are governed by the laws of India. For legal notices or contractual inquiries, contact:
                <br />
                <a href="mailto:legal@cloudoptimizer.io" className="text-[#2563EB] font-bold hover:underline">
                  legal@cloudoptimizer.io
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
