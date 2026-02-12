import { Link } from 'react-router-dom';
import { Sun, Moon, House } from '@phosphor-icons/react';
import { useSession } from '@/contexts/SessionContext';
import { UserMenu } from './UserMenu';
import logoMonnaDark from '@/assets/logo-monna.png';

export function AppBar() {
  const { profile } = useSession();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Bom dia', Icon: Sun };
    if (hour >= 12 && hour < 18) return { text: 'Boa tarde', Icon: Sun };
    return { text: 'Boa noite', Icon: Moon };
  };

  const { text: greetingText, Icon: GreetingIcon } = getGreeting();
  const displayName = profile?.nickname || profile?.first_name || 'você';

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo + Greeting */}
        <Link to="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150">
          <img 
            src={logoMonnaDark} 
            alt="Monna" 
            className="h-12 w-auto"
          />
          <div className="flex items-center gap-2">
            <GreetingIcon weight="thin" className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold text-foreground">
              {greetingText}, {displayName}
            </span>
          </div>
        </Link>

        {/* Right side - Home icon + UserMenu */}
        <div className="flex items-center gap-2">
          <Link 
            to="/home" 
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            aria-label="Ir para Home"
          >
            <House weight="thin" className="h-5 w-5" />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
