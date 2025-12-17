import { UserMenu } from './UserMenu';

export function AppBar() {
  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-background border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-bold text-foreground tracking-tight">
            Annia
          </span>
        </div>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
