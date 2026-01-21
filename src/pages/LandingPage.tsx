import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { MetricsSection } from '@/components/landing/MetricsSection';
import { IdentificationSection } from '@/components/landing/IdentificationSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { StepsSection } from '@/components/landing/StepsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <LandingNavbar />
      <HeroSection />
      <MetricsSection />
      <IdentificationSection />
      <ProblemSection />
      <SolutionSection />
      <StepsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}
