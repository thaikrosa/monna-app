import { Lightbulb, Package, Baby } from '@phosphor-icons/react';
import { Switch } from '@/components/ui/switch';
import { useChildren, useUpdateChild } from '@/hooks/useChildren';
import { type SettingsState } from './types';

interface SuggestionsSettingsProps {
  settings: SettingsState;
  onToggle: (key: keyof SettingsState, value: boolean) => void;
}

export function SuggestionsSettings({ settings, onToggle }: SuggestionsSettingsProps) {
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const updateChild = useUpdateChild();

  const handleChildMilestonesToggle = (childId: string, value: boolean) => {
    updateChild.mutate({ id: childId, show_standard_milestones: value });
  };

  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-1">
        O que posso antecipar para você?
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Deixe a Monna te ajudar antes que você precise pedir
      </p>

      <div className="annia-glass p-4 rounded-lg border border-border/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb weight="thin" className="h-5 w-5 text-primary" />
            <div>
              <p className="text-foreground text-sm font-medium">Sugestões antecipadas</p>
              <p className="text-xs text-muted-foreground">Pausas, ajustes de rotina</p>
            </div>
          </div>
          <Switch
            checked={settings.proactive_suggestions_enabled}
            onCheckedChange={(v) => onToggle('proactive_suggestions_enabled', v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package weight="thin" className="h-5 w-5 text-primary" />
            <div>
              <p className="text-foreground text-sm font-medium">Alertas de estoque</p>
              <p className="text-xs text-muted-foreground">Fraldas, leite, itens recorrentes</p>
            </div>
          </div>
          <Switch
            checked={settings.inventory_alerts_enabled}
            onCheckedChange={(v) => onToggle('inventory_alerts_enabled', v)}
          />
        </div>
      </div>

      {/* Per-child settings */}
      {!childrenLoading && children.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-muted-foreground">
            Personalização por filho
          </p>
          {children.map((child) => (
            <div
              key={child.id}
              className="annia-glass p-3 rounded-lg border border-border/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Baby weight="thin" className="h-4 w-4 text-primary" />
                  <span className="text-foreground text-sm">
                    {child.nickname || child.name}
                  </span>
                  {child.is_neurodivergent && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Neurodivergente
                    </span>
                  )}
                </div>
                <Switch
                  checked={child.show_standard_milestones ?? true}
                  onCheckedChange={(v) => handleChildMilestonesToggle(child.id, v)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                {child.show_standard_milestones !== false
                  ? 'Mostrando marcos de desenvolvimento padrão'
                  : `Acompanhando o ritmo único de ${child.nickname || child.name}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
