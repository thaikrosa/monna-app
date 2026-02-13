import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleLogo, Spinner, EnvelopeSimple } from '@phosphor-icons/react';

interface WizardStep1LoginProps {
  signingIn: boolean;
  showMagicLink: boolean;
  magicEmail: string;
  magicLinkSent: boolean;
  sendingMagicLink: boolean;
  onGoogleLogin: () => void;
  onMagicLink: () => void;
  onSetMagicEmail: (email: string) => void;
  onSetShowMagicLink: (show: boolean) => void;
}

export function WizardStep1Login({
  signingIn,
  showMagicLink,
  magicEmail,
  magicLinkSent,
  sendingMagicLink,
  onGoogleLogin,
  onMagicLink,
  onSetMagicEmail,
  onSetShowMagicLink,
}: WizardStep1LoginProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h1 className="text-3xl font-light tracking-tight text-foreground">
        Prontinho! 💛
      </h1>
      <p className="text-foreground/80 leading-relaxed">
        Sua assinatura está confirmada. Agora vamos preparar tudo pra você.
      </p>

      <Button
        onClick={onGoogleLogin}
        disabled={signingIn}
        className="w-full gap-2"
        size="lg"
      >
        {signingIn ? (
          <Spinner className="w-5 h-5 animate-spin" />
        ) : (
          <GoogleLogo weight="bold" className="w-5 h-5" />
        )}
        Entrar com Google
      </Button>

      {/* Separator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-sm text-muted-foreground">ou</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {!showMagicLink ? (
        <button
          onClick={() => onSetShowMagicLink(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Prefiro usar outro email
        </button>
      ) : magicLinkSent ? (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-center gap-2 text-primary">
            <EnvelopeSimple weight="thin" className="w-5 h-5" />
            <span className="text-sm font-medium">Link enviado!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Enviamos um link para <strong className="text-foreground">{magicEmail}</strong>. Verifique sua caixa de entrada.
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-200">
          <Input
            type="email"
            value={magicEmail}
            onChange={(e) => onSetMagicEmail(e.target.value)}
            placeholder="seu@email.com"
            className="text-center"
            autoFocus
          />
          <Button
            onClick={onMagicLink}
            disabled={!magicEmail.includes('@') || sendingMagicLink}
            variant="outline"
            className="w-full gap-2"
          >
            {sendingMagicLink ? (
              <Spinner className="w-4 h-4 animate-spin" />
            ) : (
              <EnvelopeSimple weight="thin" className="w-4 h-4" />
            )}
            Enviar link de acesso
          </Button>
        </div>
      )}
    </div>
  );
}
