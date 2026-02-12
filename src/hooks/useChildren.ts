import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { useToast } from '@/hooks/use-toast';

export interface Child {
  id: string;
  user_id: string;
  name: string;
  nickname: string | null;
  birth_date: string;
  gender: string | null;
  is_neurodivergent: boolean | null;
  show_standard_milestones: boolean | null;
  accepted_health_disclaimer: boolean | null;
  vaccination_reminders_enabled: boolean | null;
  blood_type: string | null;
  allergies: string | null;
  medical_notes: string | null;
  special_needs_notes: string | null;
  soothing_methods: string | null;
  personality_traits: string | null;
  created_at: string;
  updated_at: string;
}

export type ChildInsert = Omit<Child, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type ChildUpdate = Partial<ChildInsert>;

export function useChildren() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Child[];
    },
    enabled: !!user,
  });
}

export function useAddChild() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (child: ChildInsert) => {
      const { data, error } = await supabase
        .from('children')
        .insert(child)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      queryClient.invalidateQueries({ queryKey: ['children-count'] });
      toast({
        title: 'Criança cadastrada',
        description: 'O cadastro foi salvo com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao cadastrar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateChild() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ChildUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      queryClient.invalidateQueries({ queryKey: ['children-count'] });
      toast({
        title: 'Dados atualizados',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteChild() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      queryClient.invalidateQueries({ queryKey: ['children-count'] });
      toast({
        title: 'Cadastro removido',
        description: 'A criança foi removida do sistema.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
