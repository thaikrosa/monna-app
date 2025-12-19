import { CalendarBlank, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { AgendaEvent } from '@/types/home-dashboard';
import { useNavigate } from 'react-router-dom';

interface TodayAgendaCardProps {
  events: AgendaEvent[];
  isTeaser?: boolean;
}

export function TodayAgendaCard({ events, isTeaser = false }: TodayAgendaCardProps) {
  const navigate = useNavigate();
  const displayEvents = isTeaser ? events.slice(0, 2) : events.slice(0, 3);

  if (events.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarBlank weight="regular" className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-card-foreground">Agenda de hoje</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Nenhum evento agendado.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/60 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarBlank weight="regular" className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-card-foreground">Agenda de hoje</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/lembretes')}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Ver agenda
          <CaretRight weight="regular" className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {displayEvents.map((event) => (
          <div key={event.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
            <span className="text-sm font-medium text-muted-foreground w-16">
              {event.start_time}
            </span>
            <span className="text-sm text-card-foreground">{event.title}</span>
          </div>
        ))}
      </div>
      
      {isTeaser && events.length > 2 && (
        <p className="text-xs text-muted-foreground mt-2">
          +{events.length - 2} eventos • Assine para ver todos
        </p>
      )}
    </div>
  );
}
