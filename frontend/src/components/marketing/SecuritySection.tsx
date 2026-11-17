import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  UserCheck, 
  FileCheck2, 
  Database, 
  EyeOff, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecuritySection: React.FC = () => {
  const securityPillars = [
    {
      icon: Key,
      title: 'Zero Permanent Secrets Stored',
      description: 'We never ask for or store AWS root passwords, IAM user access keys, or long-lived credentials. All telemetry discovery uses temporary AWS STS AssumeRole sessions.',
    },
    {
      icon: ShieldCheck,
      title: 'Strict Least-Privilege IAM',
      description: 'Our standard onboarding policy grants strictly read-only Describe* and Get* actions for EC2, RDS, EBS, and CloudWatch. We cannot alter or delete your workloads without explicit consent.',
    },
    {
      icon: EyeOff,
      title: 'Unique External ID Protection',
      description: 'Every customer organization is provisioned with a cryptographic External ID condition on IAM trust relationships, actively mitigating confused deputy vulnerabilities.',
    },
    {
      icon: UserCheck,
      title: 'Mandatory Human Authorization',
      description: 'Autonomous AI agents are restricted to discovery and recommendation. Destructive actions or rightsizing modifications strictly require human sign-off.',
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All network telemetry is encrypted in transit using TLS 1.3. Internal database records and configuration parameters are encrypted at rest using AES-256.',
    },
    {
      icon: FileCheck2,
      title: 'Immutable Audit Trail',
      description: 'Every authorization decision, recommendation status update, and discovery run is written to an append-only audit ledger with user ID and timestamp attribution.',
    },
  ];

  return (
    <section id="security" className="py-24 bg-white border-b border-border relative">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-blue text-primary-blue text-xs font-semibold border border-primary-blue/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enterprise Cloud Governance</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight">
            Security & Trust Built Into{' '}
            <span className="text-primary-blue">Every Architecture Layer</span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Engineered from day one for compliance-conscious infrastructure teams. Transparent authorization with zero credential persistence.
          </p>
        </div>

        {/* 6 Security Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary-blue/40 hover:shadow-subtle transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary-blue shadow-xs mb-4">
                  <Icon className="w-5 h-5 text-primary-blue" />
                </div>
                <h3 className="font-display font-bold text-base text-text-primary mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Security Banner Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-surface-blue/50 border border-primary-blue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-base text-text-primary">
              Need a deep-dive security review for your InfoSec team?
            </h4>
            <p className="text-xs text-text-secondary max-w-xl">
              Inspect our comprehensive IAM policy documents, multi-tenant isolation model, and data retention guarantees in our Security Whitepaper.
            </p>
          </div>

          <Link
            to="/security"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-surface-blue border border-border text-xs sm:text-sm font-semibold text-primary-blue shadow-xs transition-colors shrink-0"
          >
            <span>Read Security Whitepaper</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
