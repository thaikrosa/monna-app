import { CalendarBlank, ArrowSquareOut } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CalendarConnection } from '@/hooks/useCalendarConnections';
import type { CalendarEvent } from '@/hooks/useTodayCalendarEvents';

interface CalendarSectionProps {
  connection: CalendarConnection | null | undefined;
  events: CalendarEvent[];
  isLoading?: boolean;
}

export function CalendarSection({ connection, events, isLoading }: CalendarSectionProps) {
  const isConnected = connection?.status === 'connected';

  // Estado: Desconectado
  if (!isConnected) {
    return (
      <div className="annia-glass rounded-2xl p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
            <CalendarBlank weight="thin" className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Agenda do dia</p>
            <p className="text-xs text-muted-foreground mt-1">
              Conecte sua agenda para ver seus compromissos aqui
            </p>
            
            <Button
              variant="outline"
              size="sm"
              className="mt-3 opacity-50 cursor-not-allowed"
              disabled
            >
              Em breve
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Conectado sem eventos
  if (events.length === 0) {
    return (
      <div className="annia-glass rounded-2xl p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CalendarBlank weight="thin" className="h-4 w-4 text-primary" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Agenda do dia</p>
            <p className="text-xs text-muted-foreground mt-1">
              Seu dia está livre. Momento perfeito para o que importa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Conectado com eventos
  return (
    <div className="annia-glass rounded-2xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarBlank weight="thin" className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Agenda do dia</p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground h-auto py-1"
          asChild
        >
          <a 
            href="https://calendar.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            Ver agenda completa
            <ArrowSquareOut weight="thin" className="h-3 w-3" />
          </a>
        </Button>
      </div>

      <div className="space-y-2">
        {events.slice(0, 4).map((event) => (
          <div 
            key={event.id}
            className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
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
    </div>
  );
}
