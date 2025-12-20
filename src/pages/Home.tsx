import { useProfile } from "@/hooks/useProfile";
import { useChildren } from "@/hooks/useChildren";
import { useShoppingItems } from "@/hooks/useShoppingList";
import { useGoogleCalendarConnection } from "@/hooks/useCalendarConnections";
import { useDailyInsight } from "@/hooks/useDailyInsight";
import { useAiSuggestions } from "@/hooks/useAiSuggestions";
import { useLatestChildInsights } from "@/hooks/useChildrenInsights";
import { useTodayCalendarEvents } from "@/hooks/useTodayCalendarEvents";
import { usePendingReminders } from "@/hooks/usePendingReminders";

import { GreetingCard } from "@/components/home/GreetingCard";
import { VoiceOfAnnia } from "@/components/home/VoiceOfAnnia";
import { CalendarSection } from "@/components/home/CalendarSection";
import { RemindersSection } from "@/components/home/RemindersSection";
import { ShoppingSection } from "@/components/home/ShoppingSection";
import { KidsDashboard } from "@/components/home/KidsDashboard";
import { AnniaMomentSection } from "@/components/home/AnniaMomentSection";
import { BottomBar } from "@/components/home/BottomBar";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { HomeError } from "@/components/home/HomeError";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function getGreetingTitle(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
}

export default function Home() {
  // Dados do usuário
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfile();
  
  // Dados dinâmicos
  const { data: dailyInsight } = useDailyInsight();
  const { data: calendarConnection } = useGoogleCalendarConnection();
  const { data: calendarEvents = [] } = useTodayCalendarEvents();
  const { data: pendingReminders = [] } = usePendingReminders();
  const { data: shoppingItems = [] } = useShoppingItems();
  const { data: children = [] } = useChildren();
  const { data: childrenInsights = {} } = useLatestChildInsights();
  const { data: suggestions = [] } = useAiSuggestions();

  // Loading state
  if (profileLoading) {
    return (
      <div className="max-w-2xl mx-auto pb-20 px-4">
        <HomeSkeleton />
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="max-w-2xl mx-auto pb-20 px-4">
        <HomeError onRetry={() => refetchProfile()} />
        <BottomBar />
      </div>
    );
  }

  const displayName = profile?.nickname || profile?.first_name || 'você';
  const greetingTitle = getGreetingTitle();
  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  // Monta objeto de greeting para GreetingCard
  const greeting = {
    title: `${greetingTitle}, ${displayName}.`,
    insight: dailyInsight?.message || 'Vamos organizar o dia juntas?',
    microcopy: todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1),
    primaryCta: { label: 'Revisar lembretes', action: 'review_reminders' as const },
    secondaryCta: undefined,
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 space-y-5 animate-fade-in">
      {/* 1. Saudação */}
      <GreetingCard
        greeting={greeting}
        displayName={displayName}
        onPrimaryCta={() => {}}
      />

      {/* 2. Voz da Annia (Mensagem do Dia) */}
      <VoiceOfAnnia insight={dailyInsight} />

      {/* 3. Agenda do Dia */}
      <CalendarSection 
        connection={calendarConnection} 
        events={calendarEvents} 
      />

      {/* 4. Lembretes e Urgências */}
      <RemindersSection reminders={pendingReminders} />

      {/* 5. Lista de Compras */}
      <ShoppingSection items={shoppingItems} />

      {/* 6. Dashboard dos Filhos */}
      <KidsDashboard 
        children={children} 
        insights={childrenInsights}
      />

      {/* 7. Momento Annia (Sugestões) */}
      {suggestions.length > 0 && (
        <AnniaMomentSection suggestions={suggestions} />
      )}

      {/* Bottom navigation */}
      <BottomBar />
    </div>
  );
}
