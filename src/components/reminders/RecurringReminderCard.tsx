import { ArrowsClockwise, PencilSimple, TrashSimple } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { formatRecurrenceDescription, capitalizeFirst } from '@/lib/reminder-utils';
import type { Reminder } from '@/types/reminders';

interface RecurringReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export function RecurringReminderCard({ reminder, onEdit, onDelete }: RecurringReminderCardProps) {
  return (
    <div className="group relative bg-card p-4 rounded-lg border border-border shadow-elevated
      transition-all duration-150 hover:border-primary/50">
      
      <div className="flex items-center gap-3">
        {/* Ícone de recorrência */}
        <ArrowsClockwise 
          weight="thin" 
          className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" 
        />
        
        {/* Título + Descrição */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">
            {capitalizeFirst(reminder.title)}
          </h3>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            {formatRecurrenceDescription(reminder)}
          </p>
        </div>
        
        {/* Ações - reveladas no hover, sempre visíveis em mobile */}
        <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
          transition-opacity duration-150">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(reminder)}
            className="h-7 w-7 text-muted-foreground/60 hover:text-foreground 
              active:text-foreground hover:bg-transparent"
          >
            <PencilSimple weight="thin" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(reminder.id)}
            className="h-7 w-7 text-muted-foreground/60 hover:text-foreground 
              active:text-foreground hover:bg-transparent"
          >
            <TrashSimple weight="thin" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
