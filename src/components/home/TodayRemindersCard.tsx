import { Bell, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReminderItem } from '@/types/home-dashboard';
import { useNavigate } from 'react-router-dom';

interface TodayRemindersCardProps {
  reminders: ReminderItem[];
  isTeaser?: boolean;
}

export function TodayRemindersCard({ reminders, isTeaser = false }: TodayRemindersCardProps) {
  const navigate = useNavigate();
  const displayReminders = isTeaser ? reminders.slice(0, 2) : reminders.slice(0, 3);

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'urgent') {
      return <Badge variant="destructive" className="text-xs">Urgente</Badge>;
    }
    if (priority === 'important') {
      return <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">Importante</Badge>;
    }
    return null;
  };

  if (reminders.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell weight="regular" className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-card-foreground">Lembretes de hoje</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Mente livre hoje.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/60 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell weight="regular" className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-card-foreground">Lembretes de hoje</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/lembretes')}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Ver todos
          <CaretRight weight="regular" className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {displayReminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
            <span className="text-sm text-card-foreground">{reminder.title}</span>
            {getPriorityBadge(reminder.priority)}
          </div>
        ))}
      </div>
      
      {isTeaser && reminders.length > 2 && (
        <p className="text-xs text-muted-foreground mt-2">
          +{reminders.length - 2} lembretes • Assine para ver todos
        </p>
      )}
    </div>
  );
}
