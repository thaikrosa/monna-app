import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGoogleCalendarOAuth } from '@/hooks/useGoogleCalendarOAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check, GoogleLogo, CalendarBlank, ArrowsClockwise, Lock, Spinner } from '@phosphor-icons/react';
import logoMonna from '@/assets/logo-monna.png';

type WizardStep = 1 | 2 | 3 | 4;

function StepIndicator({ currentStep }: { currentStep: WizardStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {([1, 2, 3, 4] as const).map((step, i) => (
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
          {i < 3 && (
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
  const { user, session, profile, signInWithGoogle, loading: authLoading } = useAuth();
  const { initiateCalendarOAuth } = useGoogleCalendarOAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<WizardStep | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Step 2 state
  const [nickname, setNickname] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Step 4 state
  const [displayNickname, setDisplayNickname] = useState('');
  const triggerRef = useRef(false);

  // Login state
  const [signingIn, setSigningIn] = useState(false);

  // Track if user just logged in (was null, now has value)
  const prevUserRef = useRef<string | null | undefined>(undefined);

  // Redirect to /home if onboarding already completed
  useEffect(() => {
    if (!authLoading && user && profile?.onboarding_completed) {
      navigate('/home', { replace: true });
    }
  }, [authLoading, user, profile, navigate]);

  const calculateStep = useCallback(async (userId: string) => {
    // Fetch profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('nickname, terms_accepted_at, privacy_accepted_at, first_name')
      .eq('id', userId)
      .maybeSingle();

    // Check LGPD acceptance
    if (!profileData?.terms_accepted_at || !profileData?.privacy_accepted_at) {
      // Pre-fill nickname
      const defaultNick = profileData?.nickname || profileData?.first_name || '';
      setNickname(defaultNick);
      setDisplayNickname(defaultNick);
      return 2 as WizardStep;
    }

    setDisplayNickname(profileData.nickname || profileData.first_name || '');

    // Check Google Calendar connection
    const { count } = await supabase
      .from('google_oauth_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (!count || count === 0) {
      return 3 as WizardStep;
    }

    return 4 as WizardStep;
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
      setStep(computed);
      setInitializing(false);
    };

    init();
  }, [authLoading, user, calculateStep]);

  // Auto-advance from Step 1 when user logs in
  useEffect(() => {
    if (prevUserRef.current === undefined) {
      prevUserRef.current = user?.id ?? null;
      return;
    }

    if (prevUserRef.current === null && user?.id) {
      // User just logged in — recalculate
      prevUserRef.current = user.id;
      setInitializing(true);
      calculateStep(user.id).then((computed) => {
        setStep(computed);
        setInitializing(false);
      });
    } else {
      prevUserRef.current = user?.id ?? null;
    }
  }, [user, calculateStep]);

  // Step 1 — Login
  const handleGoogleLogin = async () => {
    setSigningIn(true);
    try {
      sessionStorage.setItem('onboarding_redirect', 'true');
      await signInWithGoogle();
    } catch {
      setSigningIn(false);
    }
  };

  // Step 2 — Save profile
  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await supabase
        .from('profiles')
        .update({
          nickname,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      setDisplayNickname(nickname);

      // Check if calendar is connected to decide next step
      const { count } = await supabase
        .from('google_oauth_tokens')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setStep(!count || count === 0 ? 3 : 4);
    } catch (err) {
      console.error('[BemVinda] Profile save error:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Step 3 — Calendar
  const handleConnectCalendar = () => {
    sessionStorage.setItem('onboarding_calendar_redirect', 'true');
    initiateCalendarOAuth();
  };

  // Step 4 — Trigger onboarding
  useEffect(() => {
    if (step !== 4 || triggerRef.current || !session) return;
    triggerRef.current = true;

    const trigger = async () => {
      try {
        const { data: onb } = await supabase
          .from('onboarding')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('flow', 'whatsapp')
          .maybeSingle();

        if (onb?.status !== 'pending') return;

        await supabase.functions.invoke('trigger-onboarding', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
      } catch (err) {
        console.error('[Onboarding] trigger failed:', err);
      }
    };

    trigger();
  }, [step, session]);

  // Loading
  if (authLoading || initializing || step === null) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const canContinueStep2 = nickname.trim().length >= 2 && termsAccepted && privacyAccepted;

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <img src={logoMonna} alt="Monna" className="h-10 mx-auto mb-6" />
        <StepIndicator currentStep={step} />

        {/* Step 1 — Login */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Bem-vinda à Monna 💛
            </h1>
            <p className="text-foreground/80 leading-relaxed">
              Faça login para começar sua jornada.
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
          </div>
        )}

        {/* Step 2 — Nickname + LGPD */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-2xl font-light tracking-tight text-foreground">
              Como quer ser chamada?
            </h1>

            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Seu apelido"
              className="text-center text-lg"
              autoFocus
            />

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

        {/* Step 3 — Google Calendar */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-2xl font-light tracking-tight text-foreground">
              Conectar sua agenda Google?
            </h1>

            <div className="space-y-3 text-left">
              {[
                { icon: CalendarBlank, text: 'Veja seus compromissos no app' },
                { icon: ArrowsClockwise, text: 'Crie eventos via WhatsApp' },
                { icon: Lock, text: 'Seus dados ficam seguros' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 rounded-lg bg-card p-3">
                  <Icon weight="thin" className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground/80">{text}</span>
                </div>
              ))}
            </div>

            <Button onClick={handleConnectCalendar} className="w-full" size="lg">
              Conectar Google Calendar
            </Button>
            <button
              onClick={() => setStep(4)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Farei depois
            </button>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
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
          </div>
        )}
      </div>
    </div>
  );
}
