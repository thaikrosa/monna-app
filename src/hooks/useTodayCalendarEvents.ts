import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfDay, endOfDay } from 'date-fns';
import { useEffect, useRef } from 'react';

export interface CalendarEvent {
  id: string;
  title: string | null;
  starts_at: string;
  ends_at: string;
  is_all_day: boolean;
  location: string | null;
  status: string;
  provider: string;
  external_event_id: string;
  external_calendar_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Hook auxiliar para sync silencioso em background
function useCalendarSync() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!user || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const syncCalendar = async () => {
      try {
        // 1. Verificar se tem conexão ativa
        const { data: connection } = await supabase
          .from('calendar_connections')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'connected')
          .maybeSingle();

        if (!connection) {
          console.log('[CalendarSync] Nenhuma conexão ativa, pulando sync');
          return;
        }

        // 2. Chamar sync em background (silencioso)
        console.log('[CalendarSync] Sincronizando eventos...');
        const { error } = await supabase.functions.invoke('sync-google-calendar', {
          body: { user_id: user.id }
        });

        if (error) {
          console.warn('[CalendarSync] Erro no sync (não crítico):', error.message);
          return;
        }

        console.log('[CalendarSync] Sync concluído, invalidando queries');
        // 3. Invalidar queries para atualizar a UI
        queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      } catch (err) {
        console.warn('[CalendarSync] Erro inesperado (não crítico):', err);
      }
    };

    // Rodar sync em background sem bloquear
    syncCalendar();
  }, [user, queryClient]);
}

export function useTodayCalendarEvents() {
  const { user } = useAuth();
  
  // Dispara sync em background ao montar
  useCalendarSync();
  
  return useQuery({
    queryKey: ['calendar-events', 'today'],
    queryFn: async () => {
      const today = new Date();
      const start = startOfDay(today).toISOString();
      const end = endOfDay(today).toISOString();
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('starts_at', start)
        .lte('starts_at', end)
        .order('starts_at', { ascending: true });
      
      if (error) throw error;
      return data as CalendarEvent[];
    },
    enabled: !!user,
  });
}
