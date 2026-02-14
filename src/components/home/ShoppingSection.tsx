import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Circle, CheckCircle, Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { HomeSection } from './HomeSection';
import { AddItemSheet } from '@/components/shopping/AddItemSheet';
import { useToggleChecked } from '@/hooks/useShoppingList';
import type { ShoppingItem } from '@/hooks/useShoppingList';

interface ShoppingSectionProps {
  items: ShoppingItem[];
  tagName: string | null;
}

export function ShoppingSection({ items, tagName }: ShoppingSectionProps) {
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const toggleChecked = useToggleChecked();
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  
  // Filtra apenas itens não marcados
  const uncheckedItems = items.filter(item => !item.is_checked && !checkedIds.has(item.id));
  const totalUnchecked = uncheckedItems.length;
  const displayItems = uncheckedItems.slice(0, 3);

  const handleToggleChecked = (itemId: string) => {
    setCheckedIds(prev => new Set(prev).add(itemId));
    toggleChecked.mutate({ id: itemId, checked: true });
  };

  if (totalUnchecked === 0 && checkedIds.size === 0) {
    return (
      <>
        <HomeSection
          icon={<ShoppingCart weight="regular" className="h-4 w-4" />}
          title={tagName || "Lista de compras"}
          onAdd={() => setIsAddOpen(true)}
          emptyState={
            <p className="text-sm text-muted-foreground">
              Sua lista está vazia. Adicione o que precisar.
            </p>
          }
        >
          <div />
        </HomeSection>
        <AddItemSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
      </>
    );
  }

  const showSmartTrigger = totalUnchecked > 10;

  return (
    <>
      <HomeSection
        icon={<ShoppingCart weight="regular" className="h-4 w-4" />}
        title={tagName || "Lista de compras"}
        count={totalUnchecked}
        onAdd={() => setIsAddOpen(true)}
        onViewAll={() => navigate('/lista')}
        viewAllLabel="Ver lista"
      >
        <ul className="space-y-2">
          {displayItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-md bg-muted/50 border border-border/30 transition-colors duration-150"
            >
              {/* Quick Action Checkbox */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
                onClick={() => handleToggleChecked(item.id)}
              >
                <Circle weight="regular" className="h-5 w-5" />
              </Button>
              
              <span className="text-sm text-foreground flex-1 truncate">
                {item.name}
              </span>
              {item.quantity_text && (
                <span className="text-xs text-muted-foreground">
                  {item.quantity_text}
                </span>
              )}
            </li>
          ))}

          {totalUnchecked > 3 && (
            <li className="text-xs text-muted-foreground pt-1 pl-3 list-none">
              +{totalUnchecked - 3} itens
            </li>
          )}
        </ul>

        {/* Gatilho inteligente */}
        {showSmartTrigger && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-start gap-2">
              <Sparkle weight="regular" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Sua lista tem {totalUnchecked} itens. Posso sugerir um horário para o mercado?
              </p>
            </div>
          </div>
        )}
      </HomeSection>
      <AddItemSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  );
}
