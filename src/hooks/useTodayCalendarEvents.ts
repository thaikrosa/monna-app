import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { startOfDay, endOfDay } from 'date-fns';
import { useEffect, useRef } from 'react';

export interface AgendaEvent {
  instance_id: string;
  event_id: string;
  user_id: string;
  provider: string;
  external_event_id: string;
  external_instance_id: string | null;
  title: string | null;
  starts_at: string;
  ends_at: string;
  is_all_day: boolean;
  location: string | null;
  description: string | null;
  is_recurring: boolean;
  status: string;
  source: string;
}

// Hook auxiliar para sync silencioso em background
function useCalendarSync() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!user || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const syncCalendar = async () => {
      try {
        const { data: connection } = await supabase
          .from('calendar_connections')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'connected')
          .maybeSingle();

        if (!connection) return;

        const { error } = await supabase.functions.invoke('sync-google-calendar', {
          body: { user_id: user.id }
        });

        if (!error) {
          queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
        }
      } catch {
        // Silently fail — sync is not critical
      }
    };

    syncCalendar();
  }, [user, queryClient]);
}

export function useTodayCalendarEvents() {
  const { user } = useSession();
  
  useCalendarSync();
  
  return useQuery({
    queryKey: ['calendar-events', 'today'],
    queryFn: async () => {
      const today = new Date();
      const start = startOfDay(today).toISOString();
      const end = endOfDay(today).toISOString();
      
      const { data, error } = await supabase
        .from('agenda_view')
        .select('*')
        .gte('starts_at', start)
        .lte('starts_at', end)
        .order('starts_at', { ascending: true });
      
      if (error) throw error;
      return (data || []) as unknown as AgendaEvent[];
    },
    enabled: !!user,
  });
}
