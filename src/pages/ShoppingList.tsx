import { Link } from 'react-router-dom';
import { CaretLeft, Broom } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { AddItemForm } from '@/components/shopping/AddItemForm';
import { ShoppingItemCard } from '@/components/shopping/ShoppingItemCard';
import {
  useShoppingItems,
  useToggleChecked,
  useDeleteItem,
  useClearChecked,
} from '@/hooks/useShoppingList';

export default function ShoppingList() {
  const { data: items = [], isLoading } = useShoppingItems();
  const toggleChecked = useToggleChecked();
  const deleteItem = useDeleteItem();
  const clearChecked = useClearChecked();

  const checkedCount = items.filter((item) => item.is_checked).length;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header com botão voltar */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-all duration-150"
          >
            <CaretLeft weight="thin" className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lista de Compras</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tudo o que você costuma comprar, em um só lugar.
            </p>
          </div>
        </div>
      </header>

      {/* Formulário de adição com seletor de tags */}
      <AddItemForm />

      {/* Ação de limpeza - só aparece se houver itens marcados */}
      {checkedCount > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground transition-all duration-150"
            onClick={() => clearChecked.mutate()}
            disabled={clearChecked.isPending}
          >
            <Broom weight="thin" className="h-4 w-4 mr-1" />
            Limpar {checkedCount} concluído{checkedCount > 1 ? 's' : ''}
          </Button>
        </div>
      )}

      {/* Lista de itens */}
      <div className="space-y-0">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Carregando...
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Nenhum item na lista.
          </div>
        ) : (
          items.map((item) => (
            <ShoppingItemCard
              key={item.id}
              item={item}
              onToggle={(id, checked) => toggleChecked.mutate({ id, checked })}
              onDelete={(id) => deleteItem.mutate(id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
