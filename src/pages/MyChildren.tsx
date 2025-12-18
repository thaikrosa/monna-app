import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useChildren, useDeleteChild, Child } from '@/hooks/useChildren';
import { ChildCard } from '@/components/children/ChildCard';
import { AddChildSheet } from '@/components/children/AddChildSheet';
import { EditChildSheet } from '@/components/children/EditChildSheet';

export default function MyChildren() {
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const { data: children = [], isLoading } = useChildren();
  const deleteChild = useDeleteChild();

  const handleEdit = (child: Child) => {
    setSelectedChild(child);
    setEditSheetOpen(true);
  };

  const handleDelete = (child: Child) => {
    if (confirm(`Remover ${child.nickname || child.name}?`)) {
      deleteChild.mutate(child.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
              >
                <CaretLeft weight="thin" className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Meus Filhos</h1>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAddSheetOpen(true)}
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
          >
            <Plus weight="thin" className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="annia-glass p-4 rounded-lg border border-border/30 animate-pulse"
              >
                <div className="h-5 w-32 bg-muted/30 rounded mb-2" />
                <div className="h-4 w-24 bg-muted/30 rounded" />
              </div>
            ))}
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma criança cadastrada
            </p>
            <Button
              variant="link"
              onClick={() => setAddSheetOpen(true)}
              className="mt-2 text-primary"
            >
              Adicionar primeira criança
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onEdit={() => handleEdit(child)}
                onDelete={() => handleDelete(child)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sheets */}
      <AddChildSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />
      <EditChildSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        child={selectedChild}
      />
    </div>
  );
}
