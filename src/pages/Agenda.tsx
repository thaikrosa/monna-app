import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StripCalendar } from '@/components/agenda/StripCalendar';
import { EventCard } from '@/components/agenda/EventCard';
import { AgendaEmptyState } from '@/components/agenda/AgendaEmptyState';
import { useCalendarEventsByDate } from '@/hooks/useCalendarEventsByDate';
import { Skeleton } from '@/components/ui/skeleton';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const { data: events = [], isLoading } = useCalendarEventsByDate(selectedDate);

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
    <div className="max-w-2xl mx-auto pb-4 space-y-6">
      {/* Strip Calendar */}
      <div className="animate-slide-up stagger-1">
        <StripCalendar 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />
      </div>

      {/* Selected date label */}
      <div className="animate-slide-up stagger-2">
        <p className="text-sm text-muted-foreground capitalize">
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
    </div>
  );
}
