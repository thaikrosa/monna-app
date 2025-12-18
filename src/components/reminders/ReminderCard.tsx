import { Check, Baby, User, PencilSimple, TrashSimple } from '@phosphor-icons/react';
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

  return (
    <div
      className={`
        group annia-glass p-4 rounded-lg border border-border/30
        transition-all duration-150 hover:border-primary/30
        ${isCompleted ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox circular */}
        <button
          onClick={() => !isCompleted && onComplete(reminder.id)}
          disabled={isCompleted}
          className={`
            mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all duration-150 flex-shrink-0
            ${isCompleted
              ? 'border-primary/50 bg-primary/20'
              : 'border-muted-foreground/40 hover:border-primary'
            }
          `}
        >
          {isCompleted && <Check weight="bold" className="h-3 w-3 text-primary" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`
                font-medium text-foreground truncate
                ${isCompleted ? 'line-through decoration-muted-foreground/50' : ''}
              `}
            >
              {reminder.title}
            </h3>
            {reminder.is_critical && (
              <span className="w-2 h-2 rounded-full bg-amber-500/70 flex-shrink-0" />
            )}
          </div>
          {reminder.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {reminder.description}
            </p>
          )}
        </div>

        {/* Time */}
        <span className="text-sm text-muted-foreground font-medium flex-shrink-0">
          {time}
        </span>

        {/* Link indicators */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {reminder.child_id && (
            <Baby weight="thin" className="h-4 w-4 text-primary/70" />
          )}
          {reminder.contact_id && (
            <User weight="thin" className="h-4 w-4 text-primary/70" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(reminder)}
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
          >
            <PencilSimple weight="thin" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(reminder.id)}
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
          >
            <TrashSimple weight="thin" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
