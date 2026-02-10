import { 
  Check, Clock,
  Heart, GraduationCap, House, Briefcase, User, UsersThree, Bank, DotsThree
} from '@phosphor-icons/react';
import { format } from 'date-fns';
import type { UpcomingReminder, ReminderCategory } from '@/types/reminders';
import { capitalizeFirst } from '@/lib/reminder-utils';

const categoryIcons: Record<ReminderCategory, React.ElementType> = {
  health: Heart,
  school: GraduationCap,
  home: House,
  work: Briefcase,
  personal: User,
  family: UsersThree,
  finance: Bank,
  other: DotsThree,
};

interface ReminderCardProps {
  reminder: UpcomingReminder;
  onComplete: (occurrenceId: string) => void;
  onSnooze: (occurrenceId: string) => void;
  onEdit: (reminder: UpcomingReminder) => void;
  onDelete: (id: string) => void;
}

export function ReminderCard({ reminder, onComplete, onSnooze, onEdit, onDelete }: ReminderCardProps) {
  const isCompleted = reminder.occurrence_status === 'acknowledged';
  const isSnoozed = reminder.occurrence_status === 'snoozed';
  const time = format(new Date(reminder.scheduled_at), 'HH:mm');
  const CategoryIcon = reminder.category ? categoryIcons[reminder.category] : null;

  return (
    <div
      className={`
        group relative bg-card p-4 rounded-lg border border-border shadow-elevated
        transition-all duration-150 hover:border-primary/50 hover:shadow-md
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
          onClick={() => !isCompleted && onComplete(reminder.occurrence_id)}
          disabled={isCompleted}
          className={`
            w-4 h-4 rounded-md border flex items-center justify-center
            transition-all duration-150 flex-shrink-0
            ${isCompleted
              ? 'border-primary/50 bg-primary/20'
              : 'border-muted-foreground/30 hover:border-primary'
            }
          `}
        >
          {isCompleted && <Check weight="bold" className="h-2.5 w-2.5 text-primary" />}
        </button>

        {/* Category icon - discrete */}
        {CategoryIcon && reminder.category !== 'other' && (
          <CategoryIcon weight="regular" className="h-4 w-4 text-primary/70 flex-shrink-0" />
        )}

        {/* Title + Snoozed indicator */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3
            className={`
              font-medium text-foreground truncate
              ${isCompleted ? 'line-through decoration-muted-foreground/30' : ''}
            `}
          >
            {capitalizeFirst(reminder.title)}
          </h3>
          {isSnoozed && (
            <Clock weight="thin" className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
          )}
        </div>

        {/* Priority badge - subtle */}
        {reminder.priority !== 'normal' && (
          <span className={`
            text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0
            ${reminder.priority === 'urgent' 
              ? 'bg-destructive/20 text-destructive' 
              : 'bg-primary/10 text-primary/70'}
          `}>
            {reminder.priority === 'urgent' ? 'Urgente' : 'Importante'}
          </span>
        )}
      </div>
    </div>
  );
}
