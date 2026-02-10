import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DeleteEventPayload {
  event_id: string;
  instance_id?: string;
  delete_series: boolean;
}

export function useDeleteCalendarEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteEventPayload) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke(
        'delete-google-calendar-event',
        { body: { ...data, user_id: user.id } }
      );

      if (error) throw error;
      if (!result?.success) throw new Error(result?.error || 'Erro ao excluir evento');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['home-dashboard'] });
    },
  });
}
