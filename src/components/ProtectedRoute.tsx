import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SignOut } from '@phosphor-icons/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, profileError, forceLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFallback, setShowFallback] = useState(false);

  // Detecta se há token OAuth no hash (ainda processando callback)
  const hasOAuthHash = location.hash.includes('access_token') || 
                       location.hash.includes('error=');

  useEffect(() => {
    // Reset fallback when loading changes
    if (!loading) {
      setShowFallback(false);
      return;
    }

    // Se há hash OAuth, dar mais tempo para processar (8 segundos)
    // Caso contrário, 3 segundos
    const timeout = hasOAuthHash ? 8000 : 3000;
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        setShowFallback(true);
      }
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [loading, hasOAuthHash]);

  // Fallback para erro de profile (401/403)
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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
