import { useTheme } from 'next-themes';
import { Sun, Moon, Desktop } from '@phosphor-icons/react';

const themes = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'dark', label: 'Escuro', Icon: Moon },
  { value: 'system', label: 'Sistema', Icon: Desktop },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-1">
        Aparência
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Escolha o tema do aplicativo
      </p>

      <div className="flex gap-2">
        {themes.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-lg border transition-colors duration-150
              ${theme === value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80'
              }
            `}
          >
            <Icon weight="thin" className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
