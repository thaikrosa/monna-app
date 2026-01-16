import { Copy, WhatsappLogo, ShareNetwork } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

interface ShareListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareListSheet({ open, onOpenChange }: ShareListSheetProps) {
  const handleCopyLink = () => {
    // Placeholder - generate shareable link
    navigator.clipboard.writeText('https://monna.app/lista/compartilhada/abc123');
    toast.success('Link copiado!');
    onOpenChange(false);
  };

  const handleWhatsApp = () => {
    // Placeholder - open WhatsApp with list
    const text = encodeURIComponent('Confira minha lista de compras: https://monna.app/lista/compartilhada/abc123');
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShareNetwork weight="regular" className="w-6 h-6 text-primary" />
            </div>
            <SheetTitle>Compartilhar lista</SheetTitle>
          </div>
          <SheetDescription>
            Eu gero um link seguro para você compartilhar sua lista de compras.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-3">
          <Button 
            onClick={handleCopyLink}
            variant="outline"
            className="w-full transition-colors duration-200"
          >
            <Copy weight="regular" className="w-5 h-5 mr-2" />
            Copiar link
          </Button>
          
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
          >
            <WhatsappLogo weight="regular" className="w-5 h-5 mr-2" />
            Enviar por WhatsApp
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground"
          >
            Cancelar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
