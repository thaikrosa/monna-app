import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { HomeDashboard } from '@/types/home-dashboard';
import { createMockDashboard, getGreetingByTime } from '@/lib/mockDashboard';

type AgendaViewRow = Database['public']['Views']['agenda_view']['Row'];

/**
 * Calculate human-readable age from birth date.
 */
function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();

  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

export function useHomeDashboard() {
  return useQuery({
    queryKey: ['home-dashboard'],
    queryFn: async (): Promise<HomeDashboard> => {
      // 1. Get logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 2. Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      const isSubscriber = subscription?.status === 'active';

      // 3. Fetch profile for display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, nickname')
        .eq('id', user.id)
        .maybeSingle();

      const displayName = profile?.nickname || profile?.first_name;

      // 4. If NOT subscriber → return MOCK data
      // Mock data is isolated in lib/mockDashboard.ts
      if (!isSubscriber) {
        return {
          ...createMockDashboard(displayName),
          paywall: { is_subscriber: false },
        };
      }

      // 5. If IS subscriber → fetch REAL data in parallel
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      // Use Promise.allSettled so one failing query doesn't break others
      const results = await Promise.allSettled([
        supabase.from('today_reminders').select('*').limit(5),
        supabase.from('v_shopping_items_with_frequency').select('*').eq('is_checked', false),
        supabase.from('children').select('*').limit(2),
        supabase
          .from('agenda_view')
          .select('*')
          .gte('starts_at', startOfDay)
          .lt('starts_at', endOfDay)
          .order('starts_at', { ascending: true })
          .limit(10),
      ]);

      // Extract data from settled results, defaulting to empty on failure
      const remindersResult = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
      const shoppingResult = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
      const childrenResult = results[2].status === 'fulfilled' ? results[2].value : { data: [] };
      const calendarResult = results[3].status === 'fulfilled' ? results[3].value : { data: [] };

      // 6. Build response with real data
      const greetingData = getGreetingByTime();

      return {
        profile: { first_name: profile?.first_name, nickname: profile?.nickname },
        greeting: {
          title: `${greetingData.title}, ${displayName || 'você'}.`,
          insight: greetingData.insight,
          microcopy: 'Atualizado agora',
          primaryCta: { label: greetingData.primaryLabel, action: greetingData.primaryAction },
          secondaryCta: { label: greetingData.secondaryLabel, action: 'adjust' },
        },
        today: {
          agenda: (calendarResult.data || []).map((event: AgendaViewRow) => ({
            id: event.instance_id || event.event_id || '',
            start_time: event.is_all_day
              ? 'Dia todo'
              : new Date(event.starts_at!).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            end_time:
              event.is_all_day || !event.ends_at
                ? undefined
                : new Date(event.ends_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            title: event.title || 'Evento sem título',
          })),
          reminders: (remindersResult.data || []).slice(0, 3).map((r) => ({
            id: r.id || '',
            title: r.title || '',
            priority: r.priority || 'normal',
            is_overdue: r.occurrence_status === 'missed',
          })),
          urgent_overdue: (remindersResult.data || [])
            .filter((r) => r.occurrence_status === 'missed')
            .slice(0, 2)
            .map((r) => ({ id: r.id || '', title: r.title || '', days_overdue: 1 })),
          shopping: {
            total_items: shoppingResult.data?.length || 0,
            top_items: (shoppingResult.data || []).slice(0, 3).map((i) => ({
              id: i.id || '',
              name: i.name || '',
              qty: i.quantity_text,
            })),
          },
          kids: (childrenResult.data || []).slice(0, 2).map((c) => ({
            id: c.id,
            child_name: c.nickname || c.name,
            age_label: calculateAge(c.birth_date),
            message: 'Confira os próximos marcos de desenvolvimento.',
            primaryCta: { label: 'Ver perfil', action: 'open_child' as const },
            secondaryCta: { label: 'Depois', action: 'dismiss' as const },
          })),
          annia_moment: [],
        },
        paywall: { is_subscriber: true },
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}
