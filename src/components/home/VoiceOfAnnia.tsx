import { ChatCircleDots } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { TypewriterText } from './TypewriterText';
import type { DailyInsight } from '@/hooks/useDailyInsight';

interface VoiceOfAnniaProps {
  insight: DailyInsight | null | undefined;
}

const DEFAULT_MESSAGE = "Estou aqui para te ajudar hoje. O que vamos organizar juntas?";

export function VoiceOfAnnia({ insight }: VoiceOfAnniaProps) {
  const message = insight?.message || DEFAULT_MESSAGE;
  
  return (
    <div className="bg-inverse rounded-2xl p-5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-inverse-foreground/10 flex items-center justify-center">
          <ChatCircleDots weight="thin" className="h-4 w-4 text-inverse-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs text-inverse-muted mb-2">Annia diz</p>
          <TypewriterText text={message} className="text-inverse-foreground" />
          
          {insight?.action_label && insight?.action_url && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-inverse-foreground/20 text-inverse-foreground hover:bg-inverse-foreground/10"
              asChild
            >
              <a href={insight.action_url} target="_blank" rel="noopener noreferrer">
                {insight.action_label}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
