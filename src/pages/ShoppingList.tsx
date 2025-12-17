import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ShoppingItem {
  id: string;
  name: string;
  quantity_text: string | null;
  tag_name: string | null;
  is_checked: boolean;
  avg_days_between: number | null;
}

export default function ShoppingList() {
  const [newItem, setNewItem] = useState('');
  const queryClient = useQueryClient();

  // Fetch items from view
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['shopping-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_shopping_items_with_frequency')
        .select('id, name, quantity_text, tag_name, is_checked, avg_days_between')
        .order('is_checked', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShoppingItem[];
    },
  });

  // Add item mutation
  const addItem = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.rpc('shopping_add_item', {
        p_name: name.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
      setNewItem('');
    },
    onError: () => {
      toast.error('Erro ao adicionar item');
    },
  });

  // Toggle checked mutation
  const toggleChecked = useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      const { error } = await supabase.rpc('shopping_set_item_checked', {
        p_item_id: id,
        p_checked: checked,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar item');
    },
  });

  // Delete item mutation
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('shopping_delete_item', {
        p_item_id: id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-items'] });
    },
    onError: () => {
      toast.error('Erro ao remover item');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      addItem.mutate(newItem);
    }
  };

  const formatFrequency = (days: number | null) => {
    if (!days) return null;
    const rounded = Math.round(days);
    return `aprox. a cada ${rounded} ${rounded === 1 ? 'dia' : 'dias'}`;
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Lista de Compras</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tudo o que você costuma comprar, em um só lugar.
        </p>
      </header>

      {/* Add item form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Adicionar item…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 bg-card border-border"
        />
        <Button
          type="submit"
          size="icon"
          variant="secondary"
          disabled={!newItem.trim() || addItem.isPending}
        >
          <Plus weight="thin" className="h-5 w-5" />
        </Button>
      </form>

      {/* Items list */}
      <div className="space-y-1">
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
            <div
              key={item.id}
              className={`group flex items-center gap-3 py-3 px-3 rounded-lg transition-colors hover:bg-card/50 ${
                item.is_checked ? 'opacity-50' : ''
              }`}
            >
              <Checkbox
                checked={item.is_checked}
                onCheckedChange={(checked) =>
                  toggleChecked.mutate({ id: item.id, checked: !!checked })
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-foreground ${
                      item.is_checked ? 'line-through text-muted-foreground' : ''
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
                    <span className="text-xs text-primary/80">{item.tag_name}</span>
                  )}
                  {item.avg_days_between && (
                    <span className="text-xs text-muted-foreground">
                      {formatFrequency(item.avg_days_between)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={() => deleteItem.mutate(item.id)}
              >
                <Trash weight="thin" className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
