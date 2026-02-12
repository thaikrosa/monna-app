import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import type { Reminder } from '@/types/reminders';

/**
 * Busca lembretes recorrentes ativos (templates mestres)
 * Exclui lembretes do tipo 'once' (não recorrentes)
 */
export function useRecurringReminders() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['reminders', 'recurring', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .neq('recurrence_type', 'once')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Reminder[];
    },
    enabled: !!user,
  });
}
