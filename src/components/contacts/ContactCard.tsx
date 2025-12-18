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
  3: 'Íntimo',
};

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, '')}`;

  return (
    <div className="annia-glass p-4 rounded-lg border border-border/30 group transition-all duration-150 hover:border-border/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Alias em destaque */}
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{contact.alias}</h3>
            {/* Indicador verde oliva se can_annia_message */}
            {contact.can_annia_message && (
              <div 
                className="h-2 w-2 rounded-full bg-primary/70 flex-shrink-0" 
                title="Annia pode enviar mensagens" 
              />
            )}
          </div>
          
          {/* Nome formal + intimidade em cor secundária */}
          <p className="text-sm text-muted-foreground truncate">
            {contact.formal_name} · {intimacyLabels[contact.intimacy_level] || 'Amigável'}
          </p>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Botão WhatsApp - sempre visível */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary transition-all duration-150"
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
            className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            <PencilSimple weight="thin" className="h-4 w-4" />
          </Button>
          
          {/* Deletar - hover reveal */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            <Trash weight="thin" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
