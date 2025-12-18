import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNeedsKickstart } from '@/hooks/useOnboarding';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { needsKickstart, isLoading: kickstartLoading } = useNeedsKickstart();
  const location = useLocation();

  if (loading || kickstartLoading) {
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

  // Redirect to kickstart if needed and not already on kickstart page
  if (needsKickstart && location.pathname !== '/kickstart') {
    return <Navigate to="/kickstart" replace />;
  }

  return <>{children}</>;
}
