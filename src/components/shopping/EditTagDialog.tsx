import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrashSimple } from '@phosphor-icons/react';
import { useUpdateTag, useDeleteTag } from '@/hooks/useShoppingList';

interface EditTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: { id: string; name: string } | null;
  itemCount: number;
  onTagDeleted?: () => void;
}

export function EditTagDialog({ 
  open, 
  onOpenChange, 
  tag, 
  itemCount,
  onTagDeleted 
}: EditTagDialogProps) {
  const [name, setName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  // Tag "mercado" não pode ser excluída
  const isMercado = tag?.name.toLowerCase().trim() === 'mercado';
  const canDelete = !isMercado && itemCount === 0;

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    }
  }, [tag]);

  const handleSave = async () => {
    if (!tag || !name.trim()) return;
    
    await updateTag.mutateAsync({ id: tag.id, name: name.trim() });
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!tag || !canDelete) return;
    
    await deleteTag.mutateAsync(tag.id);
    setShowDeleteConfirm(false);
    onOpenChange(false);
    onTagDeleted?.();
  };

  const inputClass = "bg-transparent border-0 border-b border-border/30 rounded-none focus:border-primary/50 focus:ring-0 transition-colors duration-150";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Editar Lista</DialogTitle>
            <DialogDescription className="text-muted-foreground/70">
              Renomeie ou exclua esta lista
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="tag-name" className="text-xs text-muted-foreground/70">
                Nome da lista
              </Label>
              <Input
                id="tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mercado"
                className={inputClass}
              />
            </div>

            {/* Botão de excluir */}
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={!canDelete}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              <TrashSimple weight="thin" className="h-4 w-4 mr-2" />
              {isMercado 
                ? 'Esta lista não pode ser excluída' 
                : itemCount > 0 
                  ? `Remova os ${itemCount} itens antes de excluir`
                  : 'Excluir lista'
              }
            </Button>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || updateTag.isPending}
            >
              {updateTag.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lista?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A lista "{tag?.name}" será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTag.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
