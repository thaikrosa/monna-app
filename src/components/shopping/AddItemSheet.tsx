import { useRef, useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  defaultTagName?: string;
}

export function AddItemSheet({ open, onOpenChange, defaultTagName }: AddItemSheetProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const newTagInputRef = useRef<HTMLInputElement>(null);
  const [newItem, setNewItem] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('__none__');
  const [createTagDialogOpen, setCreateTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const { data: tags = [] } = useShoppingTags();
  const addItem = useAddItem();

  // Auto-focus e pré-selecionar categoria quando abrir
  useEffect(() => {
    if (open) {
      // Pré-selecionar baseado na aba ativa
      if (defaultTagName) {
        setSelectedTag(defaultTagName);
      }
      // Auto-focus com delay para mobile
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, defaultTagName]);

  // Auto-focus no input do dialog de nova categoria
  useEffect(() => {
    if (createTagDialogOpen) {
      const timer = setTimeout(() => {
        newTagInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [createTagDialogOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      const usedTagName = selectedTag !== '__none__' ? selectedTag : undefined;

      addItem.mutate(
        { name: newItem, tagName: usedTagName },
        {
          onSuccess: () => {
            setNewItem('');
            // Manter sheet aberto para adicionar mais itens rapidamente
            inputRef.current?.focus();
          },
        }
      );
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      setSelectedTag(newTagName.trim());
      setCreateTagDialogOpen(false);
      setNewTagName('');
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === '__create_new__') {
      setCreateTagDialogOpen(true);
    } else {
      setSelectedTag(value);
    }
  };

  return (
    <>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  if (newItem.trim() && !addItem.isPending) {
                    handleSubmit(e);
                  }
                }
              }}
              className="text-base bg-transparent border-border focus:border-primary"
              autoComplete="off"
            />

            <div className="flex items-center gap-3">
              <Tag weight="duotone" className="h-4 w-4 text-muted-foreground shrink-0" />

              <Select value={selectedTag} onValueChange={handleSelectChange}>
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
                  <SelectItem value="__create_new__" className="text-primary">
                    <span className="flex items-center gap-2">
                      <Plus weight="bold" className="h-3 w-3" />
                      Criar nova categoria
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
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

      {/* Dialog para criar nova categoria */}
      <Dialog open={createTagDialogOpen} onOpenChange={setCreateTagDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
          </DialogHeader>
          <Input
            ref={newTagInputRef}
            placeholder="Nome da categoria"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateTag();
              }
            }}
            className="bg-transparent border-border"
          />
          <DialogFooter>
            <Button
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
