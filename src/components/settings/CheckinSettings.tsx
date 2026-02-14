import { Sun, Moon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { type SettingsState, MORNING_OPTIONS, EVENING_OPTIONS } from './types';

interface CheckinSettingsProps {
  settings: SettingsState;
  onToggle: (key: keyof SettingsState, value: boolean) => void;
  onTimeChange: (key: 'checkin_morning_time' | 'checkin_evening_time', value: string) => void;
}

export function CheckinSettings({ settings, onToggle, onTimeChange }: CheckinSettingsProps) {
  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-1">
        Mensagens diárias
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Escolha quando a Monna envia suas mensagens
      </p>

      <div className="annia-glass p-4 rounded-lg border border-border/30 space-y-4">
        {/* Morning */}
        <div className="space-y-3">
          <div className="flex items-center justify-between min-h-[44px]">
            <div className="flex items-center gap-3">
              <Sun weight="thin" className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-foreground text-sm font-medium">Bom dia</p>
                <p className="text-xs text-muted-foreground">Resumo e planejamento do dia</p>
              </div>
            </div>
            <Switch
              checked={settings.checkin_morning_enabled}
              onCheckedChange={(v) => onToggle('checkin_morning_enabled', v)}
            />
          </div>
          {settings.checkin_morning_enabled && (
            <div className="flex gap-2 pl-8">
              {MORNING_OPTIONS.map((time) => (
                <Button
                  key={time}
                  size="sm"
                  variant={settings.checkin_morning_time === time ? 'default' : 'secondary'}
                  className="text-xs px-3 min-h-[36px]"
                  onClick={() => onTimeChange('checkin_morning_time', time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border/30" />

        {/* Evening */}
        <div className="space-y-3">
          <div className="flex items-center justify-between min-h-[44px]">
            <div className="flex items-center gap-3">
              <Moon weight="thin" className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-foreground text-sm font-medium">Boa noite</p>
                <p className="text-xs text-muted-foreground">Revisão do dia e preparo do amanhã</p>
              </div>
            </div>
            <Switch
              checked={settings.checkin_evening_enabled}
              onCheckedChange={(v) => onToggle('checkin_evening_enabled', v)}
            />
          </div>
          {settings.checkin_evening_enabled && (
            <div className="flex gap-2 pl-8">
              {EVENING_OPTIONS.map((time) => (
                <Button
                  key={time}
                  size="sm"
                  variant={settings.checkin_evening_time === time ? 'default' : 'secondary'}
                  className="text-xs px-3 min-h-[36px]"
                  onClick={() => onTimeChange('checkin_evening_time', time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
