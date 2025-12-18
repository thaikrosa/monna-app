import { CalendarBlank, ArrowRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface KickstartStep3Props {
  onComplete: () => void;
  onConnectCalendar: () => void;
}

export function KickstartStep3({ onComplete, onConnectCalendar }: KickstartStep3Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      {/* Title */}
      <h1 className="text-xl font-semibold text-foreground mb-2">
        Quer que eu veja sua<br />agenda também?
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
        Assim posso encontrar janelas de respiro automaticamente.
      </p>

      {/* Calendar button */}
      <Button 
        variant="outline"
        onClick={onConnectCalendar}
        className="w-full max-w-xs h-14 border-border/50 hover:bg-accent/10"
      >
        <CalendarBlank size={24} weight="regular" className="mr-3" />
        Conectar Google Calendar
      </Button>

      {/* Spacer */}
      <div className="flex-1 min-h-[80px]" />

      {/* CTA Button */}
      <div className="w-full pb-8">
        <Button 
          onClick={onComplete}
          className="kickstart-cta bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Começar a usar
          <ArrowRight size={20} weight="bold" className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
