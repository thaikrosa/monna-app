import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  const { user, loading, profile, profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback: se tokens OAuth aterrissaram aqui, redirecionar
  useEffect(() => {
    const hasOAuthHash = location.hash.includes('access_token');
    if (!hasOAuthHash) return;
    if (loading) return;
    if (!user) return;
    if (profileLoading) return;

    window.history.replaceState(null, '', location.pathname);

    if (profile?.onboarding_completed) {
      navigate('/home', { replace: true });
    } else {
      navigate('/bem-vinda', { replace: true });
    }
  }, [user, loading, profile, profileLoading, location.hash, navigate, location.pathname]);

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
