import { useState, useEffect } from 'react';
import { Baby, Plus, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useChildren, useUpdateChild, useAddChild, type Child } from '@/hooks/useChildren';
import { differenceInYears, differenceInMonths, parseISO } from 'date-fns';
import { ChildForm, type ChildFormData } from './ChildForm';
import { ChildConsentSection } from './ChildConsentSection';

const emptyChildData: ChildFormData = {
  name: '',
  nickname: '',
  birth_date: '',
  gender: '',
  is_neurodivergent: false,
  special_needs_notes: '',
  allergies: '',
  blood_type: '',
  medical_notes: '',
  personality_traits: '',
  soothing_methods: '',
};

function calculateAge(birthDate: string): string {
  const date = parseISO(birthDate);
  const years = differenceInYears(new Date(), date);
  if (years < 1) {
    const months = differenceInMonths(new Date(), date);
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

function childToFormData(child: Child): ChildFormData {
  return {
    name: child.name || '',
    nickname: child.nickname || '',
    birth_date: child.birth_date || '',
    gender: child.gender || '',
    is_neurodivergent: child.is_neurodivergent || false,
    special_needs_notes: child.special_needs_notes || '',
    allergies: child.allergies || '',
    blood_type: child.blood_type || '',
    medical_notes: child.medical_notes || '',
    personality_traits: child.personality_traits || '',
    soothing_methods: child.soothing_methods || '',
  };
}

export function ChildrenSection() {
  const { data: children = [], isLoading } = useChildren();
  const updateChild = useUpdateChild();
  const addChild = useAddChild();

  // Child editing state
  const [editingChildren, setEditingChildren] = useState<Record<string, ChildFormData>>({});

  // Add child state
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildData, setNewChildData] = useState<ChildFormData>(emptyChildData);

  // Initialize child editing data when children load
  useEffect(() => {
    if (children.length > 0) {
      const initialData: Record<string, ChildFormData> = {};
      children.forEach((child) => {
        initialData[child.id] = childToFormData(child);
      });
      setEditingChildren(initialData);
    }
  }, [children]);

  const handleAcceptDisclaimer = (childId: string) => {
    updateChild.mutate({ id: childId, accepted_health_disclaimer: true });
  };

  const handleRevokeDisclaimer = (childId: string) => {
    updateChild.mutate({ id: childId, accepted_health_disclaimer: false });
  };

  const handleSaveChild = (childId: string) => {
    const data = editingChildren[childId];
    if (data) {
      updateChild.mutate({
        id: childId,
        ...data,
      });
    }
  };

  const updateChildField = (childId: string, field: keyof ChildFormData, value: unknown) => {
    setEditingChildren((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [field]: value,
      },
    }));
  };

  const updateNewChildField = (field: keyof ChildFormData, value: unknown) => {
    setNewChildData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveNewChild = () => {
    if (!newChildData.name || !newChildData.birth_date) return;

    addChild.mutate({
      name: newChildData.name,
      birth_date: newChildData.birth_date,
      nickname: newChildData.nickname || null,
      gender: newChildData.gender || null,
      is_neurodivergent: newChildData.is_neurodivergent,
      special_needs_notes: newChildData.special_needs_notes || null,
      allergies: newChildData.allergies || null,
      blood_type: newChildData.blood_type || null,
      medical_notes: newChildData.medical_notes || null,
      personality_traits: newChildData.personality_traits || null,
      soothing_methods: newChildData.soothing_methods || null,
      show_standard_milestones: true,
      accepted_health_disclaimer: false,
      vaccination_reminders_enabled: false,
    }, {
      onSuccess: () => {
        setIsAddingChild(false);
        setNewChildData(emptyChildData);
      },
    });
  };

  const handleCancelNewChild = () => {
    setIsAddingChild(false);
    setNewChildData(emptyChildData);
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-base font-medium text-foreground mb-3">
          Filhos
        </h2>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
        </div>
      </section>
    );
  }

  if (children.length === 0 && !isAddingChild) {
    return (
      <section>
        <h2 className="text-base font-medium text-foreground mb-3">
          Filhos
        </h2>
        <div className="annia-glass p-4 rounded-lg border border-border/30 text-center">
          <p className="text-muted-foreground text-sm">
            Nenhum filho cadastrado
          </p>
          <Button
            variant="link"
            className="text-primary mt-1"
            onClick={() => setIsAddingChild(true)}
          >
            Adicionar primeiro filho
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-3">
        Filhos
      </h2>

      <Accordion
        type="single"
        collapsible
        className="space-y-2"
        defaultValue={isAddingChild ? 'new-child' : undefined}
      >
        {children.map((child) => {
          const childData = editingChildren[child.id];

          return (
            <AccordionItem
              key={child.id}
              value={child.id}
              className="annia-glass rounded-lg border border-border/30 overflow-hidden"
            >
              <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-muted/20 [&[data-state=open]]:border-b [&[data-state=open]]:border-border/30">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Baby weight="thin" className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground font-medium">
                      {child.nickname || child.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {calculateAge(child.birth_date)}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-3 pb-4 pt-3">
                {childData && (
                  <div className="space-y-4">
                    <ChildForm
                      data={childData}
                      onChange={(field, value) => updateChildField(child.id, field, value)}
                    />

                    <ChildConsentSection
                      accepted={child.accepted_health_disclaimer || false}
                      updatedAt={child.updated_at}
                      onAccept={() => handleAcceptDisclaimer(child.id)}
                      onRevoke={() => handleRevokeDisclaimer(child.id)}
                    />

                    <Button
                      className="w-full"
                      onClick={() => handleSaveChild(child.id)}
                      disabled={updateChild.isPending}
                    >
                      Salvar alterações
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}

        {/* New Child Accordion */}
        {isAddingChild && (
          <AccordionItem
            value="new-child"
            className="annia-glass rounded-lg border border-primary/30 overflow-hidden"
          >
            <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-muted/20 [&[data-state=open]]:border-b [&[data-state=open]]:border-border/30">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Plus weight="thin" className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-foreground font-medium">
                    Novo filho
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Preencha os dados
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-3 pb-4 pt-3">
              <div className="space-y-4">
                <ChildForm
                  data={newChildData}
                  onChange={updateNewChildField}
                  showRequired
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelNewChild}
                  >
                    <X weight="thin" className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSaveNewChild}
                    disabled={addChild.isPending || !newChildData.name || !newChildData.birth_date}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {(children.length > 0 || isAddingChild) && !isAddingChild && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-primary mt-3"
          onClick={() => setIsAddingChild(true)}
        >
          <Plus weight="thin" className="h-4 w-4 mr-2" />
          Adicionar mais filhos
        </Button>
      )}
    </section>
  );
}
