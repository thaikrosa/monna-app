import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsThreeVertical, PencilSimple, Trash, CheckCircle, ArrowCounterClockwise } from '@phosphor-icons/react';
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
  // Excluir com toast de confirmação suave
  const handleDelete = () => {
    toast('Item removido', {
      description: item.name,
      action: {
        label: 'Desfazer',
        onClick: () => {
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
      className={`
        flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg
        transition-all duration-150
        ${item.is_checked ? 'opacity-50' : ''}
      `}
    >
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

      {/* Bloco de ações à direita: Feito → Menu */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Botão Feito/Desfazer - área de toque ~44px, ícone ~20px */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggle(item.id, !item.is_checked)}
          aria-label={item.is_checked ? 'Marcar como não feito' : 'Marcar como feito'}
          className={`h-11 w-11 min-w-[44px] min-h-[44px] rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            item.is_checked 
              ? 'text-muted-foreground hover:text-foreground hover:bg-muted/40 active:bg-muted/60' 
              : 'text-primary hover:text-primary hover:bg-primary/10 active:bg-primary/20'
          }`}
        >
          {item.is_checked ? (
            <ArrowCounterClockwise weight="regular" className="h-5 w-5" />
          ) : (
            <CheckCircle weight="regular" className="h-5 w-5" />
          )}
        </Button>

        {/* Menu contextual - visualmente menor/secundário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Mais opções"
              className="h-8 w-8 text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/30 active:bg-muted/50 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <DotsThreeVertical weight="bold" className="h-4 w-4" />
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
    </div>
  );
}
