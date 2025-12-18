import { ArrowRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { TimeMapGrid } from './TimeMapGrid';
import { useUserRoutines, useAddRoutine, useUpdateRoutine, useDeleteRoutine } from '@/hooks/useOnboarding';
import { toast } from 'sonner';
import type { UserRoutineInsert, UserRoutine } from '@/types/onboarding';

interface KickstartStep2Props {
  onNext: () => void;
  onSkip: () => void;
}

export function KickstartStep2({ onNext, onSkip }: KickstartStep2Props) {
  const { data: routines = [] } = useUserRoutines();
  const addRoutine = useAddRoutine();
  const updateRoutine = useUpdateRoutine();
  const deleteRoutine = useDeleteRoutine();

  const handleRoutineCreate = (routine: UserRoutineInsert) => {
    addRoutine.mutate(routine, {
      onSuccess: () => {
        toast.success('Perfeito! Vou proteger esse horário.');
      },
    });
  };

  const handleRoutineUpdate = (id: string, updates: Partial<UserRoutine>) => {
    updateRoutine.mutate({ id, ...updates });
  };

  const handleRoutineDelete = (id: string) => {
    deleteRoutine.mutate(id);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Seus territórios protegidos
        </h1>
        <p className="text-sm text-muted-foreground">
          Marque seus horários fixos para eu proteger seu tempo.
        </p>
      </div>

      {/* TimeMapGrid */}
      <div className="flex-1 min-h-0 -mx-6">
        <TimeMapGrid
          routines={routines}
          onRoutineCreate={handleRoutineCreate}
          onRoutineUpdate={handleRoutineUpdate}
          onRoutineDelete={handleRoutineDelete}
        />
      </div>

      {/* Actions */}
      <div className="pt-4 pb-8 space-y-3">
        <Button 
          onClick={onNext}
          className="kickstart-cta bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Continuar
          <ArrowRight size={20} weight="bold" className="ml-2" />
        </Button>
        
        <button 
          onClick={onSkip}
          className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Pular por enquanto
        </button>
      </div>
    </div>
  );
}
