import { Check, Warning } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
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
        Consentimento
      </h4>

      {accepted ? (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <Check weight="thin" className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Aceito em {format(parseISO(updatedAt), "dd/MM/yyyy")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRevoke}
            className="text-muted-foreground hover:text-destructive"
          >
            Revogar
          </Button>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Warning weight="thin" className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-200">Aviso Importante de Saúde</span>
          </div>
          <div className="space-y-2 mb-3">
            <p className="text-xs text-amber-200/90">
              A Monna é uma assistente de organização familiar que utiliza informações médicas oficiais e dados científicos atualizados como referência. As sugestões sobre vacinas, marcos de desenvolvimento e acompanhamento médico são baseadas em protocolos estabelecidos por órgãos de saúde reconhecidos.
            </p>
            <p className="text-xs text-amber-200/90 font-medium">
              A Monna não substitui consultas, diagnósticos ou orientações médicas profissionais.
            </p>
            <p className="text-xs text-amber-200/90">
              Para qualquer decisão relacionada à saúde do seu filho, consulte sempre o pediatra ou profissional de saúde responsável.
            </p>
            <p className="text-xs text-amber-200/90">
              Ao aceitar este aviso, você autoriza a Monna a enviar lembretes e sugestões relacionadas à saúde com base em dados públicos e protocolos oficiais de saúde.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-amber-200/80">Li e compreendo este aviso</Label>
            <Switch
              checked={false}
              onCheckedChange={onAccept}
            />
          </div>
        </div>
      )}
    </div>
  );
}
