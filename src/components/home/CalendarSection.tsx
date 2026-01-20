import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarBlank, GoogleLogo, Spinner } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { HomeSection } from './HomeSection';
import { AddEventDialog } from '@/components/agenda/AddEventDialog';
import { useGoogleCalendarOAuth } from '@/hooks/useGoogleCalendarOAuth';
import type { CalendarConnection } from '@/hooks/useCalendarConnections';
import type { CalendarEvent } from '@/hooks/useTodayCalendarEvents';

interface CalendarSectionProps {
  connection: CalendarConnection | null | undefined;
  events: CalendarEvent[];
  isLoading?: boolean;
}

export function CalendarSection({ connection, events, isLoading }: CalendarSectionProps) {
  const navigate = useNavigate();
  const { initiateCalendarOAuth, isConnecting } = useGoogleCalendarOAuth();
  const isConnected = connection?.status === 'connected';
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Estado: Desconectado
  if (!isConnected) {
    return (
      <HomeSection
        icon={<CalendarBlank weight="regular" className="h-4 w-4" />}
        title="Agenda do dia"
        onAdd={() => {}}
        addDisabled
        addDisabledLabel="Conecte o Google Calendar primeiro"
        emptyState={
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Conecte sua agenda para ver seus compromissos aqui
            </p>
            <Button
              size="sm"
              onClick={initiateCalendarOAuth}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Spinner weight="regular" className="h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <GoogleLogo weight="regular" className="h-4 w-4" />
                  Conectar Google Calendar
                </>
              )}
            </Button>
          </div>
        }
      >
        <div />
      </HomeSection>
    );
  }

  // Estado: Conectado sem eventos
  if (events.length === 0) {
    return (
      <>
        <HomeSection
          icon={<CalendarBlank weight="regular" className="h-4 w-4" />}
          title="Agenda do dia"
          onAdd={() => setShowAddDialog(true)}
          emptyState={
            <p className="text-sm text-muted-foreground">
              Seu dia está livre. Momento perfeito para o que importa.
            </p>
          }
        >
          <div />
        </HomeSection>
        
        <AddEventDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog}
          defaultDate={new Date()}
        />
      </>
    );
  }

  // Estado: Conectado com eventos
  return (
    <>
      <HomeSection
        icon={<CalendarBlank weight="regular" className="h-4 w-4" />}
        title="Agenda do dia"
        count={events.length}
        onAdd={() => setShowAddDialog(true)}
        onViewAll={() => navigate('/agenda')}
        viewAllLabel="Ver agenda"
      >
        <div className="space-y-2">
          {events.slice(0, 4).map((event) => (
            <div 
              key={event.id}
              className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0"
            >
              <span className="text-xs font-medium text-primary w-12">
                {format(new Date(event.starts_at), 'HH:mm', { locale: ptBR })}
              </span>
              <span className="text-sm text-foreground truncate flex-1">
                {event.title || 'Evento sem título'}
              </span>
            </div>
          ))}
        </div>
      </HomeSection>

      <AddEventDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        defaultDate={new Date()}
      />
    </>
  );
}
