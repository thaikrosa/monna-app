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
  // TEMPORARY: bypass guard for preview testing (remove when done)
  return <>{children}</>;
}
