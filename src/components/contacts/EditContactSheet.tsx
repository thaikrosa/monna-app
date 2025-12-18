import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateContact, type Contact } from '@/hooks/useContacts';

interface EditContactSheetProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditContactSheet({ contact, open, onOpenChange }: EditContactSheetProps) {
  const [alias, setAlias] = useState('');
  const [formalName, setFormalName] = useState('');
  const [phone, setPhone] = useState('');
  const [intimacyLevel, setIntimacyLevel] = useState('2');
  const [canAnniaMessage, setCanAnniaMessage] = useState(false);
  const [category, setCategory] = useState('Outros');
  const [notes, setNotes] = useState('');

  const updateContact = useUpdateContact();

  // Sync form with contact when it changes
  useEffect(() => {
    if (contact) {
      setAlias(contact.alias);
      setFormalName(contact.formal_name);
      setPhone(contact.phone);
      setIntimacyLevel(String(contact.intimacy_level));
      setCanAnniaMessage(contact.can_annia_message);
      setCategory(contact.category || 'Outros');
      setNotes(contact.notes || '');
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact || !alias.trim() || !formalName.trim() || !phone.trim()) return;

    updateContact.mutate(
      {
        id: contact.id,
        alias: alias.trim(),
        formal_name: formalName.trim(),
        phone: phone.trim(),
        intimacy_level: parseInt(intimacyLevel),
        can_annia_message: canAnniaMessage,
        category: category,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Contato</SheetTitle>
          <SheetDescription>
            Atualize as informações do contato
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Como eu chamo */}
          <div className="space-y-2">
            <Label htmlFor="edit-alias" className="text-xs text-muted-foreground">
              Como eu chamo
            </Label>
            <Input
              id="edit-alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ex: Meu pai, Pediatra do Antonio"
              className="bg-background/50"
            />
          </div>

          {/* Nome para a Annia */}
          <div className="space-y-2">
            <Label htmlFor="edit-formalName" className="text-xs text-muted-foreground">
              Nome para a Annia
            </Label>
            <Input
              id="edit-formalName"
              value={formalName}
              onChange={(e) => setFormalName(e.target.value)}
              placeholder="Ex: Alvaro, Dr. Marcos"
              className="bg-background/50"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-xs text-muted-foreground">
              Telefone (WhatsApp)
            </Label>
            <Input
              id="edit-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5511999999999"
              className="bg-background/50"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Categoria
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Família">Família</SelectItem>
                <SelectItem value="Escola">Escola</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Prestadores">Prestadores</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Como a Annia deve falar */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">
              Como a Annia deve falar com este contato?
            </Label>
            <RadioGroup
              value={intimacyLevel}
              onValueChange={setIntimacyLevel}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="edit-formal" />
                <Label htmlFor="edit-formal" className="text-sm font-normal cursor-pointer">
                  Formal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="edit-friendly" />
                <Label htmlFor="edit-friendly" className="text-sm font-normal cursor-pointer">
                  Amigável
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="edit-intimate" />
                <Label htmlFor="edit-intimate" className="text-sm font-normal cursor-pointer">
                  Próximo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Autorização */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="edit-canAnnia" className="text-sm">
                Permitir mensagens da Annia
              </Label>
              <p className="text-xs text-muted-foreground">
                Annia poderá enviar mensagens para este contato
              </p>
            </div>
            <Switch
              id="edit-canAnnia"
              checked={canAnniaMessage}
              onCheckedChange={setCanAnniaMessage}
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes" className="text-xs text-muted-foreground">
              Notas
            </Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre este contato..."
              className="bg-background/50 resize-none"
              rows={3}
            />
          </div>

          <SheetFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={!alias.trim() || !formalName.trim() || !phone.trim() || updateContact.isPending}
            >
              {updateContact.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
