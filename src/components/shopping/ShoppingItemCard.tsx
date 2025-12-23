import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsThreeVertical, PencilSimple, Trash } from '@phosphor-icons/react';
import { toast } from 'sonner';
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
  // Handler para teclado (acessibilidade)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(item.id, !item.is_checked);
    }
  };

  // Handler para clique na linha (não propagar do menu)
  const handleRowClick = (e: React.MouseEvent) => {
    // Evitar toggle se clicou no menu ou em botões internos
    const target = e.target as HTMLElement;
    if (target.closest('[data-menu-trigger]') || target.closest('button')) {
      return;
    }
    onToggle(item.id, !item.is_checked);
  };

  // Excluir com toast de confirmação suave
  const handleDelete = () => {
    toast('Item removido', {
      description: item.name,
      action: {
        label: 'Desfazer',
        onClick: () => {
          // Não faz nada - item não foi deletado ainda
          toast.dismiss();
        },
      },
      duration: 4000,
      onAutoClose: () => {
        onDelete(item.id);
      },
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      className={`
        flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg
        cursor-pointer select-none
        transition-all duration-150
        hover:bg-muted/30 active:bg-muted/50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${item.is_checked ? 'opacity-60' : ''}
      `}
    >
      {/* Checkbox visual (click handled by parent) */}
      <Checkbox
        checked={item.is_checked}
        onCheckedChange={() => {}}
        tabIndex={-1}
        className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-150"
      />

      {/* Conteúdo do item */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-foreground transition-all duration-200 ${
              item.is_checked
                ? 'line-through decoration-muted-foreground/50 text-muted-foreground'
                : ''
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
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/80">
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

      {/* Menu contextual discreto */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            data-menu-trigger
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsThreeVertical weight="bold" className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onEdit(item)} className="gap-2">
            <PencilSimple weight="duotone" className="h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Trash weight="duotone" className="h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
