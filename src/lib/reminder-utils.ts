import { format } from 'date-fns';
import type { Reminder, RecurrenceType } from '@/types/reminders';

const dayNames = ['domingos', 'segundas', 'terças', 'quartas', 'quintas', 'sextas', 'sábados'];

/**
 * Formata hora sem :00 quando os minutos são zero.
 * Ex: 9:00 → 9h, 14:30 → 14h30
 */
function formatSmartTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

/**
 * Formata a descrição humanizada de uma recorrência
 */
export function formatRecurrenceDescription(reminder: Reminder): string {
  const time = formatSmartTime(new Date(reminder.datetime));
  
  switch (reminder.recurrence_type) {
    case 'daily':
      return `Todos os dias às ${time}`;
    case 'weekly': {
      const config = reminder.recurrence_config as { days_of_week?: number[] } | null;
      const days = config?.days_of_week;
      if (days && days.length > 0) {
        const names = days.map(d => dayNames[d]);
        const joined = names.length > 1
          ? names.slice(0, -1).join(', ') + ' e ' + names[names.length - 1]
          : names[0];
        const prefix = names.length > 1 ? 'Todas as' : 'Toda';
        return `${prefix} ${joined} às ${time}`;
      }
      return `Toda semana às ${time}`;
    }
    case 'monthly': {
      const dayOfMonth = new Date(reminder.datetime).getDate();
      return `Todo dia ${dayOfMonth} às ${time}`;
    }
    case 'yearly':
      return `Todo ano às ${time}`;
    case 'interval': {
      const config = reminder.recurrence_config as { interval_value?: number } | null;
      const intervalDays = config?.interval_value || 1;
      return `A cada ${intervalDays} dia${intervalDays > 1 ? 's' : ''} às ${time}`;
    }
    default:
      return `Recorrente às ${time}`;
  }
}

/**
 * Capitaliza a primeira letra de uma string (para exibição)
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
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
