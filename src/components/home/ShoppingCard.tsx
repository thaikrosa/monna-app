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
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart weight="regular" className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Lista de compras</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Você já passou de <span className="font-semibold text-primary">{shopping.total_items} itens</span>. Que tal agendar uma ida ao mercado?
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate('/lista')}
            className="bg-primary text-primary-foreground rounded-full px-5 hover:bg-primary/90 transition-colors duration-200"
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
