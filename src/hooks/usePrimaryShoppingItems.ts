import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import type { ShoppingItem, ShoppingTag } from '@/hooks/useShoppingList';

export interface PrimaryShoppingData {
  items: ShoppingItem[];
  tagName: string | null;
}

export function usePrimaryShoppingItems() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['shopping-items', 'primary'],
    queryFn: async (): Promise<PrimaryShoppingData> => {
      // 1. Busca a tag "Mercado" pelo name_norm (sempre lowercase)
      const { data: tag, error: tagsError } = await supabase
        .from('shopping_tags')
        .select('id, name')
        .eq('name_norm', 'mercado')
        .maybeSingle();
      
      if (tagsError) throw tagsError;
      
      if (!tag) {
        return { items: [], tagName: null };
      }
      
      // 2. Busca itens pendentes dessa tag pelo UUID
      const { data: items, error: itemsError } = await supabase
        .from('v_shopping_items_with_frequency')
        .select('*')
        .eq('tag_id', tag.id)
        .eq('is_checked', false)
        .order('created_at', { ascending: false });
      
      if (itemsError) throw itemsError;
      
      return {
        items: (items || []) as ShoppingItem[],
        tagName: tag.name,
      };
    },
    enabled: !!user,
  });
}
