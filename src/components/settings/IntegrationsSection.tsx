import { GoogleLogo, Check, Warning, Spinner } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useGoogleCalendarConnection } from '@/hooks/useCalendarConnections';
import { useGoogleCalendarOAuth } from '@/hooks/useGoogleCalendarOAuth';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function IntegrationsSection() {
  const { data: googleConnection, isConnected } = useGoogleCalendarConnection();
  const { initiateCalendarOAuth, isConnecting } = useGoogleCalendarOAuth();

  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-1">
        Conexões
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Integrações para facilitar sua rotina
      </p>

      <div className="annia-glass p-4 rounded-lg border border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoogleLogo weight="thin" className="h-5 w-5 text-primary" />
            <div>
              <p className="text-foreground text-sm font-medium">Google Calendar</p>
              {isConnected && googleConnection?.last_synced_at && (
                <p className="text-xs text-muted-foreground">
                  Sincronizado {formatDistanceToNow(parseISO(googleConnection.last_synced_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              )}
            </div>
          </div>
          {isConnected ? (
            <div className="flex items-center gap-1 text-primary">
              <Check weight="thin" className="h-4 w-4" />
              <span className="text-xs">Conectado</span>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={initiateCalendarOAuth}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Spinner className="h-4 w-4 mr-1 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar'
              )}
            </Button>
          )}
        </div>
        {googleConnection?.last_error && (
          <div className="mt-2 flex items-center gap-1 text-destructive text-xs">
            <Warning weight="thin" className="h-3 w-3" />
            <span>Erro na última sincronização</span>
          </div>
        )}
      </div>
    </section>
  );
}
