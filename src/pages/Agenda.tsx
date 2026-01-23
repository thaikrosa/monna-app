import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus } from '@phosphor-icons/react';
import { StripCalendar } from '@/components/agenda/StripCalendar';
import { EventCard } from '@/components/agenda/EventCard';
import { AgendaEmptyState } from '@/components/agenda/AgendaEmptyState';
import { AddEventDialog } from '@/components/agenda/AddEventDialog';
import { useCalendarEventsByDate } from '@/hooks/useCalendarEventsByDate';
import { useGoogleCalendarConnection } from '@/hooks/useCalendarConnections';
import { Skeleton } from '@/components/ui/skeleton';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { data: events = [], isLoading } = useCalendarEventsByDate(selectedDate);
  const { isConnected } = useGoogleCalendarConnection();

  const formatEventTime = (startsAt: string, isAllDay: boolean) => {
    if (isAllDay) return 'Dia todo';
    return new Date(startsAt).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatEndTime = (endsAt: string | null, isAllDay: boolean) => {
    if (isAllDay || !endsAt) return undefined;
    return new Date(endsAt).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-6">
      {/* Strip Calendar */}
      <div className="animate-slide-up stagger-1 bg-card border border-border shadow-elevated rounded-lg p-4">
        <StripCalendar
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />
      </div>

      {/* Selected date label */}
      <div className="animate-slide-up stagger-2">
        <p className="text-sm text-primary/80 capitalize">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Event List */}
      <div className="animate-slide-up stagger-3 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </>
        ) : events.length === 0 ? (
          <AgendaEmptyState />
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              startTime={formatEventTime(event.starts_at, event.is_all_day)}
              endTime={formatEndTime(event.ends_at, event.is_all_day)}
              title={event.title || 'Evento sem título'}
              isAllDay={event.is_all_day}
            />
          ))
        )}
      </div>

      {/* FAB flutuante */}
      <button
        onClick={() => setShowAddDialog(true)}
        disabled={!isConnected}
        aria-label="Adicionar evento"
        className="
          fixed bottom-20 right-4 z-40
          floating-button
          shadow-lg
          transition-transform duration-200
          hover:scale-110
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        "
      >
        <Plus weight="regular" className="h-6 w-6" />
      </button>

      {/* Add Event Dialog */}
      <AddEventDialog
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        defaultDate={selectedDate}
      />
    </div>
  );
}
