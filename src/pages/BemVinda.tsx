import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check, GoogleLogo, Spinner, EnvelopeSimple } from '@phosphor-icons/react';
import logoMonna from '@/assets/logo-monna.png';

type WizardStep = 1 | 2 | 3;

function StepIndicator({ currentStep }: { currentStep: WizardStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {([1, 2, 3] as const).map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step < currentStep
                ? 'bg-primary text-primary-foreground'
                : step === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {step < currentStep ? (
              <Check weight="bold" className="w-4 h-4" />
            ) : (
              step
            )}
          </div>
          {i < 2 && (
            <div
              className={`w-6 h-0.5 ${
                step < currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BemVinda() {
  const { user, session, profile, isReady, refetch } = useSession();
  const navigate = useNavigate();
  const authLoading = !isReady;

  const [step, setStep] = useState<WizardStep | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Step 1 state
  const [signingIn, setSigningIn] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);

  // Step 2 state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Step 3 state
  const [displayNickname, setDisplayNickname] = useState('');
  const [appReady, setAppReady] = useState(false);
  const triggerRef = useRef(false);

  // Track if user just logged in
  const prevUserRef = useRef<string | null | undefined>(undefined);

  // RequireState already handles redirect if not ONBOARDING

  const calculateStep = useCallback(async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('nickname, terms_accepted_at, privacy_accepted_at, first_name, last_name, onboarding_completed')
      .eq('id', userId)
      .maybeSingle();

    // Already completed — don't show wizard
    if (profileData?.onboarding_completed) {
      return null; // signal to redirect
    }

    // Check LGPD acceptance
    if (!profileData?.terms_accepted_at || !profileData?.privacy_accepted_at) {
      // Pre-fill from profile or Google metadata
      const defaultFirst = profileData?.first_name || '';
      const defaultLast = profileData?.last_name || '';
      const defaultNick = profileData?.nickname || defaultFirst;
      setFirstName(defaultFirst);
      setLastName(defaultLast);
      setNickname(defaultNick);
      setDisplayNickname(defaultNick);
      return 2 as WizardStep;
    }

    setDisplayNickname(profileData.nickname || profileData.first_name || '');
    return 3 as WizardStep;
  }, []);

  // Initialize step based on auth + data
  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      if (!user) {
        setStep(1);
        setInitializing(false);
        return;
      }

      const computed = await calculateStep(user.id);
      if (computed === null) {
        navigate('/home', { replace: true });
        return;
      }
      setStep(computed);
      setInitializing(false);
    };

    init();
  }, [authLoading, user, calculateStep, navigate]);

  // Auto-advance from Step 1 when user logs in
  useEffect(() => {
    if (prevUserRef.current === undefined) {
      prevUserRef.current = user?.id ?? null;
      return;
    }

    if (prevUserRef.current === null && user?.id) {
      prevUserRef.current = user.id;
      setInitializing(true);
      calculateStep(user.id).then((computed) => {
        if (computed === null) {
          navigate('/home', { replace: true });
          return;
        }
        setStep(computed);
        setInitializing(false);
      });
    } else {
      prevUserRef.current = user?.id ?? null;
    }
  }, [user, calculateStep, navigate]);

  // Step 1 — Google Login (inline, redirects to /bem-vinda)
  const handleGoogleLogin = async () => {
    setSigningIn(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/bem-vinda`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
    } catch {
      setSigningIn(false);
    }
  };

  // Step 1 — Magic Link
  const handleMagicLink = async () => {
    setSendingMagicLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/bem-vinda`,
      },
    });
    if (error) {
      console.error('[BemVinda] Magic link error:', error);
    } else {
      setMagicLinkSent(true);
    }
    setSendingMagicLink(false);
  };

  // Step 2 — Save profile
  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          nickname,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('[BemVinda] Profile save error:', error);
        return;
      }

      setDisplayNickname(nickname);
      setStep(3);
    } finally {
      setSavingProfile(false);
    }
  };

  // Step 3 — Release app access + trigger WhatsApp
  useEffect(() => {
    if (step !== 3 || triggerRef.current || !session) return;
    triggerRef.current = true;

    const setupAndRelease = async () => {
      // 1. CRITICAL: Set onboarding_completed = true
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      // Enable button immediately — don't block on retry
      if (error) {
        console.error('[Onboarding] Erro ao liberar app:', error);
        // Retry in background, don't block UI
        setTimeout(async () => {
          const retry = await supabase
            .from('profiles')
            .update({
              onboarding_completed: true,
              onboarding_completed_at: new Date().toISOString(),
            })
            .eq('id', session.user.id);
          if (retry.error) {
            console.error('[Onboarding] Retry falhou:', retry.error);
          }
        }, 2000);
      }

      setAppReady(true);

      // 2. Fire-and-forget: trigger WhatsApp onboarding
      try {
        const { data: onb } = await supabase
          .from('onboarding')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('flow', 'whatsapp')
          .maybeSingle();

        if (onb?.status === 'pending') {
          supabase.functions.invoke('trigger-onboarding', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }); // No await — fire and forget
        }
      } catch (err) {
        console.error('[Onboarding] trigger failed:', err);
      }
    };

    setupAndRelease();
  }, [step, session]);

  // Loading
  if (authLoading || initializing || step === null) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const canContinueStep2 =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    nickname.trim().length >= 2 &&
    termsAccepted &&
    privacyAccepted;

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <img src={logoMonna} alt="Monna" className="h-10 mx-auto mb-6" />
        <StepIndicator currentStep={step} />

        {/* Step 1 — Login */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Prontinho! 💛
            </h1>
            <p className="text-foreground/80 leading-relaxed">
              Sua assinatura está confirmada. Agora vamos preparar tudo pra você.
            </p>

            <Button
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="w-full gap-2"
              size="lg"
            >
              {signingIn ? (
                <Spinner className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleLogo weight="bold" className="w-5 h-5" />
              )}
              Entrar com Google
            </Button>

            {/* Separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-sm text-muted-foreground">ou</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {!showMagicLink ? (
              <button
                onClick={() => setShowMagicLink(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Prefiro usar outro email
              </button>
            ) : magicLinkSent ? (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <EnvelopeSimple weight="thin" className="w-5 h-5" />
                  <span className="text-sm font-medium">Link enviado!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link para <strong className="text-foreground">{magicEmail}</strong>. Verifique sua caixa de entrada.
                </p>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-200">
                <Input
                  type="email"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="text-center"
                  autoFocus
                />
                <Button
                  onClick={handleMagicLink}
                  disabled={!magicEmail.includes('@') || sendingMagicLink}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {sendingMagicLink ? (
                    <Spinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <EnvelopeSimple weight="thin" className="w-4 h-4" />
                  )}
                  Enviar link de acesso
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Personal data + LGPD */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-2xl font-light tracking-tight text-foreground">
              Vamos nos conhecer?
            </h1>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm text-foreground/80">Nome</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    // Auto-fill nickname if user hasn't manually changed it
                    if (nickname === '' || nickname === firstName) {
                      setNickname(e.target.value);
                    }
                  }}
                  placeholder="Seu nome"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm text-foreground/80">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Seu sobrenome"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="nickname" className="text-sm text-foreground/80">Como quer ser chamada?</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Seu apelido"
                />
                <p className="text-xs text-muted-foreground">É assim que a Monna vai te chamar 🤍</p>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(c) => setTermsAccepted(c === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-sm leading-snug text-foreground/80 cursor-pointer">
                  Li e aceito os{' '}
                  <a
                    href="/static/termos.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:text-primary/80"
                  >
                    Termos de Uso
                  </a>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(c) => setPrivacyAccepted(c === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="privacy" className="text-sm leading-snug text-foreground/80 cursor-pointer">
                  Li e aceito a{' '}
                  <a
                    href="/static/privacidade.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:text-primary/80"
                  >
                    Política de Privacidade
                  </a>
                </Label>
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              disabled={!canContinueStep2 || savingProfile}
              className="w-full"
              size="lg"
            >
              {savingProfile ? <Spinner className="w-5 h-5 animate-spin" /> : 'Continuar'}
            </Button>
          </div>
        )}

        {/* Step 3 — Done (CRITICAL: releases app access) */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Prontinho{displayNickname ? `, ${displayNickname}` : ''}! 💛
            </h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Vai lá no WhatsApp que a Monna já te mandou uma mensagem.
            </p>
            <p className="text-sm text-muted-foreground">
              Se a mensagem ainda não chegou, aguarde alguns segundinhos.
            </p>
            <Button
              onClick={async () => {
                await refetch();
                setTimeout(() => { window.location.href = '/home'; }, 2000);
              }}
              disabled={!appReady}
              className="w-full"
              size="lg"
            >
              {appReady ? 'Ir para o aplicativo' : (
                <span className="flex items-center gap-2">
                  <Spinner className="w-4 h-4 animate-spin" />
                  Preparando...
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
