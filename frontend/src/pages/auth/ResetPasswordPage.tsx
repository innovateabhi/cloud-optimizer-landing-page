import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { CloudOptimizerLogo } from '../../components/ui/CloudOptimizerLogo';

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2500);
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
          {success ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-success-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-text-primary">
                Password Successfully Updated
              </h3>
              <p className="text-xs text-text-secondary">
                Your new security password is saved. Redirecting to login...
              </p>
              <div className="pt-2">
                <Link to="/login" className="text-xs font-semibold text-primary-blue hover:underline">
                  Click here if not redirected automatically →
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-display font-bold text-2xl text-text-primary">
                  Choose a new password
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Ensure your password contains at least 8 characters.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      {...register('password')}
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                        errors.password ? 'border-danger' : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-danger mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-primary block mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      {...register('confirmPassword')}
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-primary-blue ${
                        errors.confirmPassword ? 'border-danger' : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-danger mt-1">{errors.confirmPassword.message}</p>
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
                      <span>Saving new password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
