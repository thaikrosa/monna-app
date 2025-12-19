import { Outlet } from 'react-router-dom';
import { AppBar } from '@/components/AppBar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppBar />
      <main className="flex-1 px-4 pt-6 pb-20">
        <Outlet />
      </main>
    </div>
  );
}
