import { useState, useEffect, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useUpdateContact, type Contact } from '@/hooks/useContacts';
import {
  countries,
  applyMask,
  formatFullPhone,
  detectCountryFromPhone,
  extractPhoneWithoutDialCode,
} from '@/lib/phone-countries';
import {
  ContactFormFields,
  type ContactFormData,
  emptyContactFormData,
} from './ContactFormFields';

interface EditContactSheetProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function contactToFormData(contact: Contact): ContactFormData {
  const detectedCountry = detectCountryFromPhone(contact.phone);
  const localNumber = extractPhoneWithoutDialCode(contact.phone, detectedCountry);
  const masked = applyMask(localNumber, detectedCountry.mask);

  return {
    alias: contact.alias,
    formalName: contact.formal_name,
    countryCode: detectedCountry.code,
    phoneNumber: masked,
    phoneError: false,
    phoneValid: true, // Existing phone is assumed valid
    intimacyLevel: String(contact.intimacy_level),
    canAnniaMessage: contact.can_annia_message,
    category: contact.category || 'Outros',
    notes: contact.notes || '',
  };
}

export function EditContactSheet({ contact, open, onOpenChange }: EditContactSheetProps) {
  const [formData, setFormData] = useState<ContactFormData>(emptyContactFormData);
  const updateContact = useUpdateContact();

  // Sync form with contact when it changes
  useEffect(() => {
    if (contact) {
      setFormData(contactToFormData(contact));
    }
  }, [contact]);

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

    if (!contact) return;

    if (!formData.phoneValid) {
      setFormData((prev) => ({ ...prev, phoneError: true }));
      return;
    }

    if (!canSubmit) return;

    const country = countries.find((c) => c.code === formData.countryCode) || countries[0];
    const fullPhone = formatFullPhone(country.dialCode, formData.phoneNumber);

    updateContact.mutate(
      {
        id: contact.id,
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
          <SheetDescription>Atualize as informações do contato</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6">
          <ContactFormFields
            data={formData}
            onChange={updateField}
            onValidationChange={handleValidationChange}
            idPrefix="edit"
          />

          <SheetFooter className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || updateContact.isPending}
            >
              {updateContact.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
