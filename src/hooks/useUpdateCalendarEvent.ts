import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';

export interface UpdateEventPayload {
  event_id: string;
  instance_id?: string;
  title?: string;
  starts_at?: string;
  ends_at?: string;
  is_all_day?: boolean;
  location?: string;
  description?: string;
  timezone?: string;
}

export function useUpdateCalendarEvent() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateEventPayload) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke(
        'update-google-calendar-event',
        { body: { ...data, user_id: user.id } }
      );

      if (error) throw error;
      if (!result?.success) throw new Error(result?.error || 'Erro ao atualizar evento');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['home-dashboard'] });
    },
  });
}
