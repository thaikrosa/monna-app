import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Clock } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AddReminderSheet } from '@/components/reminders/AddReminderSheet';
import type { PendingReminder } from '@/hooks/usePendingReminders';

interface RemindersSectionProps {
  reminders: PendingReminder[];
}

export function RemindersSection({ reminders }: RemindersSectionProps) {
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (reminders.length === 0) {
    return (
      <div className="annia-glass rounded-2xl p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell weight="thin" className="h-4 w-4 text-primary" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Lembretes</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sua mente está tranquila. Tudo sob controle.
            </p>
            
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus weight="thin" className="h-4 w-4 mr-1" />
              Criar lembrete
            </Button>
          </div>
        </div>
        
        <AddReminderSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
      </div>
    );
  }

  return (
    <div className="annia-glass rounded-2xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell weight="thin" className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Lembretes</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground h-auto py-1"
            onClick={() => navigate('/lembretes')}
          >
            Ver todos
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus weight="thin" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {reminders.map((reminder) => (
          <div 
            key={reminder.occurrence_id || reminder.id}
            className={`
              flex items-center gap-3 py-2 px-3 rounded-lg transition-colors
              ${reminder.isOverdue 
                ? 'bg-destructive/10 border border-destructive/20' 
                : 'border border-transparent hover:bg-muted/30'
              }
            `}
          >
            <Clock 
              weight="thin" 
              className={`h-4 w-4 flex-shrink-0 ${
                reminder.isOverdue ? 'text-destructive' : 'text-muted-foreground'
              }`} 
            />
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${
                reminder.isOverdue ? 'text-destructive' : 'text-foreground'
              }`}>
                {reminder.title}
              </p>
              
              {reminder.scheduled_at && (
                <p className={`text-xs ${
                  reminder.isOverdue ? 'text-destructive/70' : 'text-muted-foreground'
                }`}>
                  {reminder.isOverdue ? 'Atrasado - ' : ''}
                  {format(new Date(reminder.scheduled_at), "HH:mm", { locale: ptBR })}
                </p>
              )}
            </div>

            {reminder.priority && reminder.priority !== 'normal' && (
              <Badge 
                variant={reminder.priority === 'urgent' ? 'destructive' : 'secondary'}
                className="text-[10px] px-1.5"
              >
                {reminder.priority === 'urgent' ? 'Urgente' : 'Importante'}
              </Badge>
            )}
          </div>
        ))}
      </div>
      
      <AddReminderSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
