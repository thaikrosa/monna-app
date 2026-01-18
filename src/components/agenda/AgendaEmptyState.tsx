import { CalendarBlank } from '@phosphor-icons/react';

export function AgendaEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-lg bg-background border border-border shadow-sm flex items-center justify-center mb-4">
        <CalendarBlank weight="regular" className="w-8 h-8 text-primary" />
      </div>
      <p className="text-primary/80 text-sm">
        Seu dia está livre
      </p>
    </div>
  );
}
