import { createContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forceLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper para medir tempo de operações
const timedOperation = async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    if (duration > 500) {
      console.warn(`[Auth] ⚠️ Slow: ${name} took ${duration.toFixed(0)}ms`);
    } else {
      console.log(`[Auth] ✓ ${name}: ${duration.toFixed(0)}ms`);
    }
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Auth] ✗ ${name} failed after ${duration.toFixed(0)}ms`, error);
    throw error;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const queryClient = useQueryClient();
  const loadingFinishedRef = useRef(false);
  const initStartTimeRef = useRef(performance.now());

  // Limpa apenas chaves de auth do Supabase (sb-*)
  const clearSupabaseStorage = useCallback(() => {
    const keysToRemove = Object.keys(localStorage).filter(
      key => key.startsWith('sb-')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
    if (keysToRemove.length > 0) {
      console.log('[Auth] Cleared storage keys:', keysToRemove.length);
    }
  }, []);

  // Limpa todo o estado de autenticação
  const clearAllState = useCallback(() => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileError(false);
    setProfileLoading(false);
    queryClient.clear();
    clearSupabaseStorage();
    console.log('[Auth] State cleared');
  }, [queryClient, clearSupabaseStorage]);

  // Função de emergência para forçar logout
  const forceLogout = useCallback(() => {
    clearAllState();
    setLoading(false);
    loadingFinishedRef.current = true;
  }, [clearAllState]);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Auth] Profile fetch error:', error.code);
      if (error.code === 'PGRST301' || error.message?.includes('401') || error.message?.includes('403')) {
        throw new Error('AUTH_ERROR');
      }
      return null;
    }

    return data as Profile | null;
  }, []);

  const createProfile = useCallback(async (authUser: User): Promise<Profile | null> => {
    const metadata = authUser.user_metadata || {};
    
    const newProfile = {
      id: authUser.id,
      first_name: metadata.full_name?.split(' ')[0] || metadata.name?.split(' ')[0] || null,
      last_name: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.name?.split(' ').slice(1).join(' ') || null,
      avatar_url: metadata.avatar_url || metadata.picture || null,
      nickname: null,
      whatsapp: null,
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error('[Auth] Profile create error:', error.code);
      return null;
    }

    return data as Profile;
  }, []);

  // Carrega profile de forma NÃO bloqueante
  const loadProfile = useCallback(async (authUser: User) => {
    setProfileLoading(true);
    setProfileError(false);
    
    try {
      let profileData = await timedOperation('fetchProfile', () => fetchProfile(authUser.id));
      
      if (!profileData) {
        profileData = await timedOperation('createProfile', () => createProfile(authUser));
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error('[Auth] Profile load failed:', error);
      if (error instanceof Error && error.message === 'AUTH_ERROR') {
        setProfileError(true);
      }
    } finally {
      setProfileLoading(false);
    }
  }, [fetchProfile, createProfile]);

  useEffect(() => {
    let isMounted = true;
    let initTimeoutId: NodeJS.Timeout | null = null;
    let currentUserId: string | null = null;
    let hasProcessedInitialSession = false;

    console.group('[Auth] Initialization');
    console.time('[Auth] Total init');
    initStartTimeRef.current = performance.now();

    // Handler unificado para processar sessão
    const processSession = (event: string, newSession: Session | null) => {
      if (!isMounted) return;

      const elapsed = performance.now() - initStartTimeRef.current;
      console.log(`[Auth] ${event} @ ${elapsed.toFixed(0)}ms`);

      // On sign out, clear everything
      if (event === 'SIGNED_OUT') {
        currentUserId = null;
        clearAllState();
        setLoading(false);
        loadingFinishedRef.current = true;
        return;
      }

      // Update session and user
      setSession(newSession);
      const newUser = newSession?.user ?? null;

      // Se user mudou, limpar profile e queries do antigo
      if (newUser?.id !== currentUserId) {
        setProfile(null);
        setProfileError(false);
        if (currentUserId) {
          queryClient.clear();
        }
        currentUserId = newUser?.id ?? null;
      }

      setUser(newUser);

      // IMPORTANTE: Liberar loading ANTES de carregar profile
      // Isso permite a UI renderizar imediatamente
      if (!loadingFinishedRef.current) {
        setLoading(false);
        loadingFinishedRef.current = true;
        console.timeEnd('[Auth] Total init');
        console.groupEnd();
      }

      // Profile carrega em background (não bloqueia)
      if (newUser) {
        loadProfile(newUser);
      }
    };

    // Set up auth state listener
    console.time('[Auth] Setup listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // INITIAL_SESSION é tratado aqui, então não precisa de getSession().then()
        if (event === 'INITIAL_SESSION') {
          hasProcessedInitialSession = true;
          // Cancelar timeout já que recebemos resposta
          if (initTimeoutId) {
            clearTimeout(initTimeoutId);
            initTimeoutId = null;
          }
        }
        processSession(event, newSession);
      }
    );
    console.timeEnd('[Auth] Setup listener');

    // getSession() apenas para trigger INITIAL_SESSION (sem lógica duplicada)
    console.time('[Auth] getSession call');
    supabase.auth.getSession().then(() => {
      console.timeEnd('[Auth] getSession call');
    }).catch((error) => {
      console.error('[Auth] getSession error:', error);
      console.timeEnd('[Auth] getSession call');
      if (isMounted && !loadingFinishedRef.current) {
        setLoading(false);
        loadingFinishedRef.current = true;
        console.timeEnd('[Auth] Total init');
        console.groupEnd();
      }
    });

    // Timeout de segurança: 5s (reduzido de 10s)
    // NÃO limpa storage - apenas para de esperar
    initTimeoutId = setTimeout(() => {
      if (isMounted && !loadingFinishedRef.current) {
        console.warn('[Auth] ⚠️ Session check timeout (5s) - showing login');
        // NÃO limpar storage, apenas liberar UI
        setLoading(false);
        loadingFinishedRef.current = true;
        console.timeEnd('[Auth] Total init');
        console.groupEnd();
      }
    }, 5000);

    return () => {
      isMounted = false;
      if (initTimeoutId) {
        clearTimeout(initTimeoutId);
      }
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    // Usar o domínio atual como redirect (funciona em preview e produção)
    const redirectUrl = window.location.origin;
    console.log('[Auth] Redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('[Auth] Google sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
    }
    clearAllState();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading,
      profileLoading,
      profileError,
      signInWithGoogle, 
      signOut,
      forceLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
