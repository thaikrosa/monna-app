import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { ShoppingItem, ShoppingTag } from '@/hooks/useShoppingList';

export interface PrimaryShoppingData {
  items: ShoppingItem[];
  tagName: string | null;
}

export function usePrimaryShoppingItems() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['shopping-items', 'primary'],
    queryFn: async (): Promise<PrimaryShoppingData> => {
      // 1. Busca a primeira tag (por sort_order, "Mercado" tem sort_order = 0)
      const { data: tags, error: tagsError } = await supabase
        .from('shopping_tags')
        .select('id, name')
        .order('sort_order', { ascending: true })
        .limit(1);
      
      if (tagsError) throw tagsError;
      
      const primaryTag = tags?.[0] as ShoppingTag | undefined;
      
      if (!primaryTag) {
        return { items: [], tagName: null };
      }
      
      // 2. Busca itens dessa tag específica
      const { data: items, error: itemsError } = await supabase
        .from('v_shopping_items_with_frequency')
        .select('*')
        .eq('tag_id', primaryTag.id)
        .order('is_checked', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (itemsError) throw itemsError;
      
      return {
        items: (items || []) as ShoppingItem[],
        tagName: primaryTag.name,
      };
    },
    enabled: !!user,
  });
}
