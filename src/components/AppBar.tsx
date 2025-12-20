import { Link } from 'react-router-dom';
import { Sun, Moon, House } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from './UserMenu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AppBar() {
  const { profile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Bom dia', Icon: Sun };
    if (hour >= 12 && hour < 18) return { text: 'Boa tarde', Icon: Sun };
    return { text: 'Boa noite', Icon: Moon };
  };

  const { text: greetingText, Icon: GreetingIcon } = getGreeting();
  const displayName = profile?.nickname || profile?.first_name || 'você';

  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - clickable to go Home */}
        <Link to="/" className="flex flex-col hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2">
            <GreetingIcon weight="thin" className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              {greetingText}, {displayName}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {capitalizedDate}
          </span>
        </Link>

        {/* Right side - Home icon + UserMenu */}
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
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
