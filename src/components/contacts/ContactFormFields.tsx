import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput, PhoneErrorMessage } from '@/components/ui/phone-input';

export interface ContactFormData {
  alias: string;
  formalName: string;
  countryCode: string;
  phoneNumber: string;
  phoneError: boolean;
  phoneValid: boolean;
  intimacyLevel: string;
  canAnniaMessage: boolean;
  category: string;
  notes: string;
}

export const emptyContactFormData: ContactFormData = {
  alias: '',
  formalName: '',
  countryCode: 'BR',
  phoneNumber: '',
  phoneError: false,
  phoneValid: false,
  intimacyLevel: '2',
  canAnniaMessage: false,
  category: 'Outros',
  notes: '',
};

export const CONTACT_CATEGORIES = [
  'Família',
  'Escola',
  'Saúde',
  'Prestadores',
  'Outros',
] as const;

interface ContactFormFieldsProps {
  data: ContactFormData;
  onChange: <K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) => void;
  onValidationChange: (isValid: boolean) => void;
  idPrefix?: string;
}

export function ContactFormFields({
  data,
  onChange,
  onValidationChange,
  idPrefix = '',
}: ContactFormFieldsProps) {
  const inputClass = 'bg-background/50';
  const id = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);

  return (
    <div className="space-y-5">
      {/* Alias */}
      <div className="space-y-2">
        <Label htmlFor={id('alias')} className="text-xs text-muted-foreground">
          Como eu chamo
        </Label>
        <Input
          id={id('alias')}
          value={data.alias}
          onChange={(e) => onChange('alias', e.target.value)}
          placeholder="Ex: Meu pai, Pediatra do Antonio"
          className={inputClass}
        />
      </div>

      {/* Formal Name */}
      <div className="space-y-2">
        <Label htmlFor={id('formalName')} className="text-xs text-muted-foreground">
          Nome para a Monna
        </Label>
        <Input
          id={id('formalName')}
          value={data.formalName}
          onChange={(e) => onChange('formalName', e.target.value)}
          placeholder="Ex: Alvaro, Dr. Marcos"
          className={inputClass}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Telefone (WhatsApp)</Label>
        <PhoneInput
          value={data.phoneNumber}
          onChange={(value) => onChange('phoneNumber', value)}
          countryCode={data.countryCode}
          onCountryChange={(code) => onChange('countryCode', code)}
          error={data.phoneError}
          onValidationChange={onValidationChange}
        />
        <PhoneErrorMessage show={data.phoneError} />
      </div>

      {/* Can Monna Message */}
      <div className="flex items-center justify-between py-2">
        <div className="space-y-0.5">
          <Label htmlFor={id('canAnnia')} className="text-sm">
            Permitir mensagens da Monna
          </Label>
          <p className="text-xs text-muted-foreground">
            Monna poderá enviar mensagens para este contato
          </p>
        </div>
        <Switch
          id={id('canAnnia')}
          checked={data.canAnniaMessage}
          onCheckedChange={(value) => onChange('canAnniaMessage', value)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor={id('notes')} className="text-xs text-muted-foreground">
          Notas
        </Label>
        <Textarea
          id={id('notes')}
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Observações sobre este contato..."
          className={`${inputClass} resize-none`}
          rows={3}
        />
      </div>
    </div>
  );
}
