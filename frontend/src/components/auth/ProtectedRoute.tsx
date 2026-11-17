import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { CloudOptimizerLogo } from '../ui/CloudOptimizerLogo';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const token = localStorage.getItem('cloud_optimizer_token');
  const userJson = localStorage.getItem('cloud_optimizer_user');
  const user = userJson ? JSON.parse(userJson) : null;

  // 1. Unauthenticated check
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Admin Privileges Check
  if (requireAdmin) {
    const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#FAFBFD] flex flex-col justify-between">
          <header className="h-16 border-b border-border bg-white px-6 flex items-center justify-between">
            <Link to="/">
              <CloudOptimizerLogo size="sm" />
            </Link>
          </header>

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-xs">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100/70 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" />
                  <span>403 Access Denied</span>
                </div>
                <h2 className="text-xl font-display font-extrabold text-slate-900">
                  Platform Owner Access Restricted
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The <strong>/admin</strong> console is strictly reserved for Cloud Optimizer company administrators and platform owners. Your current account (<code>{user?.email || 'Customer Account'}</code>) holds user-level privileges.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Current Session:
                </span>
                <div className="font-semibold text-slate-800">{user?.fullName || 'User'}</div>
                <div className="text-[11px] text-slate-500">Plan: {localStorage.getItem('cloud_optimizer_plan') || 'starter'}</div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  className="w-full py-2.5 rounded-xl bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-semibold shadow-premium flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Return to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
                >
                  Sign in with Admin Credentials →
                </Link>
              </div>
            </div>
          </main>

          <footer className="py-4 border-t border-border bg-white text-center text-xs text-text-secondary">
            <span>Cloud Optimizer FinOps Technologies · Enterprise Role-Based Access Control</span>
          </footer>
        </div>
      );
    }
  }

  // Authorized
  return <>{children}</>;
};
