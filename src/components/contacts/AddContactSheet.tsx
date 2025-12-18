import { useState } from 'react';
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
import { useAddContact } from '@/hooks/useContacts';

interface AddContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContactSheet({ open, onOpenChange }: AddContactSheetProps) {
  const [alias, setAlias] = useState('');
  const [formalName, setFormalName] = useState('');
  const [phone, setPhone] = useState('');
  const [intimacyLevel, setIntimacyLevel] = useState('2');
  const [canAnniaMessage, setCanAnniaMessage] = useState(false);

  const addContact = useAddContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alias.trim() || !formalName.trim() || !phone.trim()) return;

    addContact.mutate(
      {
        alias: alias.trim(),
        formal_name: formalName.trim(),
        phone: phone.trim(),
        intimacy_level: parseInt(intimacyLevel),
        can_annia_message: canAnniaMessage,
        category: null,
        notes: null,
      },
      {
        onSuccess: () => {
          // Reset form
          setAlias('');
          setFormalName('');
          setPhone('');
          setIntimacyLevel('2');
          setCanAnniaMessage(false);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Novo Contato</SheetTitle>
          <SheetDescription>
            Adicione alguém à sua rede de apoio
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Como eu chamo */}
          <div className="space-y-2">
            <Label htmlFor="alias" className="text-xs text-muted-foreground">
              Como eu chamo
            </Label>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ex: Meu pai, Pediatra do Antonio"
              className="bg-background/50"
            />
          </div>

          {/* Nome para a Annia */}
          <div className="space-y-2">
            <Label htmlFor="formalName" className="text-xs text-muted-foreground">
              Nome para a Annia
            </Label>
            <Input
              id="formalName"
              value={formalName}
              onChange={(e) => setFormalName(e.target.value)}
              placeholder="Ex: Alvaro, Dr. Marcos"
              className="bg-background/50"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs text-muted-foreground">
              Telefone (WhatsApp)
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5511999999999"
              className="bg-background/50"
            />
          </div>

          {/* Nível de Intimidade */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">
              Nível de Intimidade
            </Label>
            <RadioGroup
              value={intimacyLevel}
              onValueChange={setIntimacyLevel}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="formal" />
                <Label htmlFor="formal" className="text-sm font-normal cursor-pointer">
                  Formal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="friendly" />
                <Label htmlFor="friendly" className="text-sm font-normal cursor-pointer">
                  Amigável
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="intimate" />
                <Label htmlFor="intimate" className="text-sm font-normal cursor-pointer">
                  Íntimo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Autorização */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="canAnnia" className="text-sm">
                Permitir mensagens da Annia
              </Label>
              <p className="text-xs text-muted-foreground">
                Annia poderá enviar mensagens para este contato
              </p>
            </div>
            <Switch
              id="canAnnia"
              checked={canAnniaMessage}
              onCheckedChange={setCanAnniaMessage}
            />
          </div>

          <SheetFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={!alias.trim() || !formalName.trim() || !phone.trim() || addContact.isPending}
            >
              {addContact.isPending ? 'Salvando...' : 'Salvar contato'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
