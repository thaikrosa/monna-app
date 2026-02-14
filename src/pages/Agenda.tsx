import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { StripCalendar } from '@/components/agenda/StripCalendar';
import { EventCard } from '@/components/agenda/EventCard';
import { AgendaEmptyState } from '@/components/agenda/AgendaEmptyState';
import { AddEventDialog } from '@/components/agenda/AddEventDialog';
import { EditEventDialog } from '@/components/agenda/EditEventDialog';
import { DeleteEventAlert } from '@/components/agenda/DeleteEventAlert';
import { useCalendarEventsByDate } from '@/hooks/useCalendarEventsByDate';
import { useGoogleCalendarConnection } from '@/hooks/useCalendarConnections';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import type { AgendaEvent } from '@/hooks/useTodayCalendarEvents';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<AgendaEvent | null>(null);

  const { data: events = [], isLoading, isError, refetch } = useCalendarEventsByDate(selectedDate);
  const { isConnected } = useGoogleCalendarConnection();

  const formatEventTime = (startsAt: string, isAllDay: boolean) => {
    if (isAllDay) return 'Dia todo';
    return new Date(startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatEndTime = (endsAt: string | null, isAllDay: boolean) => {
    if (isAllDay || !endsAt) return undefined;
    return new Date(endsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-6">
      <header className="animate-slide-up stagger-1">
        <h1 className="sr-only">Agenda</h1>
        <div className="bg-card border border-border shadow-elevated rounded-lg p-4">
          <StripCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>
      </header>

      <section aria-label="Eventos do dia" className="animate-slide-up stagger-2 space-y-3">
        {isLoading ? (
          <div aria-busy="true">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : isError ? (
          <ErrorState
            message="Erro ao carregar eventos"
            onRetry={() => refetch()}
          />
        ) : events.length === 0 ? (
          <AgendaEmptyState />
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.instance_id}>
                <EventCard
                  startTime={formatEventTime(event.starts_at, event.is_all_day)}
                  endTime={formatEndTime(event.ends_at, event.is_all_day)}
                  title={event.title || 'Evento sem título'}
                  isAllDay={event.is_all_day}
                  onClick={() => setSelectedEvent(event)}
                  onEdit={() => setSelectedEvent(event)}
                  onDelete={() => setDeletingEvent(event)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        onClick={() => setShowAddDialog(true)}
        disabled={!isConnected}
        aria-label="Adicionar evento"
        className="
          fixed bottom-20 right-4 z-40
          floating-button shadow-lg
          transition-transform duration-200
          hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        "
      >
        <Plus weight="regular" className="h-6 w-6" />
      </button>

      <AddEventDialog open={showAddDialog} onOpenChange={setShowAddDialog} defaultDate={selectedDate} />
      <EditEventDialog
        open={!!selectedEvent}
        onOpenChange={(open) => { if (!open) setSelectedEvent(null); }}
        event={selectedEvent}
      />

      {deletingEvent && (
        <DeleteEventAlert
          open={!!deletingEvent}
          onOpenChange={(open) => { if (!open) setDeletingEvent(null); }}
          eventId={deletingEvent.event_id}
          instanceId={deletingEvent.instance_id}
          isRecurring={deletingEvent.is_recurring}
          title={deletingEvent.title || 'Evento sem título'}
          onDeleted={() => setDeletingEvent(null)}
        />
      )}
    </div>
  );
}
