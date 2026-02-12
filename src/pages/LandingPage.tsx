import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
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
  const { isReady, userState } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect logged-in subscriber
  useEffect(() => {
    if (!isReady) return;
    if (location.hash.includes('access_token')) return;

    if (userState === 'READY') {
      navigate('/home', { replace: true });
    } else if (userState === 'ONBOARDING') {
      navigate('/bem-vinda', { replace: true });
    }
  }, [isReady, userState, navigate, location.hash]);

  // Open plan dialog when hash #planos is present
  useEffect(() => {
    if (location.hash === '#planos') {
      setDialogOpen(true);
      window.history.replaceState(null, '', location.pathname);
    }
  }, [location.hash, location.pathname]);

  // Fallback: if OAuth tokens landed here, redirect
  useEffect(() => {
    const hasOAuthHash = location.hash.includes('access_token');
    if (!hasOAuthHash) return;
    if (!isReady) return;

    window.history.replaceState(null, '', location.pathname);

    if (userState === 'READY') {
      navigate('/home', { replace: true });
    } else if (userState === 'ONBOARDING') {
      navigate('/bem-vinda', { replace: true });
    }
  }, [isReady, userState, location.hash, navigate, location.pathname]);

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
