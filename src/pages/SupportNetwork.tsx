import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ContactCard } from '@/components/contacts/ContactCard';
import { AddContactSheet } from '@/components/contacts/AddContactSheet';
import { EditContactSheet } from '@/components/contacts/EditContactSheet';
import { useContacts, useDeleteContact, type Contact } from '@/hooks/useContacts';

export default function SupportNetwork() {
  const { data: contacts = [], isLoading } = useContacts();
  const deleteContact = useDeleteContact();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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
            <h1 className="text-lg font-semibold text-foreground">Contatos Importantes</h1>
          </div>

          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-card p-4 rounded-lg border border-border shadow-elevated animate-pulse"
                >
                  <div className="h-5 w-32 bg-secondary rounded mb-2" />
                  <div className="h-4 w-24 bg-secondary rounded" />
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border shadow-elevated rounded-lg">
              <p className="text-primary/80">Nenhum contato cadastrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione pessoas importantes para você
              </p>
            </div>
          ) : (
            contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={() => setEditingContact(contact)}
                onDelete={() => deleteContact.mutate(contact.id)}
                onClick={() => setEditingContact(contact)}
              />
            ))
          )}
          <Button
            onClick={() => setIsAddOpen(true)}
            className="w-full mt-4"
          >
            <Plus weight="regular" className="h-4 w-4 mr-2" />
            Adicionar contato
          </Button>
        </div>
      </div>

      {/* Sheets */}
      <AddContactSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
      <EditContactSheet
        contact={editingContact}
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
      />
    </div>
  );
}
