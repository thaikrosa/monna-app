import { useState, useEffect } from 'react';
import { Briefcase, Baby, Heartbeat, Car, Moon, DotsThree, Trash } from '@phosphor-icons/react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  UserRoutine,
  UserRoutineInsert,
  RoutineType,
  ROUTINE_LABELS,
  ROUTINE_COLORS,
} from '@/types/onboarding';
import { cn } from '@/lib/utils';

interface AddRoutineSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: UserRoutineInsert) => void;
  onDelete?: () => void;
  selectedDays: number[];
  editingRoutine?: UserRoutine | null;
}

const CATEGORIES: { type: RoutineType; icon: React.ElementType }[] = [
  { type: 'work', icon: Briefcase },
  { type: 'kids', icon: Baby },
  { type: 'self_care', icon: Heartbeat },
  { type: 'commute', icon: Car },
  { type: 'sleep', icon: Moon },
  { type: 'other', icon: DotsThree },
];

export function AddRoutineSheet({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDays,
  editingRoutine,
}: AddRoutineSheetProps) {
  const [selectedType, setSelectedType] = useState<RoutineType>('work');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isFlexible, setIsFlexible] = useState(false);
  const [customName, setCustomName] = useState('');

  // Reset form when opening or changing editingRoutine
  useEffect(() => {
    if (isOpen) {
      if (editingRoutine) {
        setSelectedType(editingRoutine.routine_type);
        setStartTime(editingRoutine.start_time);
        setEndTime(editingRoutine.end_time);
        setIsFlexible(editingRoutine.is_flexible ?? false);
        setCustomName(editingRoutine.name);
      } else {
        setSelectedType('work');
        setStartTime('08:00');
        setEndTime('18:00');
        setIsFlexible(false);
        setCustomName('');
      }
    }
  }, [isOpen, editingRoutine]);

  const handleSave = () => {
    const routine: UserRoutineInsert = {
      name: customName || ROUTINE_LABELS[selectedType],
      routine_type: selectedType,
      days_of_week: editingRoutine?.days_of_week ?? selectedDays,
      start_time: startTime,
      end_time: endTime,
      is_flexible: isFlexible,
      color: ROUTINE_COLORS[selectedType],
    };
    onSave(routine);
  };

  return (
    <Drawer open={isOpen} onOpenChange={open => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {editingRoutine ? 'Editar bloco' : 'O que acontece nesse horário?'}
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto">
          {/* Category selector */}
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  'category-button',
                  selectedType === type && 'selected'
                )}
              >
                <Icon weight="thin" className="h-6 w-6" />
                <span className="text-xs">{ROUTINE_LABELS[type]}</span>
              </button>
            ))}
          </div>

          <Separator />

          {/* Time selectors */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Horário</Label>
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <Input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="text-center text-lg h-12"
                />
                <span className="text-xs text-muted-foreground block text-center">
                  Início
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <Input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="text-center text-lg h-12"
                />
                <span className="text-xs text-muted-foreground block text-center">
                  Fim
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Custom name (optional) */}
          <div className="space-y-2">
            <Label htmlFor="routine-name" className="text-sm text-muted-foreground">
              Nome personalizado (opcional)
            </Label>
            <Input
              id="routine-name"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder={ROUTINE_LABELS[selectedType]}
            />
          </div>

          <Separator />

          {/* Flexibility toggle */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="flexible-toggle" className="text-sm">
                Annia pode sugerir pausas?
              </Label>
              <p className="text-xs text-muted-foreground">
                Se ativado, buscaremos brechas para você respirar.
              </p>
            </div>
            <Switch
              id="flexible-toggle"
              checked={isFlexible}
              onCheckedChange={setIsFlexible}
            />
          </div>

          {/* Save button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            Salvar bloco
          </Button>

          {/* Delete button (only when editing) */}
          {editingRoutine && onDelete && (
            <button
              onClick={onDelete}
              className="w-full text-center text-sm text-destructive hover:underline flex items-center justify-center gap-2"
            >
              <Trash weight="regular" className="h-4 w-4" />
              Excluir bloco
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
