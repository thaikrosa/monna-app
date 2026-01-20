import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <div className="max-w-2xl mx-auto pb-4 space-y-6">
      {/* Strip Calendar */}
      <div className="animate-slide-up stagger-1 bg-card border border-border shadow-elevated rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-foreground">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowAddDialog(true)}
                  disabled={!isConnected}
                >
                  <Plus weight="regular" className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              {!isConnected && (
                <TooltipContent>
                  <p>Conecte seu Google Calendar</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
        
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

      {/* Add Event Dialog */}
      <AddEventDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        defaultDate={selectedDate}
      />
    </div>
  );
}
