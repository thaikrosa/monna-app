import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, Plus, CaretDown, ShoppingCart, PencilSimple } from '@phosphor-icons/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { ShoppingItemCard } from '@/components/shopping/ShoppingItemCard';
import { AddItemSheet } from '@/components/shopping/AddItemSheet';
import { EditItemSheet } from '@/components/shopping/EditItemSheet';
import { EditTagDialog } from '@/components/shopping/EditTagDialog';
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
  const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);

  const { data: items = [], isLoading, isError, refetch } = useShoppingItems();
  const { data: tags = [] } = useShoppingTags();
  const toggleChecked = useToggleChecked();
  const deleteItem = useDeleteItem();

  // Ordenar tags: Mercado primeiro, depois alfabético, Todos por último
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => {
      const aLower = a.name.toLowerCase().trim();
      const bLower = b.name.toLowerCase().trim();
      
      // Mercado sempre primeiro
      if (aLower === 'mercado') return -1;
      if (bLower === 'mercado') return 1;
      
      // Demais em ordem alfabética
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }, [tags]);

  // Contar itens por tag (para verificar se pode excluir)
  const itemCountByTag = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      if (item.tag_id) {
        counts[item.tag_id] = (counts[item.tag_id] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

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
            className="p-2 rounded-lg text-primary/70 hover:text-primary hover:bg-primary/10 transition-all duration-150"
          >
            <CaretLeft weight="regular" className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lista de Compras</h1>
          </div>
        </div>
      </header>

      {/* Tabs por tag - Ordenados: Mercado primeiro, depois alfabético, Todos por último */}
      {tags.length > 0 && (
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              {/* Tags ordenadas primeiro */}
              {sortedTags.map((tag) => {
                const isMercado = tag.name.toLowerCase().trim() === 'mercado';
                
                return (
                  <TabsTrigger
                    key={tag.id}
                    value={tag.id}
                    className={`relative px-3 py-1.5 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card text-primary/70 shadow-sm transition-colors duration-150 ${
                      isMercado 
                        ? 'border-2 border-primary/40' 
                        : 'border border-border'
                    }`}
                  >
                    {tag.name}
                    {/* Ícone de edição - só aparece quando tab está ativa E não é Mercado */}
                    {activeTab === tag.id && !isMercado && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTag({ id: tag.id, name: tag.name });
                        }}
                        className="ml-1.5 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <PencilSimple weight="thin" className="h-3 w-3" />
                      </button>
                    )}
                  </TabsTrigger>
                );
              })}
              {/* "Todos" sempre por último */}
              <TabsTrigger
                value="todos"
                className="px-3 py-1.5 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card text-primary/70 border border-border shadow-sm"
              >
                Todos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Estados de carregamento e erro */}
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
      ) : isError ? (
        <ErrorState
          message="Erro ao carregar a lista de compras"
          onRetry={() => refetch()}
        />
      ) : totalCount === 0 ? (
        /* Empty state */
        <div className="py-16 text-center bg-card border border-border shadow-elevated rounded-lg">
          <ShoppingCart weight="regular" className="h-12 w-12 mx-auto text-primary mb-4" />
          <p className="text-primary/80 mb-1">
            {activeTab === 'todos'
              ? 'Sua lista está vazia'
              : 'Esta categoria está vazia'}
          </p>
          <p className="text-sm text-muted-foreground">
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
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm text-primary/70 py-2 hover:text-primary transition-colors group">
                <CaretDown
                  weight="regular"
                  className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
                <span>Concluídos ({completedItems.length})</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="animate-slide-down">
                <div className="space-y-0 mt-2 pt-2 border-t border-border">
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
        <Plus weight="regular" className="h-6 w-6" />
      </button>

      {/* Sheet para adicionar item */}
      <AddItemSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} defaultTagName={activeTagName} />

      {/* Sheet de edição */}
      <EditItemSheet
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      />

      {/* Dialog de edição de tag */}
      <EditTagDialog
        open={!!editingTag}
        onOpenChange={(open) => !open && setEditingTag(null)}
        tag={editingTag}
        itemCount={editingTag ? (itemCountByTag[editingTag.id] || 0) : 0}
        onTagDeleted={() => setActiveTab('todos')}
      />
    </div>
  );
}
