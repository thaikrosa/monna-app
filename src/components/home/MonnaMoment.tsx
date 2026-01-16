import { Sparkle, Crown } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MonnaSuggestion } from '@/types/home-dashboard';

interface MonnaMomentProps {
  suggestions: MonnaSuggestion[];
  isSubscriber: boolean;
  onPaywall: () => void;
}

export function MonnaMoment({ suggestions, isSubscriber, onPaywall }: MonnaMomentProps) {
  // Show max 3, or 1 if not subscriber
  const displaySuggestions = isSubscriber ? suggestions.slice(0, 3) : suggestions.slice(0, 1);

  if (displaySuggestions.length === 0) return null;

  return (
    <div className="bg-card border border-border/60 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkle weight="regular" className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Momento com a Monna</h3>
      </div>
      
      <div className="space-y-3">
        {displaySuggestions.map((suggestion, index) => (
          <div 
            key={suggestion.id} 
            className="bg-secondary/50 rounded-lg p-3 relative"
          >
            {!isSubscriber && index === 0 && (
              <Badge className="absolute -top-2 right-2 bg-amber-500 text-white">
                <Crown weight="regular" className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
            
            <p className="text-sm text-card-foreground mb-3 pr-16">
              {suggestion.insight}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {isSubscriber ? (
                <>
                  <Button 
                    size="sm"
                    className="bg-monna-olive hover:bg-monna-olive-hover text-primary-foreground transition-colors duration-200"
                  >
                    Aceitar
                  </Button>
                  {suggestion.actions.adjust && (
                    <Button size="sm" variant="outline" className="transition-colors duration-200">
                      Ajustar
                    </Button>
                  )}
                  {suggestion.actions.dismiss && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      Agora não
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  size="sm"
                  onClick={onPaywall}
                  className="bg-monna-olive hover:bg-monna-olive-hover text-primary-foreground transition-colors duration-200"
                >
                  <Crown weight="regular" className="w-3 h-3 mr-1" />
                  Desbloquear
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!isSubscriber && suggestions.length > 1 && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          +{suggestions.length - 1} sugestões disponíveis para assinantes
        </p>
      )}
    </div>
  );
}
