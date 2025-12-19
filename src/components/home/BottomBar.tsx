import { Plus, CalendarBlank, ShoppingCart, ChatCircle } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Plus, label: 'Adicionar', path: '/lembretes', action: 'add' },
    { icon: CalendarBlank, label: 'Agenda', path: '/lembretes' },
    { icon: ShoppingCart, label: 'Compras', path: '/lista' },
    { icon: ChatCircle, label: 'Annia', path: '/', action: 'chat' },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    // For now, just navigate. Actions can be expanded later
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/60 px-4 py-2 z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path && !item.action;
          
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon weight="regular" className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
