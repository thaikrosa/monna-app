import { CalendarPlus, Gear } from '@phosphor-icons/react';
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
    <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-3xl shadow-lg">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-primary-foreground/90 text-sm mb-4">
        {greeting.insight}
      </p>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={onPrimaryCta}
          className="w-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground transition-colors duration-200"
        >
          <CalendarPlus weight="regular" className="w-4 h-4 mr-2" />
          Revisar lembretes
        </Button>
        
        {greeting.secondaryCta && onSecondaryCta && (
          <Button 
            variant="ghost" 
            onClick={onSecondaryCta}
            className="w-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors duration-200"
          >
            <Gear weight="regular" className="w-4 h-4 mr-2" />
            {greeting.secondaryCta.label}
          </Button>
        )}
      </div>
      
      <p className="text-xs text-primary-foreground/60 mt-4">
        {greeting.microcopy}
      </p>
    </div>
  );
}
