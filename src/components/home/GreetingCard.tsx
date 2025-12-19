import { CalendarPlus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { GreetingData } from '@/types/home-dashboard';

interface GreetingCardProps {
  greeting: GreetingData;
  displayName: string;
  onPrimaryCta: () => void;
  onSecondaryCta?: () => void;
}

export function GreetingCard({ greeting, displayName, onPrimaryCta, onSecondaryCta }: GreetingCardProps) {
  // Build dynamic title with name - fix comma formatting
  const rawTitle = greeting.title.includes('{nome}') 
    ? greeting.title.replace('{nome}', displayName)
    : greeting.title;
  
  // Clean up any double commas or comma-question mark issues
  const title = rawTitle.replace(/,\s*,/g, ',').replace(/\?,\s*/g, '? ');

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="bg-primary/5 rounded-2xl p-4 mb-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {greeting.insight}
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={onPrimaryCta}
          className="bg-primary text-primary-foreground rounded-full px-5"
        >
          <CalendarPlus weight="regular" className="w-4 h-4 mr-2" />
          Revisar lembretes
        </Button>
        
        {greeting.secondaryCta && onSecondaryCta && (
          <Button 
            variant="ghost" 
            onClick={onSecondaryCta}
            className="text-muted-foreground hover:text-foreground"
          >
            {greeting.secondaryCta.label}
          </Button>
        )}
      </div>
      
      <span className="text-xs text-muted-foreground/60 mt-4 block">
        {greeting.microcopy}
      </span>
    </div>
  );
}
