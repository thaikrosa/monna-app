import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Reminder = Tables<'reminders'>;
export type ReminderInsert = TablesInsert<'reminders'>;
export type ReminderUpdate = TablesUpdate<'reminders'>;

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
  });
}

export function useTodayReminders() {
  return useQuery({
    queryKey: ['reminders-today'],
    queryFn: async () => {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .gte('due_date', startOfDay)
        .lte('due_date', endOfDay)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
  });
}

export function useWeekReminders(startDate: Date) {
  return useQuery({
    queryKey: ['reminders-week', startDate.toISOString()],
    queryFn: async () => {
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0).toISOString();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .gte('due_date', start)
        .lte('due_date', end)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
  });
}

export function useRemindersByDate(date: Date) {
  return useQuery({
    queryKey: ['reminders-date', date.toDateString()],
    queryFn: async () => {
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).toISOString();
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .gte('due_date', startOfDay)
        .lte('due_date', endOfDay)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
  });
}

export function useAddReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reminder: ReminderInsert) => {
      const { data, error } = await supabase
        .from('reminders')
        .insert(reminder)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-week'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-date'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today-count'] });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: ReminderUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('reminders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-week'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-date'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today-count'] });
    },
  });
}

export function useCompleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('reminders')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-week'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-date'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today-count'] });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-week'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-date'] });
      queryClient.invalidateQueries({ queryKey: ['reminders-today-count'] });
    },
  });
}
