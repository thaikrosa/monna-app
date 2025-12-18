import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Reminder } from '@/hooks/useReminders';

interface WeekSelectorProps {
  weekStart: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  reminders?: Reminder[];
}

export function WeekSelector({
  weekStart,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  reminders = [],
}: WeekSelectorProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hasRemindersOnDate = (date: Date) => {
    return reminders.some((r) => {
      const reminderDate = new Date(r.due_date);
      return isSameDay(reminderDate, date);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevWeek}
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
      >
        <CaretLeft weight="thin" className="h-5 w-5" />
      </Button>

      <div className="flex gap-1 flex-1 justify-center">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const hasReminders = hasRemindersOnDate(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`
                flex flex-col items-center justify-center px-3 py-2 rounded-lg
                transition-all duration-150 min-w-[48px]
                ${isSelected
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              `}
            >
              <span className="text-xs font-medium uppercase">
                {format(day, 'EEE', { locale: ptBR })}
              </span>
              <span className="text-sm font-semibold">{format(day, 'd')}</span>
              <div className="h-1.5 mt-0.5 flex gap-0.5">
                {isTodayDate && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
                {hasReminders && !isTodayDate && (
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextWeek}
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
      >
        <CaretRight weight="thin" className="h-5 w-5" />
      </Button>
    </div>
  );
}
