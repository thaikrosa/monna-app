import { Plus, CalendarBlank, ShoppingCart, House } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: House, path: '/', label: 'Home' },
    { icon: CalendarBlank, path: '/lembretes', label: 'Lembretes' },
    { icon: ShoppingCart, path: '/lista', label: 'Compras' },
    { icon: Plus, path: '/lembretes', action: 'add', label: 'Novo' },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-background/80 border-t border-border px-4 py-3 z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path && !item.action;
          
          return (
            <button
              key={index}
              onClick={() => handleClick(item)}
              className={`relative flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon weight="thin" className="w-6 h-6" />
              {isActive && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
