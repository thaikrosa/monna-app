import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { subDays } from 'date-fns';

export interface ShoppingEvent {
  id: string;
  item_id: string | null;
  event_type: string;
  meta: Record<string, unknown>;
  occurred_at: string;
  user_id: string;
}

export interface ReminderOccurrence {
  id: string;
  reminder_id: string;
  scheduled_at: string;
  status: string | null;
  acknowledged_at: string | null;
  notification_sent_at: string | null;
  snoozed_until: string | null;
  snooze_count: number | null;
  created_at: string;
  updated_at: string;
}

export function useShoppingHistory(daysAgo: number = 7) {
  const { user } = useAuth();
  const startDate = subDays(new Date(), daysAgo).toISOString();

  return useQuery({
    queryKey: ['shopping-history', daysAgo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shopping_item_events')
        .select('*')
        .gte('occurred_at', startDate)
        .order('occurred_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ShoppingEvent[];
    },
    enabled: !!user,
  });
}

export function useReminderHistory(daysAgo: number = 7) {
  const { user } = useAuth();
  const startDate = subDays(new Date(), daysAgo).toISOString();

  return useQuery({
    queryKey: ['reminder-history', daysAgo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminder_occurrences')
        .select('*')
        .gte('scheduled_at', startDate)
        .order('scheduled_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ReminderOccurrence[];
    },
    enabled: !!user,
  });
}

export function useActivitySummary(daysAgo: number = 7) {
  const { data: shoppingEvents = [] } = useShoppingHistory(daysAgo);
  const { data: reminderOccurrences = [] } = useReminderHistory(daysAgo);

  const shoppingCount = shoppingEvents.filter(e => e.event_type === 'checked').length;
  const remindersCompleted = reminderOccurrences.filter(r => r.status === 'acknowledged').length;

  return {
    shoppingCount,
    remindersCompleted,
    totalShoppingEvents: shoppingEvents.length,
    totalReminderOccurrences: reminderOccurrences.length,
  };
}
