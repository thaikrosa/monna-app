import { useState } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { StepsSection } from '@/components/landing/StepsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PlanSelectionDialog } from '@/components/landing/PlanSelectionDialog';

export default function LandingPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);

  return (
    <div className="min-h-screen bg-secondary">
      <LandingNavbar />
      <HeroSection onCtaClick={openDialog} />
      <TestimonialsSection />
      <StepsSection />
      <FeaturesSection onCtaClick={openDialog} />
      <FAQSection />
      <FinalCTASection onCtaClick={openDialog} />
      <LandingFooter />
      <PlanSelectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
