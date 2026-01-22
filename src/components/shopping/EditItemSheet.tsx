import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useShoppingTags, useUpdateItem } from '@/hooks/useShoppingList';
import type { ShoppingItem } from '@/hooks/useShoppingList';

interface EditItemSheetProps {
  item: ShoppingItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditItemSheet({ item, open, onOpenChange }: EditItemSheetProps) {
  const [tagId, setTagId] = useState<string>('');
  const [quantityText, setQuantityText] = useState('');
  const [notes, setNotes] = useState('');

  const { data: tags = [] } = useShoppingTags();
  const updateItem = useUpdateItem();

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      // Se item não tem tag, selecionar Mercado ou primeira tag disponível
      if (item.tag_id) {
        setTagId(item.tag_id);
      } else if (tags.length > 0) {
        const mercadoTag = tags.find(t => t.name.toLowerCase() === 'mercado');
        setTagId(mercadoTag?.id || tags[0].id);
      }
      setQuantityText(item.quantity_text || '');
      setNotes(item.notes || '');
    }
  }, [item, tags]);

  const handleSave = () => {
    if (!item || !tagId) return;

    updateItem.mutate(
      {
        id: item.id,
        tag_id: tagId,
        quantity_text: quantityText,
        notes: notes,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background border-border/30">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-foreground">
            Editar item
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {item.name}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Seletor de Tag */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Categoria</Label>
            <Select value={tagId} onValueChange={setTagId}>
              <SelectTrigger className="bg-transparent border-border/30">
                <SelectValue placeholder="Sem categoria" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Quantidade */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quantidade</Label>
            <Input
              placeholder="Ex: 2 unidades, 500g"
              value={quantityText}
              onChange={(e) => setQuantityText(e.target.value)}
              className="bg-transparent border-border/30"
            />
          </div>

          {/* Campo Notas */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Notas</Label>
            <Textarea
              placeholder="Observações sobre este item..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-transparent border-border/30 resize-none"
              rows={3}
            />
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button
            onClick={handleSave}
            disabled={!tagId || updateItem.isPending}
            className="w-full transition-all duration-150"
          >
            {updateItem.isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
