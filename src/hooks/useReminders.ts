import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import type {
  Reminder,
  ReminderInsert,
  ReminderUpdate,
  ReminderOccurrence,
  TodayReminder,
  UpcomingReminder,
} from '@/types/reminders';

// ===== QUERIES =====

/**
 * Busca lembretes de hoje via view `today_reminders`
 */
export function useTodayReminders() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['reminders', 'today'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('today_reminders')
        .select('*')
        .order('scheduled_at', { ascending: true });
      if (error) throw error;
      return data as TodayReminder[];
    },
    enabled: !!user,
  });
}

/**
 * Busca próximos lembretes via view `upcoming_reminders`
 */
export function useUpcomingReminders() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['reminders', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upcoming_reminders')
        .select('*')
        .order('scheduled_at', { ascending: true });
      if (error) throw error;
      return data as UpcomingReminder[];
    },
    enabled: !!user,
  });
}

/**
 * Busca lembretes de uma data específica usando timezone local.
 * Se includeOverdue=true (para "hoje"), também traz atrasados.
 */
export function useRemindersByDate(date: Date, includeOverdue: boolean = false) {
  const { user } = useSession();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  return useQuery({
    queryKey: ['reminders', 'date', dateStr, includeOverdue],
    queryFn: async () => {
      const startOfDay = `${dateStr}T00:00:00`;
      const endOfDay = `${dateStr}T23:59:59`;
      
      // Fetch reminders for the selected day
      const { data: dayReminders, error } = await supabase
        .from('upcoming_reminders')
        .select('*')
        .gte('scheduled_at', startOfDay)
        .lte('scheduled_at', endOfDay)
        .order('scheduled_at', { ascending: true });
      if (error) throw error;
      
      let allReminders = (dayReminders || []) as UpcomingReminder[];
      
      // For "today", also fetch overdue reminders (before today, still pending/snoozed)
      if (includeOverdue) {
        const { data: overdueReminders, error: overdueError } = await supabase
          .from('upcoming_reminders')
          .select('*')
          .lt('scheduled_at', startOfDay)
          .in('occurrence_status', ['pending', 'snoozed', 'notified'])
          .order('scheduled_at', { ascending: true });
        if (overdueError) throw overdueError;
        
        // Overdue first, then today's in chronological order
        allReminders = [...(overdueReminders || []) as UpcomingReminder[], ...allReminders];
      }
      
      return allReminders;
    },
    enabled: !!user && !!date,
  });
}

/**
 * Busca um reminder específico com suas occurrences
 */
export function useReminder(id: string | undefined) {
  return useQuery({
    queryKey: ['reminders', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: reminder, error: reminderError } = await supabase
        .from('reminders')
        .select('*')
        .eq('id', id)
        .single();
      if (reminderError) throw reminderError;

      const { data: occurrences, error: occError } = await supabase
        .from('reminder_occurrences')
        .select('*')
        .eq('reminder_id', id)
        .order('scheduled_at', { ascending: true });
      if (occError) throw occError;

      return {
        reminder: reminder as Reminder,
        occurrences: occurrences as ReminderOccurrence[],
      };
    },
    enabled: !!id,
  });
}

// ===== MUTATIONS =====

/**
 * Adiciona novo reminder (trigger gera occurrences automaticamente)
 */
export function useAddReminder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reminder: ReminderInsert) => {
      const { data, error } = await supabase
        .from('reminders')
        .insert(reminder as any)
        .select()
        .single();
      if (error) throw error;
      return data as Reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

/**
 * Atualiza reminder existente
 */
export function useUpdateReminder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: ReminderUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('reminders')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

/**
 * Deleta reminder (cascade deleta occurrences)
 */
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
    },
  });
}

/**
 * Marca occurrence como acknowledged (concluída)
 */
export function useAcknowledgeOccurrence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (occurrenceId: string) => {
      const { data, error } = await supabase
        .from('reminder_occurrences')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', occurrenceId)
        .select()
        .single();
      if (error) throw error;
      return data as ReminderOccurrence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

/**
 * Adia uma occurrence por X minutos
 */
export function useSnoozeOccurrence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ occurrenceId, minutes }: { occurrenceId: string; minutes: number }) => {
      // Primeiro busca o snooze_count atual
      const { data: current, error: fetchError } = await supabase
        .from('reminder_occurrences')
        .select('snooze_count')
        .eq('id', occurrenceId)
        .single();
      if (fetchError) throw fetchError;
      
      const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('reminder_occurrences')
        .update({
          status: 'snoozed',
          snoozed_until: snoozedUntil,
          snooze_count: (current?.snooze_count ?? 0) + 1,
        })
        .eq('id', occurrenceId)
        .select()
        .single();
      if (error) throw error;
      return data as ReminderOccurrence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

// ===== CONTADOR PARA DASHBOARD =====

export function useTodayRemindersCount() {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['reminders', 'today-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('today_reminders')
        .select('*', { count: 'exact', head: true })
        .eq('occurrence_status', 'pending');
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });
}

// ===== RE-EXPORTS para compatibilidade =====
export type { Reminder, ReminderInsert, ReminderUpdate, ReminderOccurrence, TodayReminder, UpcomingReminder };
