import { Button } from '@/components/ui/button';
import { Spinner } from '@phosphor-icons/react';

interface WizardStep3CompleteProps {
  displayNickname: string;
  appReady: boolean;
  onGoToApp: () => void;
}

export function WizardStep3Complete({
  displayNickname,
  appReady,
  onGoToApp,
}: WizardStep3CompleteProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h1 className="text-3xl font-light tracking-tight text-foreground">
        Prontinho{displayNickname ? `, ${displayNickname}` : ''}! 💛
      </h1>
      <p className="text-lg text-foreground/80 leading-relaxed">
        Vai lá no WhatsApp que a Monna já te mandou uma mensagem.
      </p>
      <p className="text-sm text-muted-foreground">
        Se a mensagem ainda não chegou, aguarde alguns segundinhos.
      </p>
      <Button
        onClick={onGoToApp}
        disabled={!appReady}
        className="w-full"
        size="lg"
      >
        {appReady ? 'Ir para o aplicativo' : (
          <span className="flex items-center gap-2">
            <Spinner className="w-4 h-4 animate-spin" />
            Preparando...
          </span>
        )}
      </Button>
    </div>
  );
}
