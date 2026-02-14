import { useState } from 'react';
import { ShoppingCart, Bell } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useActivitySummary } from '@/hooks/useActivityHistory';

export function ActivityHistorySection() {
  const [historyDays, setHistoryDays] = useState<7 | 30>(7);
  const activitySummary = useActivitySummary(historyDays);

  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-1">
        Seus dados, seu controle
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Resumo das suas atividades recentes
      </p>

      <div className="annia-glass p-4 rounded-lg border border-border/30">
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={historyDays === 7 ? 'default' : 'outline'}
            onClick={() => setHistoryDays(7)}
            className="min-h-[36px]"
          >
            7 dias
          </Button>
          <Button
            size="sm"
            variant={historyDays === 30 ? 'default' : 'outline'}
            onClick={() => setHistoryDays(30)}
            className="min-h-[36px]"
          >
            30 dias
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ShoppingCart weight="thin" className="h-4 w-4 text-primary" />
            <span className="text-foreground text-sm">
              {activitySummary.shoppingCount} itens comprados
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Bell weight="thin" className="h-4 w-4 text-primary" />
            <span className="text-foreground text-sm">
              {activitySummary.remindersCompleted} lembretes concluídos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
