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
  profileError: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forceLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const queryClient = useQueryClient();
  const loadingFinishedRef = useRef(false);

  // Limpa apenas chaves de auth do Supabase (sb-*)
  const clearSupabaseStorage = useCallback(() => {
    const keysToRemove = Object.keys(localStorage).filter(
      key => key.startsWith('sb-')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('[AuthContext] Cleared Supabase storage keys:', keysToRemove.length);
  }, []);

  // Limpa todo o estado de autenticação
  const clearAllState = useCallback(() => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileError(false);
    queryClient.clear();
    clearSupabaseStorage();
    console.log('[AuthContext] Cleared all auth state');
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
      console.error('[AuthContext] Error fetching profile for user:', userId, error);
      // Se for 401/403, é erro de auth
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
      console.error('[AuthContext] Error creating profile:', error);
      return null;
    }

    return data as Profile;
  }, []);

  const loadProfile = useCallback(async (authUser: User) => {
    try {
      setProfileError(false);
      let profileData = await fetchProfile(authUser.id);
      
      if (!profileData) {
        profileData = await createProfile(authUser);
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error('[AuthContext] Failed to load profile:', error);
      
      // Se for erro de auth, marcar para mostrar fallback
      if (error instanceof Error && error.message === 'AUTH_ERROR') {
        setProfileError(true);
      } else {
        // Outros erros: manter user logado sem profile
        setProfile(null);
      }
    }
  }, [fetchProfile, createProfile]);

  useEffect(() => {
    let isMounted = true;
    let initTimeoutId: NodeJS.Timeout | null = null;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        console.log('[AuthContext] Auth state change:', event);

        // On sign out, clear everything
        if (event === 'SIGNED_OUT') {
          clearAllState();
          setLoading(false);
          loadingFinishedRef.current = true;
          return;
        }

        // Update session and user
        setSession(newSession);
        const newUser = newSession?.user ?? null;
        
        // If user changed, clear profile first
        if (newUser?.id !== user?.id) {
          setProfile(null);
          setProfileError(false);
          // Also clear queries for the old user
          if (user?.id) {
            queryClient.clear();
          }
        }
        
        setUser(newUser);
        
        // Load profile for new user
        if (newUser) {
          await loadProfile(newUser);
        }
        
        setLoading(false);
        loadingFinishedRef.current = true;
      }
    );

    // Check for existing session with timeout protection
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      if (!isMounted) return;
      
      // Cancel timeout since we got a response
      if (initTimeoutId) {
        clearTimeout(initTimeoutId);
        initTimeoutId = null;
      }
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        await loadProfile(existingSession.user);
      }
      
      setLoading(false);
      loadingFinishedRef.current = true;
    }).catch((error) => {
      console.error('[AuthContext] Error getting session:', error);
      if (isMounted) {
        clearAllState();
        setLoading(false);
        loadingFinishedRef.current = true;
      }
    });

    // Timeout de segurança: se após 10s ainda estiver loading, limpar tudo
    initTimeoutId = setTimeout(() => {
      if (isMounted && !loadingFinishedRef.current) {
        console.warn('[AuthContext] Session check timeout - clearing state');
        clearAllState();
        setLoading(false);
        loadingFinishedRef.current = true;
      }
    }, 10000);

    return () => {
      isMounted = false;
      if (initTimeoutId) {
        clearTimeout(initTimeoutId);
      }
      subscription.unsubscribe();
    };
  }, [loadProfile, clearAllState, queryClient]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('[AuthContext] Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[AuthContext] Error signing out:', error);
    }
    
    // Sempre limpar, mesmo se signOut falhar
    clearAllState();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      profileError,
      signInWithGoogle, 
      signOut,
      forceLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
