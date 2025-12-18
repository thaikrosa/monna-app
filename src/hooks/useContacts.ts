import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Contact {
  id: string;
  alias: string;
  formal_name: string;
  phone: string;
  intimacy_level: number;
  can_annia_message: boolean;
  category: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ContactInsert = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
export type ContactUpdate = Partial<ContactInsert>;

export function useContacts() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('alias', { ascending: true });

      if (error) throw error;
      return data as Contact[];
    },
    enabled: !!user,
  });
}

export function useAddContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: ContactInsert) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contacts-count'] });
      toast.success('Contato adicionado');
    },
    onError: (error) => {
      console.error('[Annia Debug] addContact error:', error);
      toast.error('Erro ao adicionar contato');
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ContactUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contato atualizado');
    },
    onError: (error) => {
      console.error('[Annia Debug] updateContact error:', error);
      toast.error('Erro ao atualizar contato');
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contacts-count'] });
      toast.success('Contato removido');
    },
    onError: (error) => {
      console.error('[Annia Debug] deleteContact error:', error);
      toast.error('Erro ao remover contato');
    },
  });
}
