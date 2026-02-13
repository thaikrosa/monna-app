import { Spinner } from '@phosphor-icons/react';
import logoMonna from '@/assets/logo-monna.png';
import { useOnboardingWizard } from '@/hooks/useOnboardingWizard';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { WizardStep1Login } from '@/components/onboarding/WizardStep1Login';
import { WizardStep2Form } from '@/components/onboarding/WizardStep2Form';
import { WizardStep3Complete } from '@/components/onboarding/WizardStep3Complete';

export default function BemVinda() {
  const {
    step,
    initializing,
    formData,
    displayNickname,
    appReady,
    signingIn,
    showMagicLink,
    magicEmail,
    magicLinkSent,
    sendingMagicLink,
    savingProfile,
    isReady,
    handleGoogleLogin,
    handleMagicLink,
    handleSaveProfile,
    handleGoToApp,
    setMagicEmail,
    setShowMagicLink,
  } = useOnboardingWizard();

  if (!isReady || initializing || step === null) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
        <Spinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-start justify-center px-4 py-8 pb-[env(safe-area-inset-bottom)] sm:items-center sm:py-4">
      <div className="max-w-md w-full text-center">
        <img src={logoMonna} alt="Monna" className="h-10 mx-auto mb-6" />
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <WizardStep1Login
            signingIn={signingIn}
            showMagicLink={showMagicLink}
            magicEmail={magicEmail}
            magicLinkSent={magicLinkSent}
            sendingMagicLink={sendingMagicLink}
            onGoogleLogin={handleGoogleLogin}
            onMagicLink={handleMagicLink}
            onSetMagicEmail={setMagicEmail}
            onSetShowMagicLink={setShowMagicLink}
          />
        )}

        {step === 2 && (
          <WizardStep2Form
            defaultValues={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              nickname: formData.nickname,
              whatsappDigits: formData.whatsappDigits,
            }}
            savingProfile={savingProfile}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {step === 3 && (
          <WizardStep3Complete
            displayNickname={displayNickname}
            appReady={appReady}
            onGoToApp={handleGoToApp}
          />
        )}
      </div>
    </div>
  );
}
