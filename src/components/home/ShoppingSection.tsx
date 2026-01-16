import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import type { ShoppingItem } from '@/hooks/useShoppingList';

interface ShoppingSectionProps {
  items: ShoppingItem[];
}

export function ShoppingSection({ items }: ShoppingSectionProps) {
  const navigate = useNavigate();
  
  // Filtra apenas itens não marcados
  const uncheckedItems = items.filter(item => !item.is_checked);
  const totalUnchecked = uncheckedItems.length;
  const displayItems = uncheckedItems.slice(0, 3);

  if (totalUnchecked === 0) {
    return null; // Não exibe se não há itens pendentes
  }

  const showSmartTrigger = totalUnchecked > 10;

  return (
    <div className="annia-glass rounded-2xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart weight="thin" className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Lista de compras</p>
          <span className="text-xs text-muted-foreground">({totalUnchecked})</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground h-auto py-1"
          onClick={() => navigate('/lista')}
        >
          Ver lista
        </Button>
      </div>

      <div className="space-y-2">
        {displayItems.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-3 py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <span className="text-sm text-foreground flex-1 truncate">
              {item.name}
            </span>
            {item.quantity_text && (
              <span className="text-xs text-muted-foreground">
                {item.quantity_text}
              </span>
            )}
          </div>
        ))}
        
        {totalUnchecked > 3 && (
          <p className="text-xs text-muted-foreground pt-1">
            +{totalUnchecked - 3} itens
          </p>
        )}
      </div>

      {/* Gatilho inteligente */}
      {showSmartTrigger && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-start gap-2">
            <Sparkle weight="thin" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Sua lista tem {totalUnchecked} itens. Posso sugerir um horário para o mercado?
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
