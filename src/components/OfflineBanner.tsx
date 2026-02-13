import { WifiSlash } from '@phosphor-icons/react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="bg-warning text-warning-foreground px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2"
    >
      <WifiSlash weight="regular" className="h-4 w-4 flex-shrink-0" />
      <span>Sem conexão com a internet</span>
    </div>
  );
}
