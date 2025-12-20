import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[AuthContext] Error fetching profile for user:', userId, error);
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
    let profileData = await fetchProfile(authUser.id);
    
    if (!profileData) {
      profileData = await createProfile(authUser);
    }
    
    setProfile(profileData);
  }, [fetchProfile, createProfile]);

  const clearAllState = useCallback(() => {
    setUser(null);
    setSession(null);
    setProfile(null);
    // Clear all React Query cache to prevent stale data across users
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        console.log('[AuthContext] Auth state change:', event);

        // On sign out or token refresh fail, clear everything
        if (event === 'SIGNED_OUT') {
          clearAllState();
          setLoading(false);
          return;
        }

        // Update session and user
        setSession(newSession);
        const newUser = newSession?.user ?? null;
        
        // If user changed, clear profile first to avoid showing stale data
        if (newUser?.id !== user?.id) {
          setProfile(null);
        }
        
        setUser(newUser);
        
        // Load profile for new user
        if (newUser) {
          await loadProfile(newUser);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      if (!isMounted) return;
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        await loadProfile(existingSession.user);
      }
      
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile, clearAllState, user?.id]);

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
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[AuthContext] Error signing out:', error);
      throw error;
    }
    
    // State will be cleared by onAuthStateChange handler
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
