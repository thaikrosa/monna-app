import { Plus, CalendarBlank, ShoppingCart, ChatCircle } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Plus, path: '/lembretes', action: 'add' },
    { icon: CalendarBlank, path: '/lembretes' },
    { icon: ShoppingCart, path: '/lista' },
    { icon: ChatCircle, path: '/', action: 'chat' },
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
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon weight={isActive ? "fill" : "regular"} className="w-6 h-6" />
              {isActive && <div className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
