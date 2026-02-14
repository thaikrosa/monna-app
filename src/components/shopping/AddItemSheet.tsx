import { useRef, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [createTagDialogOpen, setCreateTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const { data: tags = [] } = useShoppingTags();
  const addItem = useAddItem();

  // Auto-focus e pré-selecionar categoria quando abrir
  useEffect(() => {
    if (open) {
      // Pré-selecionar baseado na aba ativa ou primeira tag disponível
      if (defaultTagName) {
        setSelectedTag(defaultTagName);
      } else if (tags.length > 0 && !selectedTag) {
        // Pré-selecionar Mercado se existir, ou a primeira tag
        const mercadoTag = tags.find(t => t.name.toLowerCase() === 'mercado');
        setSelectedTag(mercadoTag?.name || tags[0].name);
      }
      // Auto-focus com delay para mobile
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open, defaultTagName, tags, selectedTag]);

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
    if (newItem.trim() && selectedTag) {
      const usedTagName = selectedTag;

      addItem.mutate(
        { name: newItem, tagName: usedTagName },
        {
          onSuccess: () => {
            setNewItem('');
            // Manter dialog aberto para adicionar mais itens rapidamente
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-md px-5 py-6 pb-10">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Novo Item</DialogTitle>
            <DialogDescription className="text-muted-foreground/70">
              Adicione à sua lista de compras
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            <div className="space-y-3">
              <Input
                ref={inputRef}
                placeholder="Do que você precisa?"
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
                className="bg-transparent border-0 border-b border-border/30 rounded-none focus:border-primary/50 focus:ring-0 transition-colors duration-150 placeholder:text-muted-foreground/40"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center gap-3">
              <Tag weight="duotone" className="h-4 w-4 text-muted-foreground shrink-0" />

              <Select value={selectedTag} onValueChange={handleSelectChange}>
                <SelectTrigger className="flex-1 bg-transparent border-border/50">
                  <SelectValue placeholder="Categoria (opcional)" />
                </SelectTrigger>
                <SelectContent>
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
              disabled={!newItem.trim() || !selectedTag || addItem.isPending}
            >
              Adicionar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
