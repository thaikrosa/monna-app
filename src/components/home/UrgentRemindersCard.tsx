import { Warning } from '@phosphor-icons/react';
import { UrgentItem } from '@/types/home-dashboard';

interface UrgentRemindersCardProps {
  items: UrgentItem[];
}

export function UrgentRemindersCard({ items }: UrgentRemindersCardProps) {
  if (items.length === 0) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Warning weight="regular" className="w-5 h-5 text-destructive" />
        <h3 className="font-semibold text-destructive">Urgentes</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        Eu separei o que está ficando para trás.
      </p>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-destructive/20 last:border-0">
            <span className="text-sm text-card-foreground">{item.title}</span>
            <span className="text-xs text-destructive font-medium">
              {item.days_overdue} {item.days_overdue === 1 ? 'dia' : 'dias'} atrasado
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
