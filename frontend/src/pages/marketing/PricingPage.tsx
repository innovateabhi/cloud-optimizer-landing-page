import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PricingSection } from '../../components/marketing/PricingSection';
import { SavingsCalculator } from '../../components/marketing/SavingsCalculator';
import { FAQSection } from '../../components/marketing/FAQSection';
import { CTABanner } from '../../components/marketing/CTABanner';
import { BackToTop } from '../../components/ui/BackToTop';

export const PricingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <PricingSection />
        <SavingsCalculator />
        <FAQSection />
        <CTABanner />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};
