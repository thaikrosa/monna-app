import { useState } from 'react';
import { ShoppingCart, CaretRight, CalendarPlus, ShareNetwork } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ShoppingData } from '@/types/home-dashboard';
import { useNavigate } from 'react-router-dom';
import { ShareListSheet } from './ShareListSheet';

interface ShoppingCardProps {
  shopping: ShoppingData;
}

export function ShoppingCard({ shopping }: ShoppingCardProps) {
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Only show if more than 10 items
  if (shopping.total_items <= 10) return null;

  return (
    <>
      <div className="bg-card border border-border/60 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart weight="regular" className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-card-foreground">Lista de compras</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Você já passou de {shopping.total_items} itens. Que tal agendar uma ida ao mercado?
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate('/lista')}
            className="bg-annia-olive hover:bg-annia-olive-hover text-primary-foreground transition-colors duration-200"
          >
            Ver lista
            <CaretRight weight="regular" className="w-4 h-4 ml-1" />
          </Button>
          
          <Button 
            variant="outline"
            className="transition-colors duration-200"
          >
            <CalendarPlus weight="regular" className="w-4 h-4 mr-1" />
            Agendar compra
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => setIsShareOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ShareNetwork weight="regular" className="w-4 h-4 mr-1" />
            Compartilhar
          </Button>
        </div>
      </div>
      
      <ShareListSheet open={isShareOpen} onOpenChange={setIsShareOpen} />
    </>
  );
}
