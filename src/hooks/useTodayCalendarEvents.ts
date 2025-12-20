import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfDay, endOfDay } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string | null;
  starts_at: string;
  ends_at: string;
  is_all_day: boolean;
  location: string | null;
  status: string;
  provider: string;
  external_event_id: string;
  external_calendar_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useTodayCalendarEvents() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['calendar-events', 'today'],
    queryFn: async () => {
      const today = new Date();
      const start = startOfDay(today).toISOString();
      const end = endOfDay(today).toISOString();
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('starts_at', start)
        .lte('starts_at', end)
        .order('starts_at', { ascending: true });
      
      if (error) throw error;
      return data as CalendarEvent[];
    },
    enabled: !!user,
  });
}
