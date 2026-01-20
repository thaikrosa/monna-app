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
      
      // Busca lembretes pendentes (hoje e atrasados) diretamente das tabelas base
      // Usando join com reminders para obter os dados completos
      const { data, error } = await supabase
        .from('reminder_occurrences')
        .select(`
          id,
          scheduled_at,
          status,
          reminder:reminders!inner (
            id,
            user_id,
            title,
            description,
            category,
            priority,
            call_guarantee,
            status
          )
        `)
        .in('status', ['pending', 'snoozed'])
        .lte('scheduled_at', endOfToday.toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(10); // Busca mais para filtrar depois
      
      // Debug temporário
      console.log('[usePendingReminders] Data:', data, 'Error:', error);
      
      if (error) throw error;
      
      // Filtra apenas lembretes ativos no JavaScript (evita erro de filtro relacionado)
      const filtered = (data || []).filter(occ => occ.reminder?.status === 'active');
      
      // Transforma os dados para o formato esperado (PendingReminder)
      const reminders: PendingReminder[] = filtered.slice(0, 5).map((occ) => {
        const reminder = occ.reminder as {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string | null;
          priority: string | null;
          call_guarantee: boolean | null;
          status: string;
        };
        
        return {
          id: reminder.id,
          user_id: reminder.user_id,
          title: reminder.title,
          description: reminder.description,
          category: reminder.category as PendingReminder['category'],
          priority: reminder.priority as PendingReminder['priority'],
          call_guarantee: reminder.call_guarantee,
          occurrence_id: occ.id,
          scheduled_at: occ.scheduled_at,
          occurrence_status: occ.status as PendingReminder['occurrence_status'],
          isOverdue: occ.scheduled_at ? new Date(occ.scheduled_at) < now : false,
        };
      });
      
      // Ordena: atrasados primeiro, depois por horário
      return reminders.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return new Date(a.scheduled_at || 0).getTime() - new Date(b.scheduled_at || 0).getTime();
      });
    },
    enabled: !!user,
    refetchInterval: 60 * 1000, // Atualiza a cada 1 minuto
  });
}
