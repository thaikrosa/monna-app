import { useReducer, useCallback, useRef, useEffect } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';

export type WizardStep = 1 | 2 | 3;

export interface OnboardingFormData {
  firstName: string;
  lastName: string;
  nickname: string;
  whatsappDigits: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

interface OnboardingState {
  step: WizardStep | null;
  initializing: boolean;
  formData: OnboardingFormData;
  displayNickname: string;
  appReady: boolean;
  // Step 1 states
  signingIn: boolean;
  showMagicLink: boolean;
  magicEmail: string;
  magicLinkSent: boolean;
  sendingMagicLink: boolean;
  // Step 2 states
  savingProfile: boolean;
  whatsappTouched: boolean;
}

type OnboardingAction =
  | { type: 'SET_STEP'; payload: WizardStep | null }
  | { type: 'SET_INITIALIZING'; payload: boolean }
  | { type: 'SET_FORM_DATA'; payload: Partial<OnboardingFormData> }
  | { type: 'SET_DISPLAY_NICKNAME'; payload: string }
  | { type: 'SET_APP_READY'; payload: boolean }
  | { type: 'SET_SIGNING_IN'; payload: boolean }
  | { type: 'SET_SHOW_MAGIC_LINK'; payload: boolean }
  | { type: 'SET_MAGIC_EMAIL'; payload: string }
  | { type: 'SET_MAGIC_LINK_SENT'; payload: boolean }
  | { type: 'SET_SENDING_MAGIC_LINK'; payload: boolean }
  | { type: 'SET_SAVING_PROFILE'; payload: boolean }
  | { type: 'SET_WHATSAPP_TOUCHED'; payload: boolean }
  | { type: 'PREFILL_FROM_PROFILE'; payload: { firstName: string; lastName: string; nickname: string; whatsapp?: string } };

const initialFormData: OnboardingFormData = {
  firstName: '',
  lastName: '',
  nickname: '',
  whatsappDigits: '',
  termsAccepted: false,
  privacyAccepted: false,
};

const initialState: OnboardingState = {
  step: null,
  initializing: true,
  formData: initialFormData,
  displayNickname: '',
  appReady: false,
  signingIn: false,
  showMagicLink: false,
  magicEmail: '',
  magicLinkSent: false,
  sendingMagicLink: false,
  savingProfile: false,
  whatsappTouched: false,
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_INITIALIZING':
      return { ...state, initializing: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_DISPLAY_NICKNAME':
      return { ...state, displayNickname: action.payload };
    case 'SET_APP_READY':
      return { ...state, appReady: action.payload };
    case 'SET_SIGNING_IN':
      return { ...state, signingIn: action.payload };
    case 'SET_SHOW_MAGIC_LINK':
      return { ...state, showMagicLink: action.payload };
    case 'SET_MAGIC_EMAIL':
      return { ...state, magicEmail: action.payload };
    case 'SET_MAGIC_LINK_SENT':
      return { ...state, magicLinkSent: action.payload };
    case 'SET_SENDING_MAGIC_LINK':
      return { ...state, sendingMagicLink: action.payload };
    case 'SET_SAVING_PROFILE':
      return { ...state, savingProfile: action.payload };
    case 'SET_WHATSAPP_TOUCHED':
      return { ...state, whatsappTouched: action.payload };
    case 'PREFILL_FROM_PROFILE': {
      const { firstName, lastName, nickname, whatsapp } = action.payload;
      const whatsappDigits = whatsapp?.startsWith('55') ? whatsapp.slice(2) : (whatsapp || '');
      return {
        ...state,
        formData: {
          ...state.formData,
          firstName,
          lastName,
          nickname: nickname || firstName,
          whatsappDigits,
        },
        displayNickname: nickname || firstName,
      };
    }
    default:
      return state;
  }
}

export function formatWhatsApp(digits: string): string {
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidWhatsApp(digits: string): boolean {
  return digits.length === 11 && /^[1-9][1-9]9\d{8}$/.test(digits);
}

export function useOnboardingWizard() {
  const { user, session, isReady, refetch } = useSession();
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const prevUserRef = useRef<string | null | undefined>(undefined);
  const triggerRef = useRef(false);

  const calculateStep = useCallback(async (userId: string): Promise<WizardStep | null> => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('nickname, terms_accepted_at, privacy_accepted_at, first_name, last_name, onboarding_completed, whatsapp')
      .eq('id', userId)
      .maybeSingle();

    if (profileData?.onboarding_completed) {
      return null;
    }

    if (!profileData?.terms_accepted_at || !profileData?.privacy_accepted_at) {
      dispatch({
        type: 'PREFILL_FROM_PROFILE',
        payload: {
          firstName: profileData?.first_name || '',
          lastName: profileData?.last_name || '',
          nickname: profileData?.nickname || profileData?.first_name || '',
          whatsapp: profileData?.whatsapp,
        },
      });
      return 2;
    }

    dispatch({ type: 'SET_DISPLAY_NICKNAME', payload: profileData.nickname || profileData.first_name || '' });
    return 3;
  }, []);

  // Initialize step + auto-advance when user logs in
  useEffect(() => {
    if (!isReady) return;

    const init = async () => {
      if (!user) {
        dispatch({ type: 'SET_STEP', payload: 1 });
        dispatch({ type: 'SET_INITIALIZING', payload: false });
        prevUserRef.current = null;
        return;
      }

      const justLoggedIn = prevUserRef.current === null && user.id;
      if (justLoggedIn) {
        dispatch({ type: 'SET_INITIALIZING', payload: true });
      }
      prevUserRef.current = user.id;

      const computed = await calculateStep(user.id);
      if (computed === null) {
        return;
      }
      dispatch({ type: 'SET_STEP', payload: computed });
      dispatch({ type: 'SET_INITIALIZING', payload: false });
    };

    init();
  }, [isReady, user, calculateStep]);

  // Step 3 - release app access + trigger WhatsApp
  useEffect(() => {
    if (state.step !== 3 || triggerRef.current || !session) return;
    triggerRef.current = true;

    const setupAndRelease = async () => {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) {
        setTimeout(async () => {
          await supabase
            .from('profiles')
            .update({
              onboarding_completed: true,
              onboarding_completed_at: new Date().toISOString(),
            })
            .eq('id', session.user.id);
        }, 2000);
      }

      dispatch({ type: 'SET_APP_READY', payload: true });

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
          });
        }
      } catch {
        // Silently fail
      }
    };

    setupAndRelease();
  }, [state.step, session]);

  // Actions
  const handleGoogleLogin = useCallback(async () => {
    dispatch({ type: 'SET_SIGNING_IN', payload: true });
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
      dispatch({ type: 'SET_SIGNING_IN', payload: false });
    }
  }, []);

  const handleMagicLink = useCallback(async () => {
    dispatch({ type: 'SET_SENDING_MAGIC_LINK', payload: true });
    const { error } = await supabase.auth.signInWithOtp({
      email: state.magicEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/bem-vinda`,
      },
    });
    if (!error) {
      dispatch({ type: 'SET_MAGIC_LINK_SENT', payload: true });
    }
    dispatch({ type: 'SET_SENDING_MAGIC_LINK', payload: false });
  }, [state.magicEmail]);

  const handleSaveProfile = useCallback(async (data?: {
    firstName: string;
    lastName: string;
    nickname: string;
    whatsappDigits: string;
  }) => {
    if (!user) return;
    dispatch({ type: 'SET_SAVING_PROFILE', payload: true });
    const formValues = data || state.formData;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formValues.firstName,
          last_name: formValues.lastName,
          nickname: formValues.nickname,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted_at: new Date().toISOString(),
          whatsapp: `55${formValues.whatsappDigits}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) return;

      dispatch({ type: 'SET_DISPLAY_NICKNAME', payload: formValues.nickname });
      dispatch({ type: 'SET_STEP', payload: 3 });
    } finally {
      dispatch({ type: 'SET_SAVING_PROFILE', payload: false });
    }
  }, [user, state.formData]);

  const handleGoToApp = useCallback(async () => {
    await refetch();
    setTimeout(() => { window.location.href = '/home'; }, 2000);
  }, [refetch]);

  const updateFormField = useCallback(<K extends keyof OnboardingFormData>(
    field: K,
    value: OnboardingFormData[K]
  ) => {
    dispatch({ type: 'SET_FORM_DATA', payload: { [field]: value } });
  }, []);

  const setMagicEmail = useCallback((email: string) => {
    dispatch({ type: 'SET_MAGIC_EMAIL', payload: email });
  }, []);

  const setShowMagicLink = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_MAGIC_LINK', payload: show });
  }, []);

  const setWhatsappTouched = useCallback((touched: boolean) => {
    dispatch({ type: 'SET_WHATSAPP_TOUCHED', payload: touched });
  }, []);

  const canContinueStep2 =
    state.formData.firstName.trim().length >= 2 &&
    state.formData.lastName.trim().length >= 2 &&
    state.formData.nickname.trim().length >= 2 &&
    isValidWhatsApp(state.formData.whatsappDigits) &&
    state.formData.termsAccepted &&
    state.formData.privacyAccepted;

  return {
    // State
    step: state.step,
    initializing: state.initializing,
    formData: state.formData,
    displayNickname: state.displayNickname,
    appReady: state.appReady,
    signingIn: state.signingIn,
    showMagicLink: state.showMagicLink,
    magicEmail: state.magicEmail,
    magicLinkSent: state.magicLinkSent,
    sendingMagicLink: state.sendingMagicLink,
    savingProfile: state.savingProfile,
    whatsappTouched: state.whatsappTouched,
    canContinueStep2,
    isReady,
    // Actions
    handleGoogleLogin,
    handleMagicLink,
    handleSaveProfile,
    handleGoToApp,
    updateFormField,
    setMagicEmail,
    setShowMagicLink,
    setWhatsappTouched,
  };
}
