import { Link, useLocation } from 'react-router-dom';
import { ListChecks, UsersThree, Baby, Bell } from '@phosphor-icons/react';
import { UserMenu } from './UserMenu';

export function AppBar() {
  const location = useLocation();
  const isListActive = location.pathname === '/lista';
  const isNetworkActive = location.pathname === '/rede-apoio';
  const isChildrenActive = location.pathname === '/filhos';
  const isRemindersActive = location.pathname === '/lembretes';
  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-background border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-foreground tracking-tight">
            Annia
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            to="/lista"
            className={`p-2 rounded-lg transition-all duration-150 ${
              isListActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListChecks weight="thin" className="h-5 w-5" />
          </Link>
          <Link
            to="/rede-apoio"
            className={`p-2 rounded-lg transition-all duration-150 ${
              isNetworkActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UsersThree weight="thin" className="h-5 w-5" />
          </Link>
          <Link
            to="/filhos"
            className={`p-2 rounded-lg transition-all duration-150 ${
              isChildrenActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Baby weight="thin" className="h-5 w-5" />
          </Link>
          <Link
            to="/lembretes"
            className={`p-2 rounded-lg transition-all duration-150 ${
              isRemindersActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bell weight="thin" className="h-5 w-5" />
          </Link>
        </nav>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
