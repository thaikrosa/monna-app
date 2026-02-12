import { Navigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { ErrorScreen } from '@/components/ErrorScreen';

function routeForState(state: string): string {
  switch (state) {
    case 'ANONYMOUS':
    case 'NO_SUBSCRIPTION':
      return '/';
    case 'ONBOARDING':
      return '/bem-vinda';
    case 'READY':
      return '/home';
    default:
      return '/';
  }
}

interface RequireStateProps {
  allowed: string[];
  children: React.ReactNode;
}

export function RequireState({ allowed, children }: RequireStateProps) {
  const { userState, isReady } = useSession();

  if (!isReady) return <FullScreenLoader />;
  if (userState === 'ERROR') return <ErrorScreen onRetry={() => window.location.reload()} />;

  if (!allowed.includes(userState)) {
    return <Navigate to={routeForState(userState)} replace />;
  }

  return <>{children}</>;
}
