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
import { useAddContact } from '@/hooks/useContacts';
import { countries, formatFullPhone } from '@/lib/phone-countries';
import {
  ContactFormFields,
  type ContactFormData,
  emptyContactFormData,
} from './ContactFormFields';

interface AddContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContactSheet({ open, onOpenChange }: AddContactSheetProps) {
  const [formData, setFormData] = useState<ContactFormData>(emptyContactFormData);
  const addContact = useAddContact();

  const updateField = <K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidationChange = useCallback((isValid: boolean) => {
    setFormData((prev) => ({
      ...prev,
      phoneValid: isValid,
      phoneError: isValid ? false : prev.phoneError,
    }));
  }, []);

  const canSubmit =
    formData.alias.trim() &&
    formData.formalName.trim() &&
    formData.phoneNumber.trim() &&
    formData.phoneValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phoneValid) {
      setFormData((prev) => ({ ...prev, phoneError: true }));
      return;
    }

    if (!canSubmit) return;

    const country = countries.find((c) => c.code === formData.countryCode) || countries[0];
    const fullPhone = formatFullPhone(country.dialCode, formData.phoneNumber);

    addContact.mutate(
      {
        alias: formData.alias.trim(),
        formal_name: formData.formalName.trim(),
        phone: fullPhone,
        intimacy_level: parseInt(formData.intimacyLevel),
        can_annia_message: formData.canAnniaMessage,
        category: formData.category,
        notes: formData.notes.trim() || null,
      },
      {
        onSuccess: () => {
          setFormData(emptyContactFormData);
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
          <SheetDescription>Adicione alguém à sua rede de apoio</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6">
          <ContactFormFields
            data={formData}
            onChange={updateField}
            onValidationChange={handleValidationChange}
          />

          <SheetFooter className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || addContact.isPending}
            >
              {addContact.isPending ? 'Salvando...' : 'Salvar contato'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
