import { Link } from 'react-router-dom';
import { User } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import logoMonna from '@/assets/logo-monna.png';

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoMonna} alt="Monna" className="h-8 w-auto" />
        </Link>

        {/* Actions */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="text-primary gap-1.5">
            <Link to="/auth">
              <User weight="regular" className="h-4 w-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
