import { Button } from '@/components/ui/button';

interface ErrorScreenProps {
  onRetry: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <p className="text-muted-foreground text-center">
        Algo deu errado ao carregar. Verifique sua conexão e tente novamente.
      </p>
      <Button onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}
