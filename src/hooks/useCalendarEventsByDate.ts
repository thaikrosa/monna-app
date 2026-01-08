import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, startOfDay, endOfDay } from "date-fns";

export function useCalendarEventsByDate(date: Date) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-events', format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      const start = startOfDay(date).toISOString();
      const end = endOfDay(date).toISOString();

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('starts_at', start)
        .lt('starts_at', end)
        .order('starts_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}
