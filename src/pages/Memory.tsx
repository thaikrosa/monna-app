import { useState } from 'react';
import { Plus, NotePencil, Trash, X, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNotes, NOTE_COLORS, type Note, type NoteColor } from '@/hooks/useNotes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const colorMap: Record<NoteColor, string> = {
  default: 'bg-card border-border',
  rose: 'bg-[hsl(350,60%,92%)] border-[hsl(350,40%,85%)] dark:bg-[hsl(350,30%,20%)] dark:border-[hsl(350,20%,30%)]',
  peach: 'bg-[hsl(25,70%,90%)] border-[hsl(25,50%,82%)] dark:bg-[hsl(25,30%,20%)] dark:border-[hsl(25,20%,30%)]',
  sand: 'bg-[hsl(45,60%,90%)] border-[hsl(45,40%,82%)] dark:bg-[hsl(45,25%,20%)] dark:border-[hsl(45,15%,30%)]',
  mint: 'bg-[hsl(155,45%,90%)] border-[hsl(155,30%,82%)] dark:bg-[hsl(155,25%,18%)] dark:border-[hsl(155,15%,28%)]',
  sky: 'bg-[hsl(205,60%,92%)] border-[hsl(205,40%,84%)] dark:bg-[hsl(205,30%,18%)] dark:border-[hsl(205,20%,28%)]',
  lavender: 'bg-[hsl(265,45%,92%)] border-[hsl(265,30%,84%)] dark:bg-[hsl(265,25%,20%)] dark:border-[hsl(265,15%,30%)]',
};

const colorSwatchMap: Record<NoteColor, string> = {
  default: 'bg-card border-border',
  rose: 'bg-[hsl(350,60%,92%)] border-[hsl(350,40%,85%)] dark:bg-[hsl(350,30%,25%)] dark:border-[hsl(350,20%,35%)]',
  peach: 'bg-[hsl(25,70%,90%)] border-[hsl(25,50%,82%)] dark:bg-[hsl(25,30%,25%)] dark:border-[hsl(25,20%,35%)]',
  sand: 'bg-[hsl(45,60%,90%)] border-[hsl(45,40%,82%)] dark:bg-[hsl(45,25%,25%)] dark:border-[hsl(45,15%,35%)]',
  mint: 'bg-[hsl(155,45%,90%)] border-[hsl(155,30%,82%)] dark:bg-[hsl(155,25%,23%)] dark:border-[hsl(155,15%,33%)]',
  sky: 'bg-[hsl(205,60%,92%)] border-[hsl(205,40%,84%)] dark:bg-[hsl(205,30%,23%)] dark:border-[hsl(205,20%,33%)]',
  lavender: 'bg-[hsl(265,45%,92%)] border-[hsl(265,30%,84%)] dark:bg-[hsl(265,25%,25%)] dark:border-[hsl(265,15%,35%)]',
};

function NoteCard({ note, onClick }: { note: Note; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-lg border p-3 break-inside-avoid mb-3 transition-all duration-150',
        'hover:shadow-md cursor-pointer',
        colorMap[note.color as NoteColor] || colorMap.default
      )}
    >
      {note.title && (
        <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-1">
          {note.title}
        </h3>
      )}
      {note.content && (
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-6 whitespace-pre-wrap">
          {note.content}
        </p>
      )}
      <p className="text-[10px] text-muted-foreground mt-2">
        {format(new Date(note.updated_at), "d 'de' MMM", { locale: ptBR })}
      </p>
    </button>
  );
}

function ColorPicker({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (color: NoteColor) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {NOTE_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'h-7 w-7 rounded-full border-2 transition-all duration-150 flex items-center justify-center',
            colorSwatchMap[color],
            selected === color
              ? 'ring-2 ring-primary ring-offset-1 ring-offset-background scale-110'
              : 'hover:scale-110'
          )}
          title={color}
        >
          {selected === color && (
            <Check weight="bold" className="h-3 w-3 text-foreground/70" />
          )}
        </button>
      ))}
    </div>
  );
}

export default function Memory() {
  const { notes, isLoading, addNote, updateNote, deleteNote } = useNotes();

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formColor, setFormColor] = useState<NoteColor>('default');

  const openNewNote = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormColor('default');
    setSheetOpen(true);
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormColor((note.color as NoteColor) || 'default');
    setSheetOpen(true);
  };

  const handleSave = () => {
    const trimmedTitle = formTitle.trim();
    const trimmedContent = formContent.trim();

    if (!trimmedTitle && !trimmedContent) return;

    if (editingNote) {
      updateNote(editingNote.id, {
        title: trimmedTitle,
        content: trimmedContent,
        color: formColor,
      });
    } else {
      addNote({
        title: trimmedTitle,
        content: trimmedContent,
        color: formColor,
      });
    }
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (editingNote) {
      deleteNote(editingNote.id);
      setSheetOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <header className="mb-6 animate-slide-up stagger-1">
        <h1 className="sr-only">Notas</h1>
        <p className="text-sm text-primary/80">
          Suas anotações pessoais
        </p>
      </header>

      {/* Content */}
      <div className="animate-slide-up stagger-2">
        {isLoading ? (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-3 mb-3 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-1" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <NotePencil weight="thin" className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma nota ainda
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Toque no botão + para criar sua primeira nota
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onClick={() => openEditNote(note)} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={openNewNote}
        aria-label="Nova nota"
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

      {/* Note Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingNote ? 'Editar nota' : 'Nova nota'}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Titulo (opcional)"
              className="bg-background/50 text-base font-medium border-none shadow-none focus-visible:ring-0 px-0 h-auto py-2"
            />

            <Textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Escreva sua nota..."
              className="bg-background/50 min-h-[200px] resize-none border-none shadow-none focus-visible:ring-0 px-0"
              rows={8}
            />

            {/* Color picker */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Cor</label>
              <ColorPicker selected={formColor} onChange={setFormColor} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4">
              {editingNote && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash weight="regular" className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              )}
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSheetOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!formTitle.trim() && !formContent.trim()}
              >
                Salvar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
