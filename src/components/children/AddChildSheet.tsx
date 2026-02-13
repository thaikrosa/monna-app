import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAddChild } from '@/hooks/useChildren';
import { Warning } from '@phosphor-icons/react';
import { ChildFormFields, type ChildFormData, emptyChildFormData } from '@/components/shared/ChildFormFields';

interface AddChildSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddChildSheet({ open, onOpenChange }: AddChildSheetProps) {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [formData, setFormData] = useState<ChildFormData>(emptyChildFormData);
  const addChild = useAddChild();

  const updateField = <K extends keyof ChildFormData>(field: K, value: ChildFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit = disclaimerAccepted && formData.name.trim() && formData.birth_date;

  const resetForm = () => {
    setDisclaimerAccepted(false);
    setFormData(emptyChildFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    addChild.mutate(
      {
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
        accepted_health_disclaimer: true,
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cadastrar Filho</SheetTitle>
          <SheetDescription>
            Adicione seu filho(a) à Monna
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Health Disclaimer */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Warning weight="thin" className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="text-sm font-medium text-amber-200">
                  Aviso Importante de Saúde
                </p>
                <p className="text-sm text-amber-200/90">
                  A Monna é uma assistente de organização familiar que utiliza informações médicas oficiais e dados científicos atualizados como referência. As sugestões sobre vacinas, marcos de desenvolvimento e acompanhamento médico são baseadas em protocolos estabelecidos por órgãos de saúde reconhecidos.
                </p>
                <p className="text-sm text-amber-200/90 font-medium">
                  A Monna não substitui consultas, diagnósticos ou orientações médicas profissionais.
                </p>
                <p className="text-sm text-amber-200/90">
                  Para qualquer decisão relacionada à saúde do seu filho, consulte sempre o pediatra ou profissional de saúde responsável.
                </p>
                <p className="text-sm text-amber-200/90">
                  Ao aceitar este aviso, você autoriza a Monna a enviar lembretes e sugestões relacionadas à saúde com base em dados públicos e protocolos oficiais de saúde.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                  />
                  <Label htmlFor="disclaimer" className="text-sm text-amber-200/80 cursor-pointer">
                    Li e compreendo este aviso
                  </Label>
                </div>
              </div>
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
            disabled={!canSubmit || addChild.isPending}
          >
            {addChild.isPending ? 'Salvando...' : 'Salvar filho'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
