import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@/contexts/SessionContext';
import { format, startOfDay, endOfDay } from "date-fns";
import type { AgendaEvent } from "./useTodayCalendarEvents";

export function useCalendarEventsByDate(date: Date) {
  const { user } = useSession();

  return useQuery({
    queryKey: ['calendar-events', format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      const start = startOfDay(date).toISOString();
      const end = endOfDay(date).toISOString();

      const { data, error } = await supabase
        .from('agenda_view')
        .select('*')
        .gte('starts_at', start)
        .lt('starts_at', end)
        .order('starts_at', { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as AgendaEvent[];
    },
    enabled: !!user,
  });
}
