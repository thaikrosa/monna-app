import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@phosphor-icons/react';
import {
  type OnboardingFormData,
  formatWhatsApp,
  extractDigits,
  isValidWhatsApp,
} from '@/hooks/useOnboardingWizard';

interface WizardStep2FormProps {
  formData: OnboardingFormData;
  whatsappTouched: boolean;
  savingProfile: boolean;
  canContinue: boolean;
  onUpdateField: <K extends keyof OnboardingFormData>(field: K, value: OnboardingFormData[K]) => void;
  onSetWhatsappTouched: (touched: boolean) => void;
  onSaveProfile: () => void;
}

export function WizardStep2Form({
  formData,
  whatsappTouched,
  savingProfile,
  canContinue,
  onUpdateField,
  onSetWhatsappTouched,
  onSaveProfile,
}: WizardStep2FormProps) {
  const whatsappDisplay = formatWhatsApp(formData.whatsappDigits);

  const handleFirstNameChange = (value: string) => {
    onUpdateField('firstName', value);
    // Auto-fill nickname if user hasn't manually changed it
    if (formData.nickname === '' || formData.nickname === formData.firstName) {
      onUpdateField('nickname', value);
    }
  };

  const handleWhatsappChange = (value: string) => {
    const digits = extractDigits(value).slice(0, 11);
    onUpdateField('whatsappDigits', digits);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h1 className="text-2xl font-light tracking-tight text-foreground">
        Como quer ser chamada?
      </h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm text-foreground/80">Nome</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            placeholder="Seu nome"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm text-foreground/80">Sobrenome</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onUpdateField('lastName', e.target.value)}
            placeholder="Seu sobrenome"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="nickname" className="text-sm text-foreground/80">Como quer ser chamada?</Label>
          <Input
            id="nickname"
            value={formData.nickname}
            onChange={(e) => onUpdateField('nickname', e.target.value)}
            placeholder="Seu apelido"
          />
          <p className="text-xs text-muted-foreground">É assim que a Monna vai te chamar 🤍</p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="whatsapp" className="text-sm text-foreground/80">WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={whatsappDisplay}
            onChange={(e) => handleWhatsappChange(e.target.value)}
            onBlur={() => onSetWhatsappTouched(true)}
            placeholder="(00) 00000-0000"
          />
          <p className="text-xs text-muted-foreground">Informe com DDD. É por aqui que a Monna vai te ajudar 💬</p>
          {whatsappTouched && formData.whatsappDigits.length > 0 && !isValidWhatsApp(formData.whatsappDigits) && (
            <p className="text-xs text-destructive">Informe um número válido com DDD (10 ou 11 dígitos)</p>
          )}
        </div>
      </div>

      <div className="space-y-3 text-left">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(c) => onUpdateField('termsAccepted', c === true)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm leading-snug text-foreground/80 cursor-pointer">
            Li e aceito os{' '}
            <a
              href="/static/termos.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/80"
            >
              Termos de Uso
            </a>
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={formData.privacyAccepted}
            onCheckedChange={(c) => onUpdateField('privacyAccepted', c === true)}
            className="mt-0.5"
          />
          <Label htmlFor="privacy" className="text-sm leading-snug text-foreground/80 cursor-pointer">
            Li e aceito a{' '}
            <a
              href="/static/privacidade.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/80"
            >
              Política de Privacidade
            </a>
          </Label>
        </div>
      </div>

      <Button
        onClick={onSaveProfile}
        disabled={!canContinue || savingProfile}
        className="w-full"
        size="lg"
      >
        {savingProfile ? <Spinner className="w-5 h-5 animate-spin" /> : 'Continuar'}
      </Button>
    </div>
  );
}
