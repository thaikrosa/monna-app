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
    <div className="max-w-2xl mx-auto pb-24 px-4 space-y-5">
      {/* 1. Saudação */}
      <div className="animate-slide-up stagger-1">
        <GreetingCard
          greeting={greeting}
          displayName={displayName}
          onPrimaryCta={() => {}}
        />
      </div>

      {/* 2. Voz da Annia (Mensagem do Dia) */}
      <div className="animate-slide-up stagger-2">
        <VoiceOfAnnia insight={dailyInsight} />
      </div>

      {/* 3. Agenda do Dia */}
      <div className="animate-slide-up stagger-3">
        <CalendarSection 
          connection={calendarConnection} 
          events={calendarEvents} 
        />
      </div>

      {/* 4. Lembretes e Urgências */}
      <div className="animate-slide-up stagger-4">
        <RemindersSection reminders={pendingReminders} />
      </div>

      {/* 5. Lista de Compras */}
      <div className="animate-slide-up stagger-5">
        <ShoppingSection items={shoppingItems} />
      </div>

      {/* 6. Dashboard dos Filhos */}
      <div className="animate-slide-up stagger-6">
        <KidsDashboard 
          children={children} 
          insights={childrenInsights}
        />
      </div>

      {/* 7. Momento Annia (Sugestões) */}
      {suggestions.length > 0 && (
        <div className="animate-slide-up stagger-6">
          <AnniaMomentSection suggestions={suggestions} />
        </div>
      )}

      {/* Bottom navigation */}
      <BottomBar />
    </div>
  );
}
