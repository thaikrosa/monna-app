import { useMemo } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DaySelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function DaySelector({ selectedDate, onSelectDate }: DaySelectorProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const days = useMemo(() => [
    { date: today, label: 'Hoje' },
    { date: addDays(today, 1), label: 'Amanhã' },
    { date: addDays(today, 2), label: format(addDays(today, 2), "EEEE", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase()) },
  ], [today]);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
      {days.map(({ date, label }) => {
        const isSelected = isSameDay(date, selectedDate);
        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelectDate(date)}
            className={`
              flex-1 min-w-0 py-2.5 px-4 rounded-lg text-sm font-medium
              transition-all duration-150 whitespace-nowrap
              ${isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
