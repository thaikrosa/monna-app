import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
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
    <div className="max-w-2xl mx-auto py-6 animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="p-1 text-muted-foreground hover:text-foreground transition-all duration-150"
          >
            <CaretLeft weight="thin" className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Minha Rede de Apoio</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Pessoas que fazem parte da sua vida
            </p>
          </div>
        </div>
      </header>

      {/* Botão adicionar */}
      <div className="mb-6">
        <Button 
          onClick={() => setIsAddOpen(true)} 
          variant="outline"
          className="bg-secondary/40 border-border/30 hover:border-primary/30 hover:bg-secondary/60"
        >
          <Plus weight="thin" className="h-4 w-4 mr-2" />
          Adicionar contato
        </Button>
      </div>

      {/* Lista de contatos */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum contato cadastrado</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Adicione pessoas à sua rede de apoio
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={() => setEditingContact(contact)}
              onDelete={() => deleteContact.mutate(contact.id)}
            />
          ))
        )}
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
