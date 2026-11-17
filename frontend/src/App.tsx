import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { LandingPage } from './pages/marketing/LandingPage';
import { FeaturesPage } from './pages/marketing/FeaturesPage';
import { PricingPage } from './pages/marketing/PricingPage';
import { SecurityPage } from './pages/marketing/SecurityPage';
import { ContactPage } from './pages/marketing/ContactPage';
import { BookDemoPage } from './pages/marketing/BookDemoPage';
import { PrivacyPolicyPage } from './pages/marketing/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/marketing/TermsOfServicePage';
import { DemoDashboardPage } from './pages/dashboard/DemoDashboardPage';
import { LiveDashboardPage } from './pages/dashboard/LiveDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { SetupWizardPage } from './pages/onboarding/SetupWizardPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Ensures every route navigation immediately views the top of the page */}
      <ScrollToTop />
      
      <Routes>
        {/* Public Marketing & Funnel Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book-demo" element={<BookDemoPage />} />

        {/* Legal Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />

        {/* Interactive Demo Sandbox */}
        <Route path="/demo" element={<DemoDashboardPage />} />

        {/* Real Production SaaS Dashboard (Protected by authentication) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <LiveDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <LiveDashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Platform Owner / Superadmin Dashboard (Strictly restricted to Admin role) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Customer Cloud Account Setup Wizard (Post-Payment IAM Onboarding) */}
        <Route 
          path="/setup-wizard" 
          element={
            <ProtectedRoute>
              <SetupWizardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <SetupWizardPage />
            </ProtectedRoute>
          } 
        />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
