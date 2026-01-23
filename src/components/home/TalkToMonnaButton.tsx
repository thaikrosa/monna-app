import { WhatsappLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const WHATSAPP_URL = 'https://wa.me/5516996036137';

export function TalkToMonnaButton() {
  return (
    <div className="py-4">
      <Button
        variant="outline"
        className="w-full h-12 border-border bg-card hover:bg-muted text-foreground font-normal transition-colors duration-150"
        onClick={() => window.open(WHATSAPP_URL, '_blank')}
      >
        <WhatsappLogo weight="regular" className="h-5 w-5 mr-2 text-primary" />
        Falar com a Monna
      </Button>
    </div>
  );
}
