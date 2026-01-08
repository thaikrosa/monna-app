import { useProfile } from "@/hooks/useProfile";
import { useChildren } from "@/hooks/useChildren";
import { useShoppingItems } from "@/hooks/useShoppingList";
import { useGoogleCalendarConnection } from "@/hooks/useCalendarConnections";
import { useAiSuggestions } from "@/hooks/useAiSuggestions";
import { useLatestChildInsights } from "@/hooks/useChildrenInsights";
import { useTodayCalendarEvents } from "@/hooks/useTodayCalendarEvents";
import { usePendingReminders } from "@/hooks/usePendingReminders";

import { CalendarSection } from "@/components/home/CalendarSection";
import { RemindersSection } from "@/components/home/RemindersSection";
import { ShoppingSection } from "@/components/home/ShoppingSection";
import { KidsDashboard } from "@/components/home/KidsDashboard";
import { AnniaMomentSection } from "@/components/home/AnniaMomentSection";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { HomeError } from "@/components/home/HomeError";

export default function Home() {
  // Dados do usuário
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfile();
  
  // Dados dinâmicos
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
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-4 px-4 space-y-5">
      {/* 1. Agenda do Dia */}
      <div className="animate-slide-up stagger-1">
        <CalendarSection 
          connection={calendarConnection} 
          events={calendarEvents} 
        />
      </div>

      {/* 2. Lembretes e Urgências */}
      <div className="animate-slide-up stagger-2">
        <RemindersSection reminders={pendingReminders} />
      </div>

      {/* 3. Lista de Compras */}
      <div className="animate-slide-up stagger-3">
        <ShoppingSection items={shoppingItems} />
      </div>

      {/* 4. Dashboard dos Filhos */}
      <div className="animate-slide-up stagger-4">
        <KidsDashboard 
          children={children} 
          insights={childrenInsights}
        />
      </div>

      {/* 5. Momento Annia (Sugestões) */}
      {suggestions.length > 0 && (
        <div className="animate-slide-up stagger-5">
          <AnniaMomentSection suggestions={suggestions} />
        </div>
      )}
    </div>
  );
}
