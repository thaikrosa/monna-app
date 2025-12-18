import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash, PencilSimple } from '@phosphor-icons/react';
import type { ShoppingItem } from '@/hooks/useShoppingList';

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
}

function formatFrequency(days: number | null) {
  if (!days) return null;
  const rounded = Math.round(days);
  return `aprox. a cada ${rounded} ${rounded === 1 ? 'dia' : 'dias'}`;
}

export function ShoppingItemCard({ item, onToggle, onDelete, onEdit }: ShoppingItemCardProps) {
  return (
    <div
      className={`group flex items-center gap-3 py-3 px-1 border-b border-border/30 last:border-b-0 transition-all duration-150 ${
        item.is_checked ? 'opacity-60' : ''
      }`}
    >
      <Checkbox
        checked={item.is_checked}
        onCheckedChange={(checked) => onToggle(item.id, !!checked)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-150"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-foreground transition-all duration-150 ${
              item.is_checked ? 'line-through decoration-muted-foreground/50 text-muted-foreground' : ''
            }`}
          >
            {item.name}
          </span>
          {item.quantity_text && (
            <span className="text-xs text-muted-foreground">
              ({item.quantity_text})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          {item.tag_name && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary/80">
              {item.tag_name}
            </span>
          )}
          {item.avg_days_between && (
            <span className="text-xs text-muted-foreground">
              {formatFrequency(item.avg_days_between)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-150"
          onClick={() => onEdit(item)}
        >
          <PencilSimple weight="thin" className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-150"
          onClick={() => onDelete(item.id)}
        >
          <Trash weight="thin" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
