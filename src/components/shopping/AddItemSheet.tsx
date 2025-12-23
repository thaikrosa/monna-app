import { useRef, useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag, Plus } from '@phosphor-icons/react';
import { useAddItem, useShoppingTags } from '@/hooks/useShoppingList';

interface AddItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddItemSheet({ open, onOpenChange }: AddItemSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [newItem, setNewItem] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('__none__');
  const [newTagInput, setNewTagInput] = useState('');

  const { data: tags = [] } = useShoppingTags();
  const addItem = useAddItem();

  // Auto-focus robusto quando abrir (150ms para mobile)
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      const usedTagName = newTagInput.trim()
        ? newTagInput.trim()
        : selectedTag !== '__none__'
          ? selectedTag
          : undefined;

      addItem.mutate(
        { name: newItem, tagName: usedTagName },
        {
          onSuccess: () => {
            setNewItem('');
            if (newTagInput.trim()) {
              setSelectedTag(newTagInput.trim());
            }
            setNewTagInput('');
            // Manter sheet aberto para adicionar mais itens rapidamente
            inputRef.current?.focus();
          },
        }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="pb-8 rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-left">Adicionar item</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            ref={inputRef}
            placeholder="O que você precisa comprar?"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="text-base bg-transparent border-border focus:border-primary"
            autoComplete="off"
          />

          <div className="flex items-center gap-3">
            <Tag weight="duotone" className="h-4 w-4 text-muted-foreground shrink-0" />

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="flex-1 bg-transparent border-border/50">
                <SelectValue placeholder="Categoria (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sem categoria</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.name}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-xs text-muted-foreground">ou</span>

            <Input
              type="text"
              placeholder="Nova…"
              value={newTagInput}
              onChange={(e) => {
                setNewTagInput(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedTag('__none__');
                }
              }}
              className="w-20 text-sm bg-transparent border-border/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!newItem.trim() || addItem.isPending}
          >
            <Plus weight="bold" className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
