import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DailyInsight {
  id: string;
  message: string;
  mood_type: string;
  action_label: string | null;
  action_url: string | null;
  active_date: string;
  created_at: string | null;
}

export function useDailyInsight() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['daily-insight'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_insights')
        .select('*')
        .eq('active_date', today)
        .maybeSingle();
      
      if (error) throw error;
      return data as DailyInsight | null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
