import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@phosphor-icons/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// ── Schema ────────────────────────────────────────────────────

const step2Schema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  nickname: z.string().min(2, 'Mínimo 2 caracteres'),
  whatsapp: z.string()
    .transform(val => val.replace(/\D/g, ''))
    .pipe(
      z.string()
        .length(11, 'Número de WhatsApp inválido. Use o formato (XX) 9XXXX-XXXX')
        .regex(/^[1-9][1-9]9\d{8}$/, 'Número de WhatsApp inválido. Use o formato (XX) 9XXXX-XXXX')
    ),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'Obrigatório' }) }),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: 'Obrigatório' }) }),
});

export type Step2FormData = z.input<typeof step2Schema>;

// ── Helpers ───────────────────────────────────────────────────

function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// ── Props ─────────────────────────────────────────────────────

interface WizardStep2FormProps {
  defaultValues: {
    firstName: string;
    lastName: string;
    nickname: string;
    whatsappDigits: string;
  };
  savingProfile: boolean;
  onSaveProfile: (data: {
    firstName: string;
    lastName: string;
    nickname: string;
    whatsappDigits: string;
  }) => Promise<{ error?: string } | void>;
}

// ── Component ─────────────────────────────────────────────────

export function WizardStep2Form({
  defaultValues,
  savingProfile,
  onSaveProfile,
}: WizardStep2FormProps) {
  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: defaultValues.firstName,
      lastName: defaultValues.lastName,
      nickname: defaultValues.nickname,
      whatsapp: formatWhatsApp(defaultValues.whatsappDigits),
      termsAccepted: false as unknown as true,
      privacyAccepted: false as unknown as true,
    },
    mode: 'onTouched',
  });

  const { watch, setValue, handleSubmit, formState: { isValid } } = form;
  const firstName = watch('firstName');
  const nickname = watch('nickname');

  // Auto-fill nickname when firstName changes and nickname hasn't been manually edited
  useEffect(() => {
    if (nickname === '' || nickname === defaultValues.firstName) {
      setValue('nickname', firstName, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName]);

  const onSubmit = handleSubmit(async (data) => {
    const digits = data.whatsapp; // Already transformed by zod (digits only)
    const result = await onSaveProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
      whatsappDigits: digits,
    });
    if (result?.error === 'duplicate_whatsapp') {
      form.setError('whatsapp', {
        type: 'manual',
        message: 'Este número de WhatsApp já está cadastrado. Use outro número.',
      });
    } else if (result?.error) {
      form.setError('whatsapp', {
        type: 'manual',
        message: 'Erro ao salvar. Tente novamente.',
      });
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h1 className="text-2xl font-light tracking-tight text-foreground">
        Como quer ser chamada?
      </h1>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-foreground/80">Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Seu nome" autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-foreground/80">Sobrenome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Seu sobrenome" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm text-foreground/80">Apelido</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Seu apelido" />
                </FormControl>
                <p className="text-xs text-muted-foreground">É assim que a Monna vai te chamar</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm text-foreground/80">WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="(00) 90000-0000"
                    value={field.value}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                      field.onChange(formatWhatsApp(digits));
                      if (form.formState.errors.whatsapp?.type === 'manual') {
                        form.clearErrors('whatsapp');
                      }
                    }}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">Informe com DDD. É por aqui que a Monna vai te ajudar</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3 text-left">
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0 min-h-[44px]">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(c) => field.onChange(c === true)}
                      className="mt-0.5 h-5 w-5"
                    />
                  </FormControl>
                  <FormLabel className="text-sm leading-snug text-foreground/80 cursor-pointer font-normal">
                    Li e aceito os{' '}
                    <a
                      href="/static/termos.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/80"
                    >
                      Termos de Uso
                    </a>
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privacyAccepted"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0 min-h-[44px]">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(c) => field.onChange(c === true)}
                      className="mt-0.5 h-5 w-5"
                    />
                  </FormControl>
                  <FormLabel className="text-sm leading-snug text-foreground/80 cursor-pointer font-normal">
                    Li e aceito a{' '}
                    <a
                      href="/static/privacidade.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/80"
                    >
                      Política de Privacidade
                    </a>
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid || savingProfile}
            className="w-full disabled:opacity-50"
            size="lg"
          >
            {savingProfile ? <Spinner className="w-5 h-5 animate-spin" /> : 'Continuar'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
