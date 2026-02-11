import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SignOut } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, profile, profileLoading, profileError, forceLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFallback, setShowFallback] = useState(false);

  const hasOAuthHash = location.hash.includes('access_token') || 
                       location.hash.includes('refresh_token') ||
                       location.hash.includes('error=');

  useEffect(() => {
    if (hasOAuthHash && user) {
      window.history.replaceState(null, '', location.pathname);
    }
  }, [hasOAuthHash, user, location.pathname]);

  useEffect(() => {
    if (!loading) {
      setShowFallback(false);
      return;
    }
    const timeout = hasOAuthHash ? 10000 : 3000;
    const timeoutId = setTimeout(() => {
      if (loading) setShowFallback(true);
    }, timeout);
    return () => clearTimeout(timeoutId);
  }, [loading, hasOAuthHash]);

  // OAuth hash being processed
  if (hasOAuthHash && !user && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Finalizando login...
          </p>
        </div>
      </div>
    );
  }

  // OAuth hash but no session after loading
  if (hasOAuthHash && !user && !loading) {
    window.history.replaceState(null, '', location.pathname);
  }

  // Profile auth error
  if (profileError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-muted-foreground text-center">
          Sua sessão expirou ou houve um erro de autenticação.
        </p>
        <Button
          onClick={() => {
            forceLogout();
            navigate('/auth', { replace: true });
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <SignOut weight="regular" className="w-4 h-4" />
          Entrar novamente
        </Button>
      </div>
    );
  }

  // Auth loading
  if (loading) {
    if (showFallback) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
          <p className="text-muted-foreground text-center">
            Algo deu errado ao carregar sua sessão.
          </p>
          <Button
            onClick={() => {
              forceLogout();
              navigate('/auth', { replace: true });
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <SignOut weight="regular" className="w-4 h-4" />
            Entrar novamente
          </Button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // No user → login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Intercept onboarding redirect after OAuth login (sessionStorage flag)
  const onboardingRedirect = sessionStorage.getItem('onboarding_redirect');
  if (onboardingRedirect) {
    sessionStorage.removeItem('onboarding_redirect');
    return <Navigate to="/bem-vinda" replace />;
  }

  // Wait for profile to load before checking onboarding
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // Onboarding not completed → redirect to wizard
  if (!profile?.onboarding_completed) {
    return <Navigate to="/bem-vinda" replace />;
  }

  // Subscription check — only after onboarding is done
  return <SubscriptionGate>{children}</SubscriptionGate>;
}

function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['subscription-check', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .maybeSingle();
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!subLoading && !subscription) {
      toast.error('Você precisa de uma assinatura ativa para acessar o app.');
      navigate('/#planos', { replace: true });
    }
  }, [subLoading, subscription, navigate]);

  if (subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  return <>{children}</>;
}
