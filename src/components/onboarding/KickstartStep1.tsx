import { Leaf, ArrowRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface KickstartStep1Props {
  nickname: string;
  onNext: () => void;
}

export function KickstartStep1({ nickname, onNext }: KickstartStep1Props) {
  const displayName = nickname || 'você';

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      {/* Icon */}
      <div className="mb-8">
        <Leaf size={48} weight="light" className="text-primary" />
      </div>

      {/* Title */}
      <h1 className="text-[28px] font-semibold text-foreground mb-4">
        Olá, {displayName}.
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-muted-foreground leading-relaxed max-w-xs">
        Vamos preparar sua<br />segunda mente?
      </p>

      {/* Spacer */}
      <div className="flex-1 min-h-[80px]" />

      {/* CTA Button */}
      <div className="w-full pb-8">
        <Button 
          onClick={onNext}
          className="kickstart-cta bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Vamos lá
          <ArrowRight size={20} weight="bold" className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
