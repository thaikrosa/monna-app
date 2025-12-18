import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { UserRoutine, UserRoutineInsert, OnboardingProgress, ProfileUpdate } from '@/types/onboarding';

// ===== ONBOARDING PROGRESS =====

export function useOnboardingProgress() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['onboarding', 'progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as OnboardingProgress | null;
    },
    enabled: !!user,
  });
}

export function useCreateOnboardingProgress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .insert({ user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data as OnboardingProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao iniciar onboarding',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateOnboardingProgress() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (updates: Partial<OnboardingProgress>) => {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .update(updates)
        .eq('user_id', user!.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });
}

// ===== USER ROUTINES =====

export function useUserRoutines() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['routines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_routines')
        .select('*')
        .order('start_time', { ascending: true });
      if (error) throw error;
      return data as UserRoutine[];
    },
    enabled: !!user,
  });
}

export function useAddRoutine() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (routine: UserRoutineInsert) => {
      const { data, error } = await supabase
        .from('user_routines')
        .insert({
          ...routine,
          user_id: user!.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data as UserRoutine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({
        title: 'Rotina adicionada',
        description: 'Sua rotina foi salva com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar rotina',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserRoutine> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_routines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as UserRoutine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({
        title: 'Rotina atualizada',
        description: 'Suas alterações foram salvas.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar rotina',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_routines')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast({
        title: 'Rotina removida',
        description: 'A rotina foi excluída.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover rotina',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ===== PROFILE =====

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ===== HELPER: Verificar se precisa do Kickstart =====

export function useNeedsKickstart() {
  const { data: progress, isLoading } = useOnboardingProgress();
  
  return {
    needsKickstart: progress ? !progress.kickstart_completed_at : true,
    isLoading,
  };
}

// ===== HELPER: Completar Kickstart =====

export function useCompleteKickstart() {
  const updateProgress = useUpdateOnboardingProgress();
  const updateProfile = useUpdateProfile();
  
  return useMutation({
    mutationFn: async () => {
      await updateProgress.mutateAsync({
        step_welcome: true,
        step_routines: true,
        kickstart_completed_at: new Date().toISOString(),
      });
      
      await updateProfile.mutateAsync({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      });
    },
  });
}
