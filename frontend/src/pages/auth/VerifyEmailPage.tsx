import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MailCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your work email';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 600));
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-6 cursor-pointer">
          <CloudOptimizerLogo size="md" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-premium text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-surface-blue text-primary-blue flex items-center justify-center mx-auto shadow-xs">
            <MailCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-2xl text-text-primary tracking-tight">
              Check your inbox
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              We dispatched an activation email to <strong className="text-text-primary font-medium">{email}</strong>. Click the confirmation button inside to activate your organization.
            </p>
          </div>

          {resent && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-success-green text-xs font-semibold border border-emerald-200">
              ✓ Verification link resent successfully!
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              to="/demo"
              className="w-full py-3 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Interactive Demo Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-blue transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Resending...' : "Didn't receive email? Resend link"}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-border text-xs text-text-secondary">
            <span>Wrong email address? </span>
            <Link to="/register" className="font-semibold text-primary-blue hover:underline">
              Re-register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
