import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useUpdateChild, Child } from '@/hooks/useChildren';
import { Info } from '@phosphor-icons/react';
import { ChildFormFields, type ChildFormData, emptyChildFormData } from '@/components/shared/ChildFormFields';

interface EditChildSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: Child | null;
}

function childToFormData(child: Child): ChildFormData {
  return {
    name: child.name,
    nickname: child.nickname || '',
    birth_date: child.birth_date,
    gender: child.gender || '',
    is_neurodivergent: child.is_neurodivergent ?? false,
    special_needs_notes: child.special_needs_notes || '',
    allergies: child.allergies || '',
    blood_type: child.blood_type || '',
    medical_notes: child.medical_notes || '',
    personality_traits: child.personality_traits || '',
    soothing_methods: child.soothing_methods || '',
    show_standard_milestones: child.show_standard_milestones ?? true,
    vaccination_reminders_enabled: child.vaccination_reminders_enabled ?? true,
  };
}

export function EditChildSheet({ open, onOpenChange, child }: EditChildSheetProps) {
  const [formData, setFormData] = useState<ChildFormData>(emptyChildFormData);
  const updateChild = useUpdateChild();

  // Populate form when child changes
  useEffect(() => {
    if (child) {
      setFormData(childToFormData(child));
    }
  }, [child]);

  const updateField = <K extends keyof ChildFormData>(field: K, value: ChildFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit = formData.name.trim() && formData.birth_date;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !child) return;

    updateChild.mutate(
      {
        id: child.id,
        name: formData.name.trim(),
        nickname: formData.nickname.trim() || null,
        birth_date: formData.birth_date,
        gender: formData.gender || null,
        show_standard_milestones: formData.show_standard_milestones,
        is_neurodivergent: formData.is_neurodivergent,
        special_needs_notes: formData.special_needs_notes.trim() || null,
        blood_type: formData.blood_type || null,
        allergies: formData.allergies.trim() || null,
        medical_notes: formData.medical_notes.trim() || null,
        vaccination_reminders_enabled: formData.vaccination_reminders_enabled,
        soothing_methods: formData.soothing_methods.trim() || null,
        personality_traits: formData.personality_traits.trim() || null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Filho</SheetTitle>
          <SheetDescription>
            Atualize os dados de {child?.nickname || child?.name}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Health Disclaimer Reference */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-start gap-2">
              <Info weight="thin" className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Lembre-se: a Monna não substitui orientações médicas.
              </p>
            </div>
          </div>

          <ChildFormFields
            data={formData}
            onChange={updateField}
            showRequired
            variant="full"
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || updateChild.isPending}
          >
            {updateChild.isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
