import { PencilSimple, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import type { Contact } from '@/hooks/useContacts';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

export function ContactCard({ contact, onEdit, onDelete, onClick }: ContactCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="bg-card p-4 rounded-lg border border-border shadow-elevated transition-all duration-150 hover:border-primary/50 hover:shadow-md cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Alias */}
          <h3 className="font-medium text-foreground truncate">{contact.alias}</h3>

          {/* Nome formal */}
          <p className="text-sm text-muted-foreground truncate">
            {contact.formal_name}
          </p>

          {/* Notas (se existirem) */}
          {contact.notes && (
            <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1 italic">
              {contact.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Editar - sempre visível */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          >
            <PencilSimple weight="regular" className="h-4 w-4" />
          </Button>

          {/* Deletar - sempre visível */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
          >
            <Trash weight="regular" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
