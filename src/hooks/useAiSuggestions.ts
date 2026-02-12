import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';

export interface AiSuggestion {
  id: string;
  title: string;
  description: string | null;
  suggestion_type: string | null;
  status: string | null;
  action_metadata: Record<string, unknown> | null;
  expires_at: string | null;
  created_at: string | null;
  user_id: string | null;
}

export function useAiSuggestions() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['ai-suggestions', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as AiSuggestion[];
    },
    enabled: !!user,
  });
}

export function useUpdateSuggestionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'dismissed' }) => {
      const { error } = await supabase
        .from('ai_suggestions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-suggestions'] });
    },
  });
}
