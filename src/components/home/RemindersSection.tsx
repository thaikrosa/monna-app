import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Circle, CheckCircle, Clock } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HomeSection } from './HomeSection';
import { AddReminderSheet } from '@/components/reminders/AddReminderSheet';
import { useAcknowledgeOccurrence } from '@/hooks/useReminders';
import type { PendingReminder } from '@/hooks/usePendingReminders';

interface RemindersSectionProps {
  reminders: PendingReminder[];
}

export function RemindersSection({ reminders }: RemindersSectionProps) {
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const acknowledgeOccurrence = useAcknowledgeOccurrence();
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  const handleAcknowledge = (occurrenceId: string) => {
    setAcknowledgedIds(prev => new Set(prev).add(occurrenceId));
    acknowledgeOccurrence.mutate(occurrenceId);
  };

  if (reminders.length === 0) {
    return (
      <>
        <HomeSection
          icon={<Bell weight="regular" className="h-4 w-4" />}
          title="Lembretes"
          onAdd={() => setIsAddOpen(true)}
          emptyState={
            <p className="text-sm text-muted-foreground">
              Sua mente está tranquila. Tudo sob controle.
            </p>
          }
        >
          <div />
        </HomeSection>
        <AddReminderSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
      </>
    );
  }

  return (
    <>
      <HomeSection
        icon={<Bell weight="regular" className="h-4 w-4" />}
        title="Lembretes"
        count={reminders.length}
        onAdd={() => setIsAddOpen(true)}
        onViewAll={() => navigate('/lembretes')}
        viewAllLabel="Ver todos"
      >
        <div className="space-y-2">
          {reminders.map((reminder) => {
            const isAcknowledged = acknowledgedIds.has(reminder.occurrence_id || '');
            
            return (
              <div 
                key={reminder.occurrence_id || reminder.id}
                className={`
                  flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors duration-150
                  ${reminder.isOverdue 
                    ? 'bg-destructive/10 border border-destructive/20' 
                    : 'bg-muted/50 border border-border/30'
                  }
                  ${isAcknowledged ? 'opacity-50' : ''}
                `}
              >
                {/* Quick Action Checkbox */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
                  onClick={() => reminder.occurrence_id && handleAcknowledge(reminder.occurrence_id)}
                  disabled={isAcknowledged || !reminder.occurrence_id}
                >
                  {isAcknowledged ? (
                    <CheckCircle weight="regular" className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle weight="regular" className="h-5 w-5" />
                  )}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${
                    reminder.isOverdue ? 'text-destructive' : 'text-foreground'
                  } ${isAcknowledged ? 'line-through' : ''}`}>
                    {reminder.title}
                  </p>
                  
                  {reminder.scheduled_at && (
                    <p className={`text-xs ${
                      reminder.isOverdue ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {reminder.isOverdue ? 'Atrasado - ' : ''}
                      {format(new Date(reminder.scheduled_at), "HH:mm", { locale: ptBR })}
                    </p>
                  )}
                </div>

                {reminder.priority && reminder.priority !== 'normal' && (
                  <Badge 
                    variant={reminder.priority === 'urgent' ? 'destructive' : 'secondary'}
                    className="text-xs px-1.5"
                  >
                    {reminder.priority === 'urgent' ? 'Urgente' : 'Importante'}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </HomeSection>
      <AddReminderSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  );
}
