import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HomeDashboard } from '@/types/home-dashboard';
import { useAuth } from '@/hooks/useAuth';

function getGreetingByTime(): { title: string; insight: string; primaryLabel: string; primaryAction: "create_event" | "review_reminders"; secondaryLabel: string } {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      title: 'Bom dia',
      insight: 'Eu já achei uma janela às 14:00 para você descansar.',
      primaryLabel: 'Criar evento: Descanso (14:00–15:00)',
      primaryAction: 'create_event',
      secondaryLabel: 'Ajustar horário'
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      title: 'Como seu dia está indo?',
      insight: 'Se você quiser, eu organizo o resto da tarde por prioridade.',
      primaryLabel: 'Revisar lembretes: manter só os prioritários',
      primaryAction: 'review_reminders',
      secondaryLabel: 'Ajustar'
    };
  } else {
    return {
      title: 'Você chegou até aqui.',
      insight: 'Amanhã, o melhor ponto de respiro é às 09:30.',
      primaryLabel: 'Criar evento: Descanso (09:30–10:30)',
      primaryAction: 'create_event',
      secondaryLabel: 'Ajustar horário'
    };
  }
}

function createMockDashboard(firstName?: string): HomeDashboard {
  const greetingData = getGreetingByTime();
  const displayName = firstName || 'você';
  
  return {
    profile: { first_name: firstName, nickname: null },
    greeting: {
      title: greetingData.title === 'Bom dia' ? `Bom dia, ${displayName}.` : greetingData.title,
      insight: greetingData.insight,
      microcopy: 'Atualizado agora • Agenda conectada',
      primaryCta: { label: greetingData.primaryLabel, action: greetingData.primaryAction },
      secondaryCta: { label: greetingData.secondaryLabel, action: 'adjust' }
    },
    today: {
      agenda: [
        { id: '1', start_time: '09:00', end_time: '10:00', title: 'Reunião de planejamento' },
        { id: '2', start_time: '14:00', end_time: '15:00', title: 'Consulta pediatra - Lucas' },
        { id: '3', start_time: '16:30', end_time: '17:00', title: 'Ligar para escola' }
      ],
      reminders: [
        { id: '1', title: 'Pagar conta de luz', priority: 'important' },
        { id: '2', title: 'Comprar presente aniversário Bia', priority: 'normal' },
        { id: '3', title: 'Renovar carteirinha do Lucas', priority: 'urgent', is_overdue: true }
      ],
      urgent_overdue: [
        { id: '1', title: 'Renovar carteirinha do Lucas', days_overdue: 3 }
      ],
      shopping: {
        total_items: 12,
        top_items: [
          { id: '1', name: 'Leite', qty: '2L' },
          { id: '2', name: 'Pão integral', qty: null },
          { id: '3', name: 'Frutas variadas', qty: null }
        ]
      },
      kids: [
        {
          id: '1',
          child_name: 'Lucas',
          age_label: '4 anos',
          message: 'Eu lembrei: a vacina de reforço vence em 5 dias.',
          primaryCta: { label: 'Criar lembrete', action: 'create_reminder' },
          secondaryCta: { label: 'Já fiz', action: 'dismiss' }
        }
      ],
      annia_moment: [
        {
          id: '1',
          insight: 'Percebi que você tem 3 compromissos seguidos à tarde. Que tal eu sugerir um intervalo de 15 minutos entre eles?',
          actions: { accept: {}, adjust: {}, dismiss: {} }
        },
        {
          id: '2',
          insight: 'O aniversário da Bia é em 2 semanas. Eu posso te ajudar a organizar a festa.',
          actions: { accept: {}, dismiss: {} }
        }
      ]
    },
    paywall: { is_subscriber: true }
  };
}

export function useHomeDashboard() {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ['home-dashboard', user?.id],
    queryFn: async (): Promise<HomeDashboard> => {
      if (!user) throw new Error('Not authenticated');

      // Check subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      const isSubscriber = subscription?.status === 'active';

      // Get profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, nickname')
        .eq('id', user.id)
        .maybeSingle();

      // Try to call RPC - if it doesn't exist, use mock
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_home_dashboard');
        
        if (!rpcError && rpcData && typeof rpcData === 'object') {
          // RPC exists and returned data
          const dashboardData = rpcData as unknown as HomeDashboard;
          return {
            ...dashboardData,
            paywall: { is_subscriber: isSubscriber }
          };
        }
      } catch {
        // RPC doesn't exist, fall through to mock
      }

      // Use mock data with real profile info
      const mockData = createMockDashboard(profile?.nickname || profile?.first_name);
      
      // Get real data where available
      const { data: reminders } = await supabase
        .from('today_reminders')
        .select('*')
        .limit(5);

      const { data: shoppingItems } = await supabase
        .from('v_shopping_items_with_frequency')
        .select('*')
        .eq('is_checked', false);

      const { data: children } = await supabase
        .from('children')
        .select('*')
        .limit(2);

      // Merge real data into mock
      if (reminders && reminders.length > 0) {
        mockData.today.reminders = reminders.slice(0, 3).map(r => ({
          id: r.id || '',
          title: r.title || '',
          priority: r.priority || 'normal',
          is_overdue: false
        }));
        mockData.today.urgent_overdue = reminders
          .filter(r => r.occurrence_status === 'missed')
          .slice(0, 2)
          .map(r => ({
            id: r.id || '',
            title: r.title || '',
            days_overdue: 1
          }));
      }

      if (shoppingItems) {
        mockData.today.shopping = {
          total_items: shoppingItems.length,
          top_items: shoppingItems.slice(0, 3).map(i => ({
            id: i.id || '',
            name: i.name || '',
            qty: i.quantity_text
          }))
        };
      }

      if (children && children.length > 0) {
        mockData.today.kids = children.slice(0, 2).map(c => ({
          id: c.id,
          child_name: c.nickname || c.name,
          age_label: calculateAge(c.birth_date),
          message: 'Eu lembrei: confira os próximos marcos de desenvolvimento.',
          primaryCta: { label: 'Ver perfil', action: 'open_child' as const },
          secondaryCta: { label: 'Depois', action: 'dismiss' as const }
        }));
      }

      return {
        ...mockData,
        paywall: { is_subscriber: isSubscriber }
      };
    },
    enabled: !!user && !authLoading,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

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
