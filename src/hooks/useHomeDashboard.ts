import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HomeDashboard } from '@/types/home-dashboard';

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
    paywall: { is_subscriber: false }
  };
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

export function useHomeDashboard() {
  return useQuery({
    queryKey: ['home-dashboard'],
    queryFn: async (): Promise<HomeDashboard> => {
      // 1. Pegar usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 2. Verificar assinatura
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      const isSubscriber = subscription?.status === 'active';

      // 3. Buscar profile para o nome
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, nickname')
        .eq('id', user.id)
        .maybeSingle();

      const displayName = profile?.nickname || profile?.first_name;

      // 4. Se NÃO é assinante → retorna MOCKUP
      if (!isSubscriber) {
        const mockData = createMockDashboard(displayName);
        return {
          ...mockData,
          paywall: { is_subscriber: false }
        };
      }

      // 5. Se É assinante → busca dados REAIS em paralelo
      // Início e fim do dia em UTC considerando timezone local
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      const [remindersResult, shoppingResult, childrenResult, calendarResult] = await Promise.all([
        supabase.from('today_reminders').select('*').limit(5),
        supabase.from('v_shopping_items_with_frequency').select('*').eq('is_checked', false),
        supabase.from('children').select('*').limit(2),
        // Buscar eventos de hoje via agenda_view (corrige recorrentes)
        supabase
          .from('agenda_view')
          .select('*')
          .gte('starts_at', startOfDay)
          .lt('starts_at', endOfDay)
          .order('starts_at', { ascending: true })
          .limit(10)
      ]);

      // 6. Montar resposta com dados reais
      const greetingData = getGreetingByTime();

      return {
        profile: { first_name: profile?.first_name, nickname: profile?.nickname },
        greeting: {
          title: `${greetingData.title}, ${displayName || 'você'}.`,
          insight: greetingData.insight,
          microcopy: 'Atualizado agora',
          primaryCta: { label: greetingData.primaryLabel, action: greetingData.primaryAction },
          secondaryCta: { label: greetingData.secondaryLabel, action: 'adjust' }
        },
        today: {
          agenda: (calendarResult.data || []).map(event => ({
            id: (event as any).instance_id || (event as any).event_id,
            start_time: event.is_all_day 
              ? 'Dia todo'
              : new Date(event.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            end_time: event.is_all_day || !event.ends_at
              ? undefined
              : new Date(event.ends_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            title: event.title || 'Evento sem título'
          })),
          reminders: (remindersResult.data || []).slice(0, 3).map(r => ({
            id: r.id || '',
            title: r.title || '',
            priority: r.priority || 'normal',
            is_overdue: r.occurrence_status === 'missed'
          })),
          urgent_overdue: (remindersResult.data || [])
            .filter(r => r.occurrence_status === 'missed')
            .slice(0, 2)
            .map(r => ({ id: r.id || '', title: r.title || '', days_overdue: 1 })),
          shopping: {
            total_items: shoppingResult.data?.length || 0,
            top_items: (shoppingResult.data || []).slice(0, 3).map(i => ({
              id: i.id || '',
              name: i.name || '',
              qty: i.quantity_text
            }))
          },
          kids: (childrenResult.data || []).slice(0, 2).map(c => ({
            id: c.id,
            child_name: c.nickname || c.name,
            age_label: calculateAge(c.birth_date),
            message: 'Confira os próximos marcos de desenvolvimento.',
            primaryCta: { label: 'Ver perfil', action: 'open_child' as const },
            secondaryCta: { label: 'Depois', action: 'dismiss' as const }
          })),
          annia_moment: []
        },
        paywall: { is_subscriber: true }
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}
