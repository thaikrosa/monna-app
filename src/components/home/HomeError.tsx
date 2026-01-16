import { Warning, ArrowClockwise } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface HomeErrorProps {
  onRetry: () => void;
}

export function HomeError({ onRetry }: HomeErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 rounded-full bg-destructive/10 mb-4">
        <Warning weight="regular" className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Encontrei uma dificuldade
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Isso pode ser temporário. Tente novamente.
      </p>
      <Button 
        onClick={onRetry}
        className="bg-annia-olive hover:bg-annia-olive-hover text-primary-foreground transition-colors duration-200"
      >
        <ArrowClockwise weight="regular" className="w-4 h-4 mr-2" />
        Tentar novamente
      </Button>
    </div>
  );
}
