import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CalendarConnection {
  id: string;
  user_id: string;
  provider: string;
  external_calendar_id: string;
  status: string;
  scopes: string[];
  last_synced_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export function useCalendarConnections() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-connections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CalendarConnection[];
    },
    enabled: !!user,
  });
}

export function useGoogleCalendarConnection() {
  const { data: connections = [], ...rest } = useCalendarConnections();
  
  const googleConnection = connections.find(c => c.provider === 'google');
  
  return {
    ...rest,
    data: googleConnection || null,
    isConnected: googleConnection?.status === 'connected',
  };
}
