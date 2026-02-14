import { Check, Warning } from '@phosphor-icons/react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format, parseISO } from 'date-fns';

interface ChildConsentSectionProps {
  accepted: boolean;
  updatedAt: string;
  onAccept: () => void;
  onRevoke: () => void;
}

export function ChildConsentSection({
  accepted,
  updatedAt,
  onAccept,
  onRevoke,
}: ChildConsentSectionProps) {
  return (
    <div className="border-t border-border/30 pt-4">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Consentimento de Saúde
      </h4>

      {accepted ? (
        <div className="p-3 rounded-lg bg-primary/5 space-y-3">
          <div className="flex items-center gap-2">
            <Check weight="regular" className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Aceito em {format(parseISO(updatedAt), "dd/MM/yyyy")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            A Monna pode enviar lembretes e sugestões de saúde baseadas em protocolos oficiais. Isso não substitui orientação médica profissional.
          </p>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground">Consentimento ativo</Label>
            <Switch
              checked={true}
              onCheckedChange={() => onRevoke()}
            />
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Warning weight="regular" className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-200">Aviso de Saúde</span>
          </div>
          <div className="space-y-2 mb-3">
            <p className="text-xs text-amber-200/90">
              A Monna utiliza informações médicas oficiais como referência para enviar lembretes sobre vacinas, marcos de desenvolvimento e acompanhamento.
            </p>
            <p className="text-xs text-amber-200/90 font-medium">
              A Monna não substitui consultas ou orientações médicas profissionais.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-amber-200/80">Li e autorizo lembretes de saúde</Label>
            <Switch
              checked={false}
              onCheckedChange={() => onAccept()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
