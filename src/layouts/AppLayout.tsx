import { Outlet } from 'react-router-dom';
import { AppBar } from '@/components/AppBar';
import { BottomBar } from '@/components/home/BottomBar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppBar />
      <main id="main-content" className="flex-1 px-4 pt-6 pb-24">
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
