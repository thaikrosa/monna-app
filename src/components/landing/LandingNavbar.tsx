import { Link } from 'react-router-dom';
import { User, House } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import logoMonnaDark from '@/assets/logo-monna.png';

export function LandingNavbar() {
  const { user, isReady } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoMonnaDark} alt="Monna" className="h-14 w-auto brightness-0 invert" />
        </Link>

        {/* Actions */}
        <div className="flex items-center">
          {isReady && user ? (
            <Button variant="ghost" size="sm" asChild className="text-primary-foreground gap-1.5 hover:bg-transparent">
              <Link to="/home">
                <House weight="regular" className="h-4 w-4" />
                <span className="hidden sm:inline">Ir para o app</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild className="text-primary-foreground gap-1.5 hover:bg-transparent">
              <Link to="/auth">
                <User weight="regular" className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
