import { Link } from 'react-router-dom';
import { User, House } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import logoMonnaDark from '@/assets/logo-monna.png';

export function LandingNavbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoMonnaDark} alt="Monna" className="h-10 w-auto" />
        </Link>

        {/* Actions */}
        <div className="flex items-center">
          {!loading && user ? (
            <Button variant="ghost" size="sm" asChild className="text-primary gap-1.5">
              <Link to="/home">
                <House weight="regular" className="h-4 w-4" />
                <span className="hidden sm:inline">Ir para o app</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild className="text-primary gap-1.5">
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
