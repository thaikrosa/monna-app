import { useState } from 'react';
import { useHomeDashboard } from '@/hooks/useHomeDashboard';
import { GreetingCard } from '@/components/home/GreetingCard';
import { TodayAgendaCard } from '@/components/home/TodayAgendaCard';
import { TodayRemindersCard } from '@/components/home/TodayRemindersCard';
import { UrgentRemindersCard } from '@/components/home/UrgentRemindersCard';
import { ShoppingCard } from '@/components/home/ShoppingCard';
import { KidsAlerts } from '@/components/home/KidsAlerts';
import { AnniaMoment } from '@/components/home/AnniaMoment';
import { PaywallTeaser } from '@/components/home/PaywallTeaser';
import { BottomBar } from '@/components/home/BottomBar';
import { ConnectCalendarSheet } from '@/components/home/ConnectCalendarSheet';
import { HomeSkeleton } from '@/components/home/HomeSkeleton';
import { HomeError } from '@/components/home/HomeError';
import { HomeEmpty } from '@/components/home/HomeEmpty';

export default function Home() {
  const { data, isLoading, isError, refetch } = useHomeDashboard();
  const [isCalendarSheetOpen, setIsCalendarSheetOpen] = useState(false);

  const handlePaywall = () => {
    // Placeholder - open paywall/subscription flow
    console.log('Open paywall');
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto pb-20">
        <HomeSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto pb-20">
        <HomeError onRetry={() => refetch()} />
        <BottomBar />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto pb-20">
        <HomeEmpty />
        <BottomBar />
      </div>
    );
  }

  // Safety check for incomplete data
  if (!data.today || !data.greeting || !data.paywall) {
    return (
      <div className="max-w-2xl mx-auto pb-20">
        <HomeSkeleton />
      </div>
    );
  }

  const { greeting, today, paywall } = data;
  const isSubscriber = paywall.is_subscriber;
  const displayName = data.profile?.nickname || data.profile?.first_name || 'você';

  // Check if this is first access (no data at all)
  const isEmpty = today.agenda.length === 0 && today.reminders.length === 0 && today.kids.length === 0;

  if (isEmpty) {
    return (
      <div className="max-w-2xl mx-auto pb-20">
        <GreetingCard 
          greeting={greeting}
          displayName={displayName}
          onPrimaryCta={() => setIsCalendarSheetOpen(true)}
          onSecondaryCta={() => {}}
        />
        <div className="mt-6">
          <HomeEmpty />
        </div>
        <BottomBar />
        <ConnectCalendarSheet open={isCalendarSheetOpen} onOpenChange={setIsCalendarSheetOpen} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 space-y-4 animate-fade-in">
      {/* A) Saudação Inteligente */}
      <GreetingCard 
        greeting={greeting}
        displayName={displayName}
        onPrimaryCta={() => {
          if (greeting.primaryCta.action === 'open_paywall') {
            handlePaywall();
          } else {
            setIsCalendarSheetOpen(true);
          }
        }}
        onSecondaryCta={() => {}}
      />

      {/* B) Agora - Agenda + Lembretes + Urgentes */}
      <TodayAgendaCard events={today.agenda} isTeaser={!isSubscriber} />
      <TodayRemindersCard reminders={today.reminders} isTeaser={!isSubscriber} />
      <UrgentRemindersCard items={today.urgent_overdue} />

      {/* C) Lista de compras (condicional) */}
      <ShoppingCard shopping={today.shopping} />

      {/* D) Filhos (max 2 alertas) */}
      <KidsAlerts kids={today.kids} />

      {/* E) Momento com a Annia */}
      <AnniaMoment 
        suggestions={today.annia_moment} 
        isSubscriber={isSubscriber}
        onPaywall={handlePaywall}
      />

      {/* Paywall teaser for non-subscribers */}
      {!isSubscriber && <PaywallTeaser onSubscribe={handlePaywall} />}

      {/* Bottom navigation */}
      <BottomBar />

      {/* Sheets */}
      <ConnectCalendarSheet open={isCalendarSheetOpen} onOpenChange={setIsCalendarSheetOpen} />
    </div>
  );
}
