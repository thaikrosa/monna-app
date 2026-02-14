import { Link } from 'react-router-dom';
import { Users, WhatsappLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useContacts, type Contact } from '@/hooks/useContacts';

export function ContactsPreview() {
  const { data: contacts = [], isLoading } = useContacts();

  // Get family contacts sorted by intimacy
  const familyContacts = contacts
    .filter((c: Contact) => c.category === 'Família')
    .sort((a: Contact, b: Contact) => (b.intimacy_level || 0) - (a.intimacy_level || 0))
    .slice(0, 3);

  if (isLoading) {
    return (
      <section>
        <h2 className="text-base font-medium text-foreground mb-3">
          Contatos Importantes
        </h2>
        <Skeleton className="h-24 w-full" />
      </section>
    );
  }

  if (contacts.length === 0) {
    return (
      <section>
        <h2 className="text-base font-medium text-foreground mb-3">
          Contatos Importantes
        </h2>
        <div className="annia-glass p-4 rounded-lg border border-border/30 text-center">
          <p className="text-muted-foreground text-sm">
            Nenhum contato cadastrado
          </p>
          <Link to="/rede-apoio">
            <Button variant="link" className="text-primary mt-1">
              Adicionar primeiro contato
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-3">
        Sua rede de apoio
      </h2>

      <div className="annia-glass p-4 rounded-lg border border-border/30">
        {familyContacts.length > 0 ? (
          <div className="space-y-2 mb-3">
            {familyContacts.map((contact: Contact) => (
              <div key={contact.id} className="flex items-center gap-2">
                <Users weight="thin" className="h-4 w-4 text-primary" />
                <span className="text-foreground text-sm">{contact.alias}</span>
                <span className="text-xs text-muted-foreground">
                  (Família)
                </span>
                {contact.can_annia_message && (
                  <WhatsappLogo weight="thin" className="h-4 w-4 text-primary/70 ml-auto" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-3">
            Nenhum contato de família cadastrado
          </p>
        )}

        <Link to="/rede-apoio">
          <Button variant="ghost" size="sm" className="w-full text-primary">
            Ver todos os contatos
          </Button>
        </Link>
      </div>
    </section>
  );
}
