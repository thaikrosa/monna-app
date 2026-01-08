import { CalendarBlank } from '@phosphor-icons/react';

export function AgendaEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <CalendarBlank weight="thin" className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">
        Seu dia está livre
      </p>
    </div>
  );
}
