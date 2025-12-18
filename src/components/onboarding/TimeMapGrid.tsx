import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserRoutine, UserRoutineInsert } from '@/types/onboarding';
import { AddRoutineSheet } from './AddRoutineSheet';
import { RoutineTimelineView } from './RoutineTimelineView';
import { cn } from '@/lib/utils';

interface TimeMapGridProps {
  routines: UserRoutine[];
  onRoutineCreate: (routine: UserRoutineInsert) => void;
  onRoutineUpdate: (id: string, updates: Partial<UserRoutine>) => void;
  onRoutineDelete: (id: string) => void;
}

const DAY_OPTIONS: { key: string; label: string; days: number[] }[] = [
  { key: 'weekdays', label: 'Seg-Sex', days: [1, 2, 3, 4, 5] },
  { key: 'saturday', label: 'Sáb', days: [6] },
  { key: 'sunday', label: 'Dom', days: [0] },
];

export function TimeMapGrid({
  routines,
  onRoutineCreate,
  onRoutineUpdate,
  onRoutineDelete,
}: TimeMapGridProps) {
  const isMobile = useIsMobile();
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<UserRoutine | null>(null);

  const toggleDayGroup = (days: number[]) => {
    const allSelected = days.every(d => selectedDays.includes(d));
    if (allSelected) {
      setSelectedDays(prev => prev.filter(d => !days.includes(d)));
    } else {
      setSelectedDays(prev => [...new Set([...prev, ...days])]);
    }
  };

  const isDayGroupSelected = (days: number[]) => {
    return days.every(d => selectedDays.includes(d));
  };

  const handleRoutineClick = (routine: UserRoutine) => {
    setEditingRoutine(routine);
    setIsSheetOpen(true);
  };

  const handleAddClick = () => {
    setEditingRoutine(null);
    setIsSheetOpen(true);
  };

  const handleSave = (routine: UserRoutineInsert) => {
    if (editingRoutine) {
      onRoutineUpdate(editingRoutine.id, routine);
    } else {
      onRoutineCreate(routine);
    }
    setIsSheetOpen(false);
    setEditingRoutine(null);
  };

  const handleDelete = (id: string) => {
    onRoutineDelete(id);
    setIsSheetOpen(false);
    setEditingRoutine(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Seus horários fixos
        </h2>

        {/* Day selector pills */}
        <div className="flex gap-2">
          {DAY_OPTIONS.map(option => (
            <button
              key={option.key}
              onClick={() => toggleDayGroup(option.days)}
              className={cn(
                'day-pill',
                isDayGroupSelected(option.days) && 'selected'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline view */}
      <div className="flex-1 overflow-y-auto px-4">
        <RoutineTimelineView
          routines={routines}
          selectedDays={selectedDays}
          onRoutineClick={handleRoutineClick}
          onRoutineDelete={onRoutineDelete}
        />
      </div>

      {/* FAB - Add button */}
      <div className="p-4">
        <Button
          onClick={handleAddClick}
          className="w-full gap-2"
          size="lg"
        >
          <Plus weight="bold" className="h-5 w-5" />
          Adicionar bloco
        </Button>
      </div>

      {/* Bottom sheet / Modal */}
      <AddRoutineSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setEditingRoutine(null);
        }}
        onSave={handleSave}
        onDelete={editingRoutine ? () => handleDelete(editingRoutine.id) : undefined}
        selectedDays={selectedDays}
        editingRoutine={editingRoutine}
      />
    </div>
  );
}
