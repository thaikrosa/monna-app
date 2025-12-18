import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  useOnboardingProgress, 
  useCreateOnboardingProgress, 
  useUpdateOnboardingProgress,
  useCompleteKickstart 
} from '@/hooks/useOnboarding';
import { KickstartStep1 } from '@/components/onboarding/KickstartStep1';
import { KickstartStep2 } from '@/components/onboarding/KickstartStep2';
import { KickstartStep3 } from '@/components/onboarding/KickstartStep3';
import { toast } from 'sonner';

export default function Kickstart() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: progress, isLoading } = useOnboardingProgress();
  const createProgress = useCreateOnboardingProgress();
  const updateProgress = useUpdateOnboardingProgress();
  const completeKickstart = useCompleteKickstart();

  // Create onboarding_progress if it doesn't exist
  useEffect(() => {
    if (!isLoading && !progress) {
      createProgress.mutate();
    }
  }, [isLoading, progress]);

  const handleStep1Next = async () => {
    await updateProgress.mutateAsync({ step_welcome: true });
    setCurrentStep(2);
  };

  const handleStep2Next = async () => {
    await updateProgress.mutateAsync({ step_routines: true });
    setCurrentStep(3);
  };

  const handleStep2Skip = () => {
    setCurrentStep(3);
  };

  const handleComplete = async () => {
    try {
      await completeKickstart.mutateAsync();
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('Erro ao finalizar. Tente novamente.');
    }
  };

  const handleConnectCalendar = () => {
    toast.info('Em breve!', {
      description: 'A conexão com Google Calendar estará disponível em breve.',
    });
  };

  const nickname = profile?.nickname || profile?.first_name || 'você';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Progress dots */}
      <div className="pt-8 pb-4">
        <div className="kickstart-dots">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`kickstart-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col px-6">
        {currentStep === 1 && (
          <div className="kickstart-step flex-1 flex flex-col" key="step1">
            <KickstartStep1 nickname={nickname} onNext={handleStep1Next} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="kickstart-step flex-1 flex flex-col" key="step2">
            <KickstartStep2 onNext={handleStep2Next} onSkip={handleStep2Skip} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="kickstart-step flex-1 flex flex-col" key="step3">
            <KickstartStep3 
              onComplete={handleComplete} 
              onConnectCalendar={handleConnectCalendar} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
