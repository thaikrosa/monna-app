import { useState } from 'react';
import { Sparkle, Check, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useUpdateSuggestionStatus, type AiSuggestion } from '@/hooks/useAiSuggestions';

interface MonnaMomentSectionProps {
  suggestions: AiSuggestion[];
}

export function MonnaMomentSection({ suggestions }: MonnaMomentSectionProps) {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const updateStatus = useUpdateSuggestionStatus();

  const handleAccept = async (id: string) => {
    setHiddenIds(prev => new Set(prev).add(id));
    await updateStatus.mutateAsync({ id, status: 'accepted' });
  };

  const handleDismiss = async (id: string) => {
    setHiddenIds(prev => new Set(prev).add(id));
    await updateStatus.mutateAsync({ id, status: 'dismissed' });
  };

  const visibleSuggestions = suggestions.filter(s => !hiddenIds.has(s.id));

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2 px-1">
        <Sparkle weight="thin" className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-foreground">Momento Monna</p>
      </div>

      <div className="space-y-3">
        {visibleSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`
              monna-glass rounded-2xl p-4 transition-all duration-200
              ${hiddenIds.has(suggestion.id) ? 'animate-fade-out' : 'animate-fade-in'}
            `}
          >
            <h4 className="text-sm font-medium text-foreground mb-1">
              {suggestion.title}
            </h4>
            
            {suggestion.description && (
              <p className="text-xs text-muted-foreground mb-3">
                {suggestion.description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => handleAccept(suggestion.id)}
                disabled={updateStatus.isPending}
              >
                <Check weight="thin" className="h-3 w-3 mr-1" />
                Aceitar
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground h-8"
                onClick={() => handleDismiss(suggestion.id)}
                disabled={updateStatus.isPending}
              >
                <X weight="thin" className="h-3 w-3 mr-1" />
                Dispensar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
