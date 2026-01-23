import { format } from 'date-fns';
import type { Reminder, RecurrenceType } from '@/types/reminders';

/**
 * Formata a descrição humanizada de uma recorrência
 */
export function formatRecurrenceDescription(reminder: Reminder): string {
  const time = format(new Date(reminder.datetime), 'HH:mm');
  
  switch (reminder.recurrence_type) {
    case 'daily':
      return `Diariamente às ${time}`;
    case 'weekly':
      return `Semanalmente às ${time}`;
    case 'monthly':
      return `Mensalmente às ${time}`;
    case 'yearly':
      return `Anualmente às ${time}`;
    case 'interval':
      const config = reminder.recurrence_config as { interval_value?: number } | null;
      const days = config?.interval_value || 1;
      return `A cada ${days} dia${days > 1 ? 's' : ''} às ${time}`;
    default:
      return `Recorrente às ${time}`;
  }
}

/**
 * Retorna o label amigável para um tipo de recorrência
 */
export function getRecurrenceTypeLabel(type: RecurrenceType): string {
  const labels: Record<RecurrenceType, string> = {
    once: 'Uma vez',
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    yearly: 'Anual',
    interval: 'Intervalo',
  };
  return labels[type] || type;
}
