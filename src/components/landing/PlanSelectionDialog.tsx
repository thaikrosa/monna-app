import { useState } from 'react';
import { CircleNotch } from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface PlanSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Plan = 'annual' | 'monthly';

export function PlanSelectionDialog({ open, onOpenChange }: PlanSelectionDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('annual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-checkout-session',
        { body: { plan: selectedPlan } }
      );

      if (fnError) throw fnError;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (err: any) {
      setError('Não foi possível iniciar o checkout. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 border-border bg-background">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-medium text-foreground text-center">
            Respira. A Monna cuida do resto.
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Sua paz mental por menos de R$1 ao dia.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Annual Plan */}
            <button
              type="button"
              onClick={() => setSelectedPlan('annual')}
              className={cn(
                "relative text-left rounded-lg border-2 p-5 transition-all duration-150",
                selectedPlan === 'annual'
                  ? "border-primary bg-primary/5 shadow-elevated"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <Badge className="absolute -top-2.5 left-4 text-[10px] px-2 py-0.5">
                Melhor valor
              </Badge>

              <div className="mt-1">
                <p className="text-sm font-medium text-muted-foreground">Anual</p>
                <p className="text-2xl font-semibold text-foreground">
                  R$ 29,90
                  <span className="text-sm font-normal text-muted-foreground">/mês</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  R$ 358,80/ano
                </p>
                <Badge variant="secondary" className="mt-2 text-[10px]">
                  🎁 2 meses grátis
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                7 dias grátis para testar
              </p>

              {/* Selection indicator */}
              <div className={cn(
                "absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-all duration-150",
                selectedPlan === 'annual'
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/40"
              )}>
                {selectedPlan === 'annual' && (
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </button>

            {/* Monthly Plan */}
            <button
              type="button"
              onClick={() => setSelectedPlan('monthly')}
              className={cn(
                "relative text-left rounded-lg border-2 p-5 transition-all duration-150",
                selectedPlan === 'monthly'
                  ? "border-primary bg-primary/5 shadow-elevated"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensal</p>
                <p className="text-2xl font-semibold text-foreground">
                  R$ 34,90
                  <span className="text-sm font-normal text-muted-foreground">/mês</span>
                </p>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                7 dias grátis para testar
              </p>

              {/* Selection indicator */}
              <div className={cn(
                "absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-all duration-150",
                selectedPlan === 'monthly'
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/40"
              )}>
                {selectedPlan === 'monthly' && (
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-3">
          <Button
            size="lg"
            className="w-full h-12 text-base gap-2"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircleNotch weight="regular" className="h-4 w-4 animate-spin" />
                Redirecionando...
              </>
            ) : (
              'TESTAR 7 DIAS GRÁTIS'
            )}
          </Button>

          {error && (
            <p className="text-xs text-destructive text-center">{error}</p>
          )}

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Não gostou? Cancele com um zap.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
