import { useRef, useEffect } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { format, addDays, isSameDay, isToday, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { UpcomingReminder } from '@/types/reminders';

interface WeekSelectorProps {
  weekStart: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  reminders?: UpcomingReminder[];
}

export function WeekSelector({
  weekStart,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  reminders = [],
}: WeekSelectorProps) {
  const daysContainerRef = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hasRemindersOnDate = (date: Date) => {
    const dayStart = startOfDay(date);
    return reminders.some((r) => {
      const reminderDate = startOfDay(new Date(r.scheduled_at));
      return isSameDay(reminderDate, dayStart);
    });
  };

  // Auto-scroll to center today's date
  useEffect(() => {
    if (!daysContainerRef.current) return;
    
    const todayIndex = days.findIndex(d => isToday(d));
    if (todayIndex >= 0) {
      const buttons = daysContainerRef.current.children;
      if (buttons[todayIndex]) {
        (buttons[todayIndex] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [weekStart, days]);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevWeek}
        className="h-10 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent flex-shrink-0"
      >
        <CaretLeft weight="thin" className="h-5 w-5" />
      </Button>

      <div 
        ref={daysContainerRef}
        className="flex gap-1.5 flex-1 justify-center overflow-x-auto scrollbar-hide"
      >
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const hasReminders = hasRemindersOnDate(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`
                flex flex-col items-center justify-center px-3 py-2.5 rounded-lg
                transition-all duration-150 min-w-[52px]
                ${isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'annia-glass text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <span className={`
                text-[10px] uppercase tracking-wide
                ${isSelected ? 'font-medium' : 'font-light'}
              `}>
                {format(day, 'EEE', { locale: ptBR })}
              </span>
              <span className={`
                text-lg leading-tight
                ${isSelected ? 'font-medium' : 'font-normal'}
              `}>
                {format(day, 'd')}
              </span>
              <div className="h-1 mt-0.5 flex gap-0.5">
                {isTodayDate && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                )}
                {hasReminders && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
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
        className="h-10 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent flex-shrink-0"
      >
        <CaretRight weight="thin" className="h-5 w-5" />
      </Button>
    </div>
  );
}
