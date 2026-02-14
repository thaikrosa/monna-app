import { useState, useRef, useCallback } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

interface StripCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function StripCalendar({ selectedDate, onDateSelect }: StripCalendarProps) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(selectedDate, { weekStartsOn: 0 })
  );

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => {
    setWeekStart(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setWeekStart(prev => addDays(prev, 7));
  };

  // Swipe handling for week navigation
  const touchRef = useRef({ x: 0, t: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, t: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dt = Date.now() - touchRef.current.t;
    if (dt > 400 || Math.abs(dx) < 50) return;

    if (dx < 0) goToNextWeek();
    else goToPreviousWeek();
  }, []);

  return (
    <div className="space-y-3" data-swipe-ignore>
      {/* Month/Year header with navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground capitalize">
          {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary/70 hover:text-primary hover:bg-primary/10"
            onClick={goToPreviousWeek}
          >
            <CaretLeft weight="regular" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary/70 hover:text-primary hover:bg-primary/10"
            onClick={goToNextWeek}
          >
            <CaretRight weight="regular" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days strip — swipeable */}
      <div
        className="flex items-center justify-between gap-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                flex flex-col items-center justify-center py-2 px-3 rounded-xl
                min-w-[44px] transition-all duration-200
                ${isSelected
                  ? 'bg-primary text-primary-foreground'
                  : isToday
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50'
                }
              `}
            >
              <span className="text-[10px] font-medium">
                {DAY_LETTERS[day.getDay()]}
              </span>
              <span className={`text-lg ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
