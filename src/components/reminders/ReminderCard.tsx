import { Check, Baby, User, PencilSimple, TrashSimple, Phone } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { Reminder } from '@/hooks/useReminders';

interface ReminderCardProps {
  reminder: Reminder;
  onComplete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export function ReminderCard({ reminder, onComplete, onEdit, onDelete }: ReminderCardProps) {
  const isCompleted = reminder.status === 'completed';
  const time = format(new Date(reminder.due_date), 'HH:mm');
  const effortOpacity = (reminder.effort_level || 1) * 0.15;

  return (
    <div
      className={`
        group relative annia-glass p-4 rounded-lg border border-border/30
        transition-all duration-150 hover:border-primary/30
        ${isCompleted ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Time - discrete left */}
        <span className="text-xs font-light text-muted-foreground/70 w-10 flex-shrink-0">
          {time}
        </span>

        {/* Checkbox */}
        <button
          onClick={() => !isCompleted && onComplete(reminder.id)}
          disabled={isCompleted}
          className={`
            w-4 h-4 rounded-full border flex items-center justify-center
            transition-all duration-150 flex-shrink-0
            ${isCompleted
              ? 'border-primary/50 bg-primary/20'
              : 'border-muted-foreground/30 hover:border-primary'
            }
          `}
        >
          {isCompleted && <Check weight="bold" className="h-2.5 w-2.5 text-primary" />}
        </button>

        {/* Title + Critical indicator */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3
            className={`
              font-medium text-foreground truncate
              ${isCompleted ? 'line-through decoration-muted-foreground/30' : ''}
            `}
          >
            {reminder.title}
          </h3>
          {reminder.is_critical && (
            <Phone weight="thin" className="h-4 w-4 text-primary/70 flex-shrink-0" />
          )}
        </div>

        {/* Link badges - subtle */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {reminder.child_id && (
            <Baby weight="thin" className="h-4 w-4 text-primary/50" />
          )}
          {reminder.contact_id && (
            <User weight="thin" className="h-4 w-4 text-primary/50" />
          )}
        </div>

        {/* Actions - revealed on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(reminder)}
            className="h-7 w-7 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
          >
            <PencilSimple weight="thin" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(reminder.id)}
            className="h-7 w-7 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
          >
            <TrashSimple weight="thin" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Effort level line at base */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary rounded-b-lg"
        style={{ opacity: effortOpacity }}
      />
    </div>
  );
}
