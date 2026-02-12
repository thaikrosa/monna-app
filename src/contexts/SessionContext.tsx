import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// ── Types ──────────────────────────────────────────────────────

export type UserState = 'LOADING' | 'ERROR' | 'ANONYMOUS' | 'NO_SUBSCRIPTION' | 'ONBOARDING' | 'READY';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  onboarding_completed: boolean | null;
  onboarding_completed_at: string | null;
  terms_accepted_at: string | null;
  privacy_accepted_at: string | null;
  timezone: string | null;
  communication_style: string | null;
  checkin_morning_enabled: boolean | null;
  checkin_morning_time: string | null;
  checkin_evening_enabled: boolean | null;
  checkin_evening_time: string | null;
  proactive_suggestions_enabled: boolean | null;
  inventory_alerts_enabled: boolean | null;
  city: string | null;
  state: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Subscription {
  user_id: string;
  status: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  started_at: string | null;
}

interface SessionContextType {
  userState: UserState;
  isReady: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

// ── Context ────────────────────────────────────────────────────

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userState, setUserState] = useState<UserState>('LOADING');

  const fetchUserData = useCallback(async (userId: string): Promise<{
    profile: Profile | null;
    subscription: Subscription | null;
  }> => {
    const [profileRes, subRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('subscriptions').select('*').eq('user_id', userId).eq('status', 'active').maybeSingle(),
    ]);

    return {
      profile: (profileRes.data as Profile) ?? null,
      subscription: (subRes.data as Subscription) ?? null,
    };
  }, []);

  const computeState = useCallback((
    sess: Session | null,
    prof: Profile | null,
    sub: Subscription | null,
  ): UserState => {
    if (!sess) return 'ANONYMOUS';
    if (!sub || sub.status !== 'active') return 'NO_SUBSCRIPTION';
    if (!prof || !prof.onboarding_completed) return 'ONBOARDING';
    return 'READY';
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (cancelled) return;

        if (!currentSession) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setSubscription(null);
          setUserState('ANONYMOUS');
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);

        const { profile: prof, subscription: sub } = await fetchUserData(currentSession.user.id);

        if (cancelled) return;

        setProfile(prof);
        setSubscription(sub);
        setUserState(computeState(currentSession, prof, sub));
      } catch (error) {
        console.error('[Session] Initialization error:', error);
        if (!cancelled) {
          setUserState('ERROR');
        }
      }
    }

    initialize();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (cancelled) return;

        if (!newSession) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setSubscription(null);
          setUserState('ANONYMOUS');
          return;
        }

        setSession(newSession);
        setUser(newSession.user);

        try {
          const { profile: prof, subscription: sub } = await fetchUserData(newSession.user.id);
          if (cancelled) return;
          setProfile(prof);
          setSubscription(sub);
          setUserState(computeState(newSession, prof, sub));
        } catch (error) {
          console.error('[Session] Auth change error:', error);
        }
      }
    );

    return () => {
      cancelled = true;
      authListener.unsubscribe();
    };
  }, [fetchUserData, computeState]);

  const refetch = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const { profile: prof, subscription: sub } = await fetchUserData(session.user.id);
      setProfile(prof);
      setSubscription(sub);
      setUserState(computeState(session, prof, sub));
    } catch (error) {
      console.error('[Session] Refetch error:', error);
    }
  }, [session, fetchUserData, computeState]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setSubscription(null);
    setUserState('ANONYMOUS');
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
    if (error) throw error;
  }, []);

  const value: SessionContextType = {
    userState,
    isReady: userState !== 'LOADING',
    session,
    user,
    profile,
    subscription,
    refetch,
    signOut,
    signInWithGoogle,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
