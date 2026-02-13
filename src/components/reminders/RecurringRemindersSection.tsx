import { useState } from 'react';
import { CaretDown, ArrowsClockwise } from '@phosphor-icons/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useRecurringReminders } from '@/hooks/useRecurringReminders';
import { RecurringReminderCard } from './RecurringReminderCard';
import type { Reminder } from '@/types/reminders';

interface RecurringRemindersSectionProps {
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export function RecurringRemindersSection({ onEdit, onDelete }: RecurringRemindersSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: reminders = [], isLoading } = useRecurringReminders();
  
  // Não exibir se não houver lembretes recorrentes
  if (isLoading || reminders.length === 0) return null;
  
  return (
    <div className="pt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between py-3 
          text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-150">
          <div className="flex items-center gap-2">
            <ArrowsClockwise weight="thin" className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">
              Meus Lembretes Recorrentes
            </span>
            <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {reminders.length}
            </span>
          </div>
          <CaretDown 
            weight="thin" 
            className={`h-4 w-4 transition-transform duration-150 
              ${isOpen ? 'rotate-180' : ''}`} 
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <ul className="space-y-2 pt-2">
            {reminders.map((reminder) => (
              <li key={reminder.id}>
                <RecurringReminderCard
                  reminder={reminder}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
