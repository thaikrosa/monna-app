import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Memory {
  id: string;
  user_id: string;
  content: string;
  category: string;
  category_normalized: string;
  keywords: string[];
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemoriesData {
  memories: Memory[];
  categories: string[];
}

export function useMemories(options?: { limit?: number; category?: string; search?: string }) {
  const { user } = useAuth();
  const { limit, category, search } = options || {};

  return useQuery({
    queryKey: ['memories', user?.id, limit, category, search],
    queryFn: async (): Promise<MemoriesData> => {
      // Build query
      let query = supabase
        .from('user_memories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply category filter
      if (category && category !== 'all') {
        query = query.eq('category_normalized', category.toLowerCase());
      }

      // Apply search filter
      if (search && search.trim()) {
        query = query.ilike('content', `%${search.trim()}%`);
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data: memories, error } = await query;

      if (error) throw error;

      // Get unique categories for filter chips
      const { data: allMemories } = await supabase
        .from('user_memories')
        .select('category_normalized')
        .eq('is_active', true);

      const categories = [...new Set(
        (allMemories || []).map(m => m.category_normalized)
      )].filter(Boolean).sort();

      return {
        memories: (memories || []) as Memory[],
        categories,
      };
    },
    enabled: !!user,
  });
}

// Hook for recent memories (Home section)
export function useRecentMemories(limit: number = 3) {
  return useMemories({ limit });
}
