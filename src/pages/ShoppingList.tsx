import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, Plus, CaretDown, ShoppingCart } from '@phosphor-icons/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingItemCard } from '@/components/shopping/ShoppingItemCard';
import { AddItemSheet } from '@/components/shopping/AddItemSheet';
import { EditItemSheet } from '@/components/shopping/EditItemSheet';
import {
  useShoppingItems,
  useShoppingTags,
  useToggleChecked,
  useDeleteItem,
  type ShoppingItem,
} from '@/hooks/useShoppingList';

export default function ShoppingList() {
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');
  const [completedOpen, setCompletedOpen] = useState(false);

  const { data: items = [], isLoading } = useShoppingItems();
  const { data: tags = [] } = useShoppingTags();
  const toggleChecked = useToggleChecked();
  const deleteItem = useDeleteItem();

  // Filtrar por tag
  const filteredItems = useMemo(() => {
    if (activeTab === 'todos') return items;
    return items.filter((item) => item.tag_id === activeTab);
  }, [items, activeTab]);

  // Separar pendentes e concluídos
  const pendingItems = useMemo(() => {
    return [...filteredItems]
      .filter((item) => !item.is_checked)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [filteredItems]);

  const completedItems = useMemo(() => {
    return [...filteredItems]
      .filter((item) => item.is_checked)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [filteredItems]);

  // Obter nome da tag ativa para pré-selecionar no AddItemSheet
  const activeTagName = useMemo(() => {
    if (activeTab === 'todos') return undefined;
    const tag = tags.find(t => t.id === activeTab);
    return tag?.name;
  }, [activeTab, tags]);

  const totalCount = pendingItems.length + completedItems.length;

  return (
    <div className="max-w-lg mx-auto pb-24">
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
              Tudo que você precisa, em um só lugar.
            </p>
          </div>
        </div>
      </header>

      {/* Tabs por tag */}
      {tags.length > 0 && (
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              <TabsTrigger
                value="todos"
                className="px-3 py-1.5 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-muted/60 text-muted-foreground border-0"
              >
                Todos
              </TabsTrigger>
              {tags.map((tag) => (
                <TabsTrigger
                  key={tag.id}
                  value={tag.id}
                  className="px-3 py-1.5 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-muted/60 text-muted-foreground border-0"
                >
                  {tag.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Estados de carregamento */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          ))}
        </div>
      ) : totalCount === 0 ? (
        /* Empty state */
        <div className="py-16 text-center">
          <ShoppingCart weight="duotone" className="h-12 w-12 mx-auto text-accent-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-1">
            {activeTab === 'todos'
              ? 'Sua lista está vazia'
              : 'Esta categoria está vazia'}
          </p>
          <p className="text-sm text-muted-foreground/70">
            Toque no <span className="text-primary font-medium">+</span> para adicionar itens
          </p>
        </div>
      ) : (
        <>
          {/* Lista de itens pendentes */}
          {pendingItems.length > 0 && (
            <div className="space-y-0">
              {pendingItems.map((item) => (
                <ShoppingItemCard
                  key={item.id}
                  item={item}
                  onToggle={(id, checked) => toggleChecked.mutate({ id, checked })}
                  onDelete={(id) => deleteItem.mutate(id)}
                  onEdit={(item) => setEditingItem(item)}
                />
              ))}
            </div>
          )}

          {/* Seção de concluídos (colapsável) */}
          {completedItems.length > 0 && (
            <Collapsible
              open={completedOpen}
              onOpenChange={setCompletedOpen}
              className="mt-6"
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm text-muted-foreground py-2 hover:text-foreground transition-colors group">
                <CaretDown
                  weight="bold"
                  className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
                <span>Concluídos ({completedItems.length})</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="animate-slide-down">
                <div className="space-y-0 mt-2 pt-2 border-t border-border/30">
                  {completedItems.map((item) => (
                    <ShoppingItemCard
                      key={item.id}
                      item={item}
                      onToggle={(id, checked) => toggleChecked.mutate({ id, checked })}
                      onDelete={(id) => deleteItem.mutate(id)}
                      onEdit={(item) => setEditingItem(item)}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </>
      )}

      {/* FAB flutuante com microinterações premium */}
      <button
        onClick={() => setAddSheetOpen(true)}
        aria-label="Adicionar item"
        className="
          fixed bottom-20 right-4 z-40
          floating-button
          shadow-lg
          transition-transform duration-200
          hover:scale-110
          active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        "
      >
        <Plus weight="bold" className="h-6 w-6" />
      </button>

      {/* Sheet para adicionar item */}
      <AddItemSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} defaultTagName={activeTagName} />

      {/* Sheet de edição */}
      <EditItemSheet
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      />
    </div>
  );
}
