import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { TodayReminder } from '@/types/reminders';

export interface PendingReminder extends TodayReminder {
  isOverdue: boolean;
}

export function usePendingReminders() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reminders', 'pending-home'],
    queryFn: async () => {
      const now = new Date();
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      
      // Busca lembretes pendentes (hoje e atrasados)
      const { data, error } = await supabase
        .from('today_reminders')
        .select('*')
        .in('occurrence_status', ['pending', 'snoozed'])
        .lte('scheduled_at', endOfToday.toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      
      // Marca os atrasados
      const reminders: PendingReminder[] = (data || []).map((r) => ({
        ...r,
        isOverdue: r.scheduled_at ? new Date(r.scheduled_at) < now : false,
      }));
      
      // Ordena: atrasados primeiro, depois por horário
      return reminders.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return 0;
      });
    },
    enabled: !!user,
    refetchInterval: 60 * 1000, // Atualiza a cada 1 minuto
  });
}
