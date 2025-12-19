import { Crown } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface PaywallTeaserProps {
  onSubscribe: () => void;
}

export function PaywallTeaser({ onSubscribe }: PaywallTeaserProps) {
  return (
    <div className="bg-gradient-to-r from-annia-navy to-annia-navy/90 text-primary-foreground rounded-lg p-6 text-center">
      <Crown weight="regular" className="w-8 h-8 mx-auto mb-3 text-amber-400" />
      <h3 className="font-bold text-lg mb-2">Desbloqueie tudo</h3>
      <p className="text-sm text-primary-foreground/80 mb-4">
        Acesse agenda completa, lembretes ilimitados e sugestões personalizadas da Annia.
      </p>
      <Button 
        onClick={onSubscribe}
        className="bg-annia-olive hover:bg-annia-olive-hover text-primary-foreground transition-colors duration-200"
      >
        <Crown weight="regular" className="w-4 h-4 mr-2" />
        Assinar agora
      </Button>
    </div>
  );
}
