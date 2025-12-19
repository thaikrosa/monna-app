import { GoogleLogo, CalendarBlank } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ConnectCalendarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectCalendarSheet({ open, onOpenChange }: ConnectCalendarSheetProps) {
  const handleConnect = () => {
    // Placeholder - OAuth integration will be added later
    console.log('Google Calendar OAuth flow would start here');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarBlank weight="regular" className="w-6 h-6 text-primary" />
            </div>
            <SheetTitle>Conectar Google Calendar</SheetTitle>
          </div>
          <SheetDescription>
            Eu preciso acessar sua agenda para encontrar os melhores horários para você descansar e organizar seus compromissos.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Eu vejo apenas os horários ocupados</p>
            <p>• Eu nunca modifico seus eventos existentes</p>
            <p>• Você pode desconectar a qualquer momento</p>
          </div>
          
          <Button 
            onClick={handleConnect}
            className="w-full bg-annia-olive hover:bg-annia-olive-hover text-primary-foreground transition-colors duration-200"
          >
            <GoogleLogo weight="regular" className="w-5 h-5 mr-2" />
            Continuar com Google
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground"
          >
            Agora não
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
