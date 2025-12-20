import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, Broom } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddItemForm } from '@/components/shopping/AddItemForm';
import { ShoppingItemCard } from '@/components/shopping/ShoppingItemCard';
import { EditItemSheet } from '@/components/shopping/EditItemSheet';
import {
  useShoppingItems,
  useShoppingTags,
  useToggleChecked,
  useDeleteItem,
  useClearChecked,
  type ShoppingItem,
} from '@/hooks/useShoppingList';

export default function ShoppingList() {
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [activeTab, setActiveTab] = useState('todos');
  
  const { data: items = [], isLoading } = useShoppingItems();
  const { data: tags = [] } = useShoppingTags();
  const toggleChecked = useToggleChecked();
  const deleteItem = useDeleteItem();
  const clearChecked = useClearChecked();

  // Filter by tag
  const filteredItems = useMemo(() => {
    if (activeTab === 'todos') return items;
    return items.filter(item => item.tag_id === activeTab);
  }, [items, activeTab]);

  // Sort: unchecked first (A-Z), then checked (A-Z)
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (a.is_checked !== b.is_checked) {
        return a.is_checked ? 1 : -1;
      }
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }, [filteredItems]);

  const checkedCount = items.filter((item) => item.is_checked).length;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header com botão voltar */}
      <header className="mb-6">
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

      {/* Tabs por tag */}
      {tags.length > 0 && (
        <div className="mt-4 mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              <TabsTrigger 
                value="todos" 
                className="px-3 py-1.5 text-xs rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-muted/30 text-muted-foreground"
              >
                Todos
              </TabsTrigger>
              {tags.map(tag => (
                <TabsTrigger 
                  key={tag.id} 
                  value={tag.id}
                  className="px-3 py-1.5 text-xs rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-muted/30 text-muted-foreground"
                >
                  {tag.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

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
        ) : sortedItems.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            {activeTab === 'todos' ? 'Nenhum item na lista.' : 'Nenhum item nesta categoria.'}
          </div>
        ) : (
          sortedItems.map((item) => (
            <ShoppingItemCard
              key={item.id}
              item={item}
              onToggle={(id, checked) => toggleChecked.mutate({ id, checked })}
              onDelete={(id) => deleteItem.mutate(id)}
              onEdit={(item) => setEditingItem(item)}
            />
          ))
        )}
      </div>

      {/* Sheet de edição */}
      <EditItemSheet
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      />
    </div>
  );
}
