import { useState, useCallback } from 'react';
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
import { PhoneInput, PhoneErrorMessage } from '@/components/ui/phone-input';
import { useAddContact } from '@/hooks/useContacts';
import { countries, getDigitsOnly, formatFullPhone } from '@/lib/phone-countries';

interface AddContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContactSheet({ open, onOpenChange }: AddContactSheetProps) {
  const [alias, setAlias] = useState('');
  const [formalName, setFormalName] = useState('');
  const [countryCode, setCountryCode] = useState('BR');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [intimacyLevel, setIntimacyLevel] = useState('2');
  const [canAnniaMessage, setCanAnniaMessage] = useState(false);
  const [category, setCategory] = useState('Outros');
  const [notes, setNotes] = useState('');

  const addContact = useAddContact();

  const handleValidationChange = useCallback((isValid: boolean) => {
    setPhoneValid(isValid);
    if (isValid) setPhoneError(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alias.trim() || !formalName.trim()) return;

    // Validate phone
    if (!phoneValid) {
      setPhoneError(true);
      return;
    }

    const country = countries.find((c) => c.code === countryCode) || countries[0];
    const fullPhone = formatFullPhone(country.dialCode, phoneNumber);

    addContact.mutate(
      {
        alias: alias.trim(),
        formal_name: formalName.trim(),
        phone: fullPhone,
        intimacy_level: parseInt(intimacyLevel),
        can_annia_message: canAnniaMessage,
        category: category,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          // Reset form
          setAlias('');
          setFormalName('');
          setPhoneNumber('');
          setPhoneError(false);
          setIntimacyLevel('2');
          setCanAnniaMessage(false);
          setCategory('Outros');
          setNotes('');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Novo Contato</SheetTitle>
          <SheetDescription>
            Adicione alguém à sua rede de apoio
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
              Nome para a Monna
            </Label>
            <Input
              id="formalName"
              value={formalName}
              onChange={(e) => setFormalName(e.target.value)}
              placeholder="Ex: Alvaro, Dr. Marcos"
              className="bg-background/50"
            />
          </div>

          {/* Telefone com seletor de país */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Telefone (WhatsApp)
            </Label>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              countryCode={countryCode}
              onCountryChange={setCountryCode}
              error={phoneError}
              onValidationChange={handleValidationChange}
            />
            <PhoneErrorMessage show={phoneError} />
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
              Como a Monna deve falar com este contato?
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
                  Próximo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Autorização */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="canAnnia" className="text-sm">
                Permitir mensagens da Monna
              </Label>
              <p className="text-xs text-muted-foreground">
                Monna poderá enviar mensagens para este contato
              </p>
            </div>
            <Switch
              id="canAnnia"
              checked={canAnniaMessage}
              onCheckedChange={setCanAnniaMessage}
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs text-muted-foreground">
              Notas
            </Label>
            <Textarea
              id="notes"
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
              disabled={!alias.trim() || !formalName.trim() || !phoneNumber.trim() || addContact.isPending}
            >
              {addContact.isPending ? 'Salvando...' : 'Salvar contato'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
