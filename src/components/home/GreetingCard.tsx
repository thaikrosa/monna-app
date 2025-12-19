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
  // Build dynamic title with name if needed
  const title = greeting.title.includes('{nome}') 
    ? greeting.title.replace('{nome}', displayName)
    : greeting.title;

  return (
    <div className="bg-annia-navy text-primary-foreground p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-primary-foreground/90 text-sm mb-4">
        {greeting.insight}
      </p>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={onPrimaryCta}
          className="w-full bg-annia-olive hover:bg-annia-olive-hover text-primary-foreground transition-colors duration-200"
        >
          <CalendarPlus weight="regular" className="w-4 h-4 mr-2" />
          {greeting.primaryCta.label}
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
