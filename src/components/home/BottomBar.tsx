import { House, BellSimple, ShoppingCart, CalendarBlank } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: House, path: '/', label: 'Home' },
    { icon: CalendarBlank, path: '/agenda', label: 'Agenda' },
    { icon: BellSimple, path: '/lembretes', label: 'Lembretes' },
    { icon: ShoppingCart, path: '/lista', label: 'Compras' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-background/80 border-t border-border px-4 py-2 z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                relative flex flex-col items-center gap-1 py-2 px-4 rounded-lg
                min-h-[44px] min-w-[44px]
                transition-all duration-200
                ${isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon weight="thin" className="w-6 h-6" />
              <span className={`text-[10px] ${isActive ? 'font-medium' : 'font-normal'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-1.5 right-3 w-1.5 h-1.5 rounded-sm bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
