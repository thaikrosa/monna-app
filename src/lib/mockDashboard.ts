/**
 * Mock data for the home dashboard.
 * Used when user is not a subscriber to show sample data.
 *
 * IMPORTANT: This file contains static mock data only.
 * No React hooks, no Supabase access.
 */

import type { HomeDashboard } from '@/types/home-dashboard';

interface GreetingData {
  title: string;
  insight: string;
  primaryLabel: string;
  primaryAction: 'create_event' | 'review_reminders';
  secondaryLabel: string;
}

/**
 * Get greeting data based on current time of day.
 * Pure function with no side effects.
 */
export function getGreetingByTime(): GreetingData {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      title: 'Bom dia',
      insight: 'Eu já achei uma janela às 14:00 para você descansar.',
      primaryLabel: 'Criar evento: Descanso (14:00–15:00)',
      primaryAction: 'create_event',
      secondaryLabel: 'Ajustar horário',
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      title: 'Como seu dia está indo?',
      insight: 'Se você quiser, eu organizo o resto da tarde por prioridade.',
      primaryLabel: 'Revisar lembretes: manter só os prioritários',
      primaryAction: 'review_reminders',
      secondaryLabel: 'Ajustar',
    };
  } else {
    return {
      title: 'Você chegou até aqui.',
      insight: 'Amanhã, o melhor ponto de respiro é às 09:30.',
      primaryLabel: 'Criar evento: Descanso (09:30–10:30)',
      primaryAction: 'create_event',
      secondaryLabel: 'Ajustar horário',
    };
  }
}

/**
 * Create mock dashboard data for non-subscribers.
 * Pure function - no React, no Supabase.
 */
export function createMockDashboard(firstName?: string | null): HomeDashboard {
  const greetingData = getGreetingByTime();
  const displayName = firstName || 'você';

  return {
    profile: { first_name: firstName, nickname: null },
    greeting: {
      title: greetingData.title === 'Bom dia' ? `Bom dia, ${displayName}.` : greetingData.title,
      insight: greetingData.insight,
      microcopy: 'Atualizado agora • Agenda conectada',
      primaryCta: { label: greetingData.primaryLabel, action: greetingData.primaryAction },
      secondaryCta: { label: greetingData.secondaryLabel, action: 'adjust' },
    },
    today: {
      agenda: [
        { id: 'mock-1', start_time: '09:00', end_time: '10:00', title: 'Reunião de planejamento' },
        { id: 'mock-2', start_time: '14:00', end_time: '15:00', title: 'Consulta pediatra - Lucas' },
        { id: 'mock-3', start_time: '16:30', end_time: '17:00', title: 'Ligar para escola' },
      ],
      reminders: [
        { id: 'mock-1', title: 'Pagar conta de luz', priority: 'important' },
        { id: 'mock-2', title: 'Comprar presente aniversário Bia', priority: 'normal' },
        { id: 'mock-3', title: 'Renovar carteirinha do Lucas', priority: 'urgent', is_overdue: true },
      ],
      urgent_overdue: [{ id: 'mock-1', title: 'Renovar carteirinha do Lucas', days_overdue: 3 }],
      shopping: {
        total_items: 12,
        top_items: [
          { id: 'mock-1', name: 'Leite', qty: '2L' },
          { id: 'mock-2', name: 'Pão integral', qty: null },
          { id: 'mock-3', name: 'Frutas variadas', qty: null },
        ],
      },
      kids: [
        {
          id: 'mock-1',
          child_name: 'Lucas',
          age_label: '4 anos',
          message: 'Eu lembrei: a vacina de reforço vence em 5 dias.',
          primaryCta: { label: 'Criar lembrete', action: 'create_reminder' },
          secondaryCta: { label: 'Já fiz', action: 'dismiss' },
        },
      ],
      annia_moment: [
        {
          id: 'mock-1',
          insight:
            'Percebi que você tem 3 compromissos seguidos à tarde. Que tal eu sugerir um intervalo de 15 minutos entre eles?',
          actions: { accept: {}, adjust: {}, dismiss: {} },
        },
        {
          id: 'mock-2',
          insight: 'O aniversário da Bia é em 2 semanas. Eu posso te ajudar a organizar a festa.',
          actions: { accept: {}, dismiss: {} },
        },
      ],
    },
    paywall: { is_subscriber: false },
  };
}
