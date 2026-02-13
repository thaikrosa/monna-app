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
        Quando quer se conectar comigo?
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Configure quando receber mensagens da Monna
      </p>

      <div className="annia-glass p-4 rounded-lg border border-border/30 space-y-4">
        {/* Morning */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sun weight="thin" className="h-5 w-5 text-primary" />
            <div>
              <p className="text-foreground text-sm font-medium">Mensagem matinal</p>
              <p className="text-xs text-muted-foreground">Comece o dia organizada</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {MORNING_OPTIONS.map((time) => (
                <Button
                  key={time}
                  size="sm"
                  variant={settings.checkin_morning_time === time ? 'default' : 'secondary'}
                  className="text-xs px-2"
                  onClick={() => onTimeChange('checkin_morning_time', time)}
                  disabled={!settings.checkin_morning_enabled}
                >
                  {time}
                </Button>
              ))}
            </div>
            <Switch
              checked={settings.checkin_morning_enabled}
              onCheckedChange={(v) => onToggle('checkin_morning_enabled', v)}
            />
          </div>
        </div>

        {/* Evening */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon weight="thin" className="h-5 w-5 text-primary" />
            <div>
              <p className="text-foreground text-sm font-medium">Mensagem noturna</p>
              <p className="text-xs text-muted-foreground">Revise o dia e planeje o amanhã</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {EVENING_OPTIONS.map((time) => (
                <Button
                  key={time}
                  size="sm"
                  variant={settings.checkin_evening_time === time ? 'default' : 'secondary'}
                  className="text-xs px-2"
                  onClick={() => onTimeChange('checkin_evening_time', time)}
                  disabled={!settings.checkin_evening_enabled}
                >
                  {time}
                </Button>
              ))}
            </div>
            <Switch
              checked={settings.checkin_evening_enabled}
              onCheckedChange={(v) => onToggle('checkin_evening_enabled', v)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
