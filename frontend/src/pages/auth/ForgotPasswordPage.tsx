import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid work email'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setEmailSent(data.email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-6 cursor-pointer">
          <CloudOptimizerLogo size="md" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-premium space-y-6">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-success-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-text-primary">
                Password Reset Email Sent
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                If an account exists for <strong className="text-text-primary">{emailSent}</strong>, we have dispatched instructions with a secure one-time reset link.
              </p>
              <div className="pt-2">
                <Link
                  to={`/reset-password?token=sample_token&email=${encodeURIComponent(emailSent)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-blue hover:underline"
                >
                  <span>Simulate opening reset link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="pt-4 border-t border-border">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-text-secondary hover:text-primary-blue transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to login</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-display font-bold text-2xl text-text-primary">
                  Reset your password
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Enter your registered work email and we will send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      {...register('email')}
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                        errors.email ? 'border-danger' : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-danger mt-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs sm:text-sm font-semibold shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending reset email...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-text-secondary hover:text-primary-blue transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
