import { ChatCircle, Heart, Target, Smiley } from '@phosphor-icons/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type SettingsState } from './types';

interface CommunicationStyleProps {
  style: string;
  onChange: (style: string) => void;
}

const STYLE_DESCRIPTIONS: Record<string, string> = {
  caring: 'Próxima e empática',
  direct: 'Objetiva e direta',
  playful: 'Leve e espontânea',
};

export function CommunicationStyle({ style, onChange }: CommunicationStyleProps) {
  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-1">
        Qual o nosso tom?
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Escolha como prefere nossa comunicação
      </p>

      <div className="annia-glass p-4 rounded-lg border border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChatCircle weight="thin" className="h-5 w-5 text-primary" />
            <div>
              <p className="text-foreground text-sm font-medium">Tom da Monna</p>
              <p className="text-xs text-muted-foreground">
                {STYLE_DESCRIPTIONS[style] || STYLE_DESCRIPTIONS.caring}
              </p>
            </div>
          </div>
          <Select value={style} onValueChange={onChange}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caring">
                <span className="flex items-center gap-2">
                  <Heart weight="bold" className="h-4 w-4" />
                  Acolhedora
                </span>
              </SelectItem>
              <SelectItem value="direct">
                <span className="flex items-center gap-2">
                  <Target weight="bold" className="h-4 w-4" />
                  Direta
                </span>
              </SelectItem>
              <SelectItem value="playful">
                <span className="flex items-center gap-2">
                  <Smiley weight="bold" className="h-4 w-4" />
                  Descontraída
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
