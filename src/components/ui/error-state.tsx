import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Não foi possível carregar os dados',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="py-16 text-center bg-card border border-border shadow-elevated rounded-lg">
      <WarningCircle weight="thin" className="h-12 w-12 mx-auto text-destructive/60 mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <ArrowClockwise weight="regular" className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
