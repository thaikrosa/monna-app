import { useProfile } from "@/hooks/useProfile";
import { usePrimaryShoppingItems } from "@/hooks/usePrimaryShoppingItems";
import { useGoogleCalendarConnection } from "@/hooks/useCalendarConnections";
import { useAiSuggestions } from "@/hooks/useAiSuggestions";
import { useTodayCalendarEvents } from "@/hooks/useTodayCalendarEvents";
import { usePendingReminders } from "@/hooks/usePendingReminders";

import { CalendarSection } from "@/components/home/CalendarSection";
import { RemindersSection } from "@/components/home/RemindersSection";
import { ShoppingSection } from "@/components/home/ShoppingSection";
import { MemorySection } from "@/components/home/MemorySection";
import { AnniaMomentSection } from "@/components/home/AnniaMomentSection";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { HomeError } from "@/components/home/HomeError";
import { HomeFooter } from "@/components/home/HomeFooter";
import { TalkToMonnaButton } from "@/components/home/TalkToMonnaButton";

export default function Home() {
  // Dados do usuário
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfile();
  
  // Dados dinâmicos
  const { data: calendarConnection } = useGoogleCalendarConnection();
  const { data: calendarEvents = [] } = useTodayCalendarEvents();
  const { data: pendingReminders = [] } = usePendingReminders();
  const { data: shoppingData } = usePrimaryShoppingItems();
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
    <div className="max-w-2xl mx-auto pb-4 px-4 space-y-6">
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

      {/* 3. Lista de Compras (tag principal) */}
      <div className="animate-slide-up stagger-3">
        <ShoppingSection 
          items={shoppingData?.items || []} 
          tagName={shoppingData?.tagName || null}
        />
      </div>

      {/* 4. Memória */}
      <div className="animate-slide-up stagger-4">
        <MemorySection />
      </div>

      {/* 5. Momento Annia (Sugestões) */}
      {suggestions.length > 0 && (
        <div className="animate-slide-up stagger-5">
          <AnniaMomentSection suggestions={suggestions} />
        </div>
      )}

      {/* 6. Botão WhatsApp - Falar com a Monna */}
      <div className="animate-slide-up stagger-6">
        <TalkToMonnaButton />
      </div>

      {/* Rodapé discreto */}
      <HomeFooter />
    </div>
  );
}
