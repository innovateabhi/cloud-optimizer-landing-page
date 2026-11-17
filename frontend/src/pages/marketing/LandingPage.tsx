import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { HeroSection } from '../../components/marketing/HeroSection';
import { ProblemSection } from '../../components/marketing/ProblemSection';
import { SolutionSection } from '../../components/marketing/SolutionSection';
import { HowItWorksSection } from '../../components/marketing/HowItWorksSection';
import { ImpactBanner } from '../../components/marketing/ImpactBanner';
import { AccountLinkingSection } from '../../components/marketing/AccountLinkingSection';
import { SavingsCalculator } from '../../components/marketing/SavingsCalculator';
import { PricingSection } from '../../components/marketing/PricingSection';
import { FAQSection } from '../../components/marketing/FAQSection';
import { CTABanner } from '../../components/marketing/CTABanner';
import { Footer } from '../../components/layout/Footer';
import { BackToTop } from '../../components/ui/BackToTop';

export const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col selection:bg-purple-100 selection:text-[#5B45F6]">
      <Navbar />
      <main className="flex-grow">
        {/* 1. Hero with Live Mockup & Cloud Providers */}
        <HeroSection />

        {/* 2. The Challenge */}
        <ProblemSection />

        {/* 3. The Solution */}
        <SolutionSection />

        {/* 4. How It Works (4 Simple Steps) */}
        <HowItWorksSection />

        {/* 5. Real Savings, Real Impact Metrics Banner */}
        <ImpactBanner />

        {/* 6. How to Connect Your Cloud Account (Zero-Trust IAM Role) */}
        <AccountLinkingSection />

        {/* 7. Cloud Savings Calculator */}
        <SavingsCalculator />

        {/* 8. Pricing Plans */}
        <PricingSection />

        {/* 9. Testimonial + FAQs */}
        <FAQSection />

        {/* 10. Ready to Cut Your Cloud Costs CTA */}
        <CTABanner />
      </main>

      {/* Floating Animated Back to Top Button */}
      <BackToTop />

      <Footer />
    </div>
  );
};
