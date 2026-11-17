import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  ArrowRight,
  EyeOff,
  Clock,
  Sparkles,
  Server,
  Cloud
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountLinkingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'aws' | 'azure' | 'gcp'>('aws');
  const [copiedCode, setCopiedCode] = useState(false);

  const cfTemplate = `AWSTemplateFormatVersion: '2010-09-09'
Description: 'Cloud Optimizer Read-Only FinOps Discovery Role'
Parameters:
  ExternalId:
    Type: String
    Default: 'co-ext-YOUR_ORG_EXTERNAL_ID'
Resources:
  CloudOptimizerRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: CloudOptimizerDiscoveryRole
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: 'arn:aws:iam::884192019481:root'
            Action: 'sts:AssumeRole'
            Condition:
              StringEquals:
                'sts:ExternalId': !Ref ExternalId
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/SecurityAudit'
        - 'arn:aws:iam::aws:policy/AWSOrganizationsReadOnlyAccess'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cfTemplate);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section id="how-to-connect" className="py-24 bg-white border-b border-border relative overflow-hidden">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold uppercase tracking-wider border border-blue-200 cursor-default">
            <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>ZERO-TRUST CLOUD CONNECTIVITY</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            How to Connect Your Cloud Account in 3 Minutes
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Connect your AWS, Azure, or GCP accounts using standard read-only IAM cross-account roles. 
            No root credentials, no access keys, and zero access to customer data.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Step 1 */}
          <div className="p-7 rounded-3xl bg-[#FAFBFD] border border-slate-200/90 shadow-2xs relative flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] font-display font-bold text-sm flex items-center justify-center border border-blue-100">
                  01
                </span>
                <span className="text-[11px] font-semibold text-slate-400 font-mono">Step 1 of 3</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Create IAM Role in Console
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log into your AWS Management Console. Create a dedicated Cross-Account IAM role delegated to Cloud Optimizer's verified AWS account.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono text-slate-700">
                <div className="text-[10px] text-slate-400 font-sans font-bold">Recommended Role Name:</div>
                <div className="font-bold text-[#2563EB]">CloudOptimizerDiscoveryRole</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Takes ~60 seconds via CloudFormation</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-3xl bg-[#FAFBFD] border border-slate-200/90 shadow-2xs relative flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 font-display font-bold text-sm flex items-center justify-center border border-emerald-100">
                  02
                </span>
                <span className="text-[11px] font-semibold text-slate-400 font-mono">Step 2 of 3</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Attach Read-Only Permissions
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Attach standard AWS managed read-only policies: <code className="text-[#2563EB] bg-blue-50 px-1 py-0.5 rounded">SecurityAudit</code> and <code className="text-[#2563EB] bg-blue-50 px-1 py-0.5 rounded">CostExplorerReadOnly</code>.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Read-Only Discovery</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero Database or S3 Object Access</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Least-privilege security principle</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-3xl bg-[#FAFBFD] border border-slate-200/90 shadow-2xs relative flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 font-display font-bold text-sm flex items-center justify-center border border-indigo-100">
                  03
                </span>
                <span className="text-[11px] font-semibold text-slate-400 font-mono">Step 3 of 3</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Provide Role ARN & External ID
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paste the generated Role ARN into Cloud Optimizer. Protected by a unique, randomized External ID that prevents confused-deputy attacks.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 font-mono text-slate-700">
                <div className="text-[10px] text-slate-400 font-sans font-bold">AWS STS Verification:</div>
                <div className="text-[11px] text-slate-900 font-semibold truncate">arn:aws:iam::123456789012:role/...</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Instant sync & discovery within minutes</span>
            </div>
          </div>

        </div>

        {/* Technical Deep Dive & Security Blueprint Box */}
        <div className="p-8 rounded-3xl bg-[#0F172A] text-white shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Security Highlights */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Enterprise Security Architecture</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Why Cross-Account IAM Roles Are the Safest Method
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                We believe in zero-trust infrastructure access. You never share passwords, API access keys, or secret tokens. 
                AWS STS issues short-lived temporary credentials that expire automatically every hour.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-slate-300">No static AWS API secret keys stored</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-slate-300">Confused deputy protection via External ID</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-slate-300">Revoke access anytime by deleting role in AWS</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-slate-300">Full CloudTrail audit logging in your account</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/security"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Read Full Security Whitepaper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <span>Explore in Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: CloudFormation / Terraform Snippet Preview */}
            <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>cloudformation-iam-template.yaml</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-56 p-1 select-all">
                {cfTemplate}
              </pre>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                <span>Deployable via AWS Management Console or AWS CLI</span>
                <span className="text-emerald-400 font-bold">100% Read-Only</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
