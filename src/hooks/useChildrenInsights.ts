import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';

export interface ChildInsight {
  id: string;
  child_id: string | null;
  insight_type: string;
  title: string;
  description: string | null;
  is_urgent: boolean | null;
  display_until: string | null;
  created_at: string | null;
  user_id: string | null;
}

export function useChildrenInsights() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['children-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children_insights')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ChildInsight[];
    },
    enabled: !!user,
  });
}

/**
 * Retorna o insight mais recente de cada filho
 */
export function useLatestChildInsights() {
  const { data: allInsights = [], ...rest } = useChildrenInsights();
  
  // Agrupa por child_id e pega o mais recente de cada
  const latestByChild = allInsights.reduce((acc, insight) => {
    if (!insight.child_id) return acc;
    if (!acc[insight.child_id]) {
      acc[insight.child_id] = insight;
    }
    return acc;
  }, {} as Record<string, ChildInsight>);
  
  return {
    ...rest,
    data: latestByChild,
  };
}
