import { Outlet } from 'react-router-dom';
import { AppBar } from '@/components/AppBar';
import { BottomBar } from '@/components/home/BottomBar';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';

export function AppLayout() {
  useSwipeNavigation();
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        Pular para o conteúdo principal
      </a>
      <OfflineBanner />
      <AppBar />
      <main id="main-content" className="flex-1 px-4 pt-6 pb-24">
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
