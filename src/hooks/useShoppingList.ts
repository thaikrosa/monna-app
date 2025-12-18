import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity_text: string | null;
  tag_id: string | null;
  tag_name: string | null;
  notes: string | null;
  is_checked: boolean;
  avg_days_between: number | null;
}

export interface ShoppingTag {
  id: string;
  name: string;
}

export function useShoppingItems() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['shopping-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_shopping_items_with_frequency')
        .select('id, name, quantity_text, tag_id, tag_name, notes, is_checked, avg_days_between')
        .order('is_checked', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.log('[Annia Debug] fetchItems error:', error.message, error);
        throw error;
      }
      return data as ShoppingItem[];
    },
    enabled: !!user,
  });
}

export function useShoppingTags() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['shopping-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shopping_tags')
        .select('id, name')
        .order('sort_order', { ascending: true });

      if (error) {
        console.log('[Annia Debug] fetchTags error:', error.message, error);
        throw error;
      }
      return data as ShoppingTag[];
    },
    enabled: !!user,
  });
}

export function useAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, tagName }: { name: string; tagName?: string }) => {
      const { data, error } = await supabase.rpc('shopping_add_item', {
        p_name: name.trim(),
        p_tag_name: tagName?.trim() || null,
      });
      if (error) {
        console.log('[Annia Debug] addItem error:', error.message, error);
        throw error;
      }
      console.log('[Annia Debug] addItem success:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-tags'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-pending-count'] });
    },
    onError: (error: Error) => {
      console.log('[Annia Debug] addItem onError:', error);
      toast.error('Erro ao adicionar item');
    },
  });
}

export function useToggleChecked() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      const { error } = await supabase.rpc('shopping_set_item_checked', {
        p_item_id: id,
        p_checked: checked,
      });
      if (error) {
        console.log('[Annia Debug] toggleChecked error:', error.message, error);
        throw error;
      }
      console.log('[Annia Debug] toggleChecked success:', id, checked);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-pending-count'] });
    },
    onError: (error: Error) => {
      console.log('[Annia Debug] toggleChecked onError:', error);
      toast.error('Erro ao atualizar item');
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('shopping_delete_item', {
        p_item_id: id,
      });
      if (error) {
        console.log('[Annia Debug] deleteItem error:', error.message, error);
        throw error;
      }
      console.log('[Annia Debug] deleteItem success:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-pending-count'] });
    },
    onError: (error: Error) => {
      console.log('[Annia Debug] deleteItem onError:', error);
      toast.error('Erro ao remover item');
    },
  });
}

export function useClearChecked() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('shopping_clear_checked_items', {
        p_days_ago: 0,
      });
      if (error) {
        console.log('[Annia Debug] clearChecked error:', error.message, error);
        throw error;
      }
      console.log('[Annia Debug] clearChecked success:', data);
      return data;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-pending-count'] });
      if (count && count > 0) {
        toast.success(`${count} item${count > 1 ? 's' : ''} removido${count > 1 ? 's' : ''}`);
      }
    },
    onError: (error: Error) => {
      console.log('[Annia Debug] clearChecked onError:', error);
      toast.error('Erro ao limpar itens');
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      tag_id,
      quantity_text,
      notes,
    }: {
      id: string;
      tag_id?: string | null;
      quantity_text?: string | null;
      notes?: string | null;
    }) => {
      const { error } = await supabase
        .from('shopping_items')
        .update({
          tag_id: tag_id || null,
          quantity_text: quantity_text?.trim() || null,
          notes: notes?.trim() || null,
        })
        .eq('id', id);

      if (error) {
        console.log('[Annia Debug] updateItem error:', error.message, error);
        throw error;
      }
      console.log('[Annia Debug] updateItem success:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-tags'] });
    },
    onError: (error: Error) => {
      console.log('[Annia Debug] updateItem onError:', error);
      toast.error('Erro ao atualizar item');
    },
  });
}
