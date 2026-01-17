import { WhatsappLogo, PencilSimple, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import type { Contact } from '@/hooks/useContacts';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

const intimacyLabels: Record<number, string> = {
  1: 'Formal',
  2: 'Amigável',
  3: 'Próximo',
};

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, '')}`;

  return (
    <div className="bg-card p-4 rounded-lg border border-border/30 group transition-all duration-150 hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Alias + Category Badge + Annia indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-foreground truncate">{contact.alias}</h3>
            
            {/* Category badge */}
            {contact.category && contact.category !== 'Outros' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/40 text-accent-foreground">
                {contact.category}
              </span>
            )}
            
            {/* Indicador verde oliva se can_annia_message */}
            {contact.can_annia_message && (
              <div 
                className="h-2 w-2 rounded-full bg-accent flex-shrink-0" 
                title="Annia pode enviar mensagens" 
              />
            )}
          </div>
          
          {/* Nome formal + intimidade em cor secundária */}
          <p className="text-sm text-muted-foreground truncate">
            {contact.formal_name} · {intimacyLabels[contact.intimacy_level] || 'Amigável'}
          </p>

          {/* Notas (se existirem) */}
          {contact.notes && (
            <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1 italic">
              {contact.notes}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Botão WhatsApp - sempre visível */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground/60 hover:text-primary active:text-primary hover:bg-transparent transition-all duration-150"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsappLogo weight="thin" className="h-5 w-5" />
            </a>
          </Button>
          
          {/* Editar - hover reveal */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            <PencilSimple weight="thin" className="h-4 w-4" />
          </Button>
          
          {/* Deletar - hover reveal */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            <Trash weight="thin" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
