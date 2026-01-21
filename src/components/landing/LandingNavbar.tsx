import { Link } from 'react-router-dom';
import { User, WhatsappLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { MonnaLogo } from './MonnaLogo';

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <MonnaLogo className="h-8 w-auto text-primary" />
          <span className="text-sm font-normal tracking-[0.15em] text-primary">MONNA</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" asChild className="text-primary gap-1.5">
            <Link to="/auth">
              <User weight="regular" className="h-4 w-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          </Button>
          <Button size="sm" asChild className="gap-1.5">
            <a href="#cta-final">
              <WhatsappLogo weight="regular" className="h-4 w-4" />
              <span className="hidden sm:inline">Testar grátis</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
