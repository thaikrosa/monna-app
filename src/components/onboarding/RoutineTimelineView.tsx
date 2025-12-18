import { useState, useRef } from 'react';
import { Briefcase, Baby, Heartbeat, Car, Moon, DotsThree, Trash } from '@phosphor-icons/react';
import { UserRoutine, RoutineType } from '@/types/onboarding';
import { cn } from '@/lib/utils';

interface RoutineTimelineViewProps {
  routines: UserRoutine[];
  selectedDays: number[];
  onRoutineClick: (routine: UserRoutine) => void;
  onRoutineDelete: (id: string) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6-22
const CELL_HEIGHT = 48;

const ROUTINE_ICONS: Record<RoutineType, React.ElementType> = {
  work: Briefcase,
  kids: Baby,
  self_care: Heartbeat,
  sleep: Moon,
  commute: Car,
  other: DotsThree,
};

export function RoutineTimelineView({
  routines,
  selectedDays,
  onRoutineClick,
  onRoutineDelete,
}: RoutineTimelineViewProps) {
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Filter routines that appear in selected days
  const visibleRoutines = routines.filter(r =>
    r.days_of_week.some(d => selectedDays.includes(d))
  );

  const getBlockStyle = (routine: UserRoutine) => {
    const [startH, startM = 0] = routine.start_time.split(':').map(Number);
    const [endH, endM = 0] = routine.end_time.split(':').map(Number);
    const startOffset = startH + startM / 60;
    const endOffset = endH + endM / 60;
    return {
      top: (startOffset - 6) * CELL_HEIGHT,
      height: (endOffset - startOffset) * CELL_HEIGHT,
    };
  };

  const handleTouchStart = (e: React.TouchEvent, routineId: string) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent, routineId: string) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (deltaX < -50 && deltaY < 30) {
      setSwipedId(routineId);
    } else if (deltaX > 30) {
      setSwipedId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, routineId: string) => {
    e.stopPropagation();
    onRoutineDelete(routineId);
    setSwipedId(null);
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="relative" style={{ height: HOURS.length * CELL_HEIGHT }}>
      {/* Hour grid lines */}
      {HOURS.map(hour => (
        <div
          key={hour}
          className="timeline-hour-row"
          style={{ position: 'absolute', top: (hour - 6) * CELL_HEIGHT, left: 0, right: 0 }}
        >
          <span className="timeline-hour-label">{formatHour(hour)}</span>
        </div>
      ))}

      {/* Routine blocks */}
      {visibleRoutines.map(routine => {
        const Icon = ROUTINE_ICONS[routine.routine_type] || DotsThree;
        const style = getBlockStyle(routine);
        const isSwiped = swipedId === routine.id;

        return (
          <div
            key={routine.id}
            className="absolute left-12 right-0"
            style={{ top: style.top, height: style.height }}
          >
            {/* Delete button (revealed on swipe) */}
            <button
              onClick={e => handleDelete(e, routine.id)}
              className="routine-delete-button"
              style={{ height: style.height }}
            >
              <Trash weight="regular" className="h-5 w-5" />
            </button>

            {/* Routine block */}
            <div
              onClick={() => !isSwiped && onRoutineClick(routine)}
              onTouchStart={e => handleTouchStart(e, routine.id)}
              onTouchEnd={e => handleTouchEnd(e, routine.id)}
              className={cn(
                'routine-block routine-block-swipe',
                routine.is_flexible ? 'routine-block-flexible' : 'routine-block-rigid',
                isSwiped && 'swiped'
              )}
              style={{
                height: '100%',
                backgroundColor: routine.is_flexible ? undefined : (routine.color || undefined),
                borderColor: routine.is_flexible ? (routine.color || undefined) : undefined,
              }}
            >
              <Icon weight="thin" className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-sm font-medium">{routine.name}</span>
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {visibleRoutines.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm text-center px-8">
            Nenhuma rotina cadastrada para os dias selecionados.
            <br />
            Toque em "Adicionar bloco" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
