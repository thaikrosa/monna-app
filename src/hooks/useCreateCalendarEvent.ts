import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CreateEventPayload {
  title: string;
  starts_at: string;
  ends_at: string;
  is_all_day: boolean;
  location?: string;
  description?: string;
  timezone?: string;
}

interface CreateEventResponse {
  success: boolean;
  event?: {
    id: string | null;
    google_event_id: string;
    title: string;
    html_link: string;
  };
  error?: string;
}

export function useCreateCalendarEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventPayload): Promise<CreateEventResponse> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: result, error } = await supabase.functions.invoke<CreateEventResponse>(
        'create-google-calendar-event',
        { 
          body: { 
            ...data, 
            user_id: user.id,
          } 
        }
      );

      if (error) {
        throw error;
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to create event');
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate calendar queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['home-dashboard'] });
    },
  });
}
