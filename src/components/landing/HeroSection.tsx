import { ArrowRight, CheckCircle, ChatCircle, SealCheck } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhoneMockup } from './PhoneMockup';

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 bg-secondary">

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text Content */}
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md text-xs text-primary mb-8 animate-fade-in">
            <SealCheck weight="regular" className="h-4 w-4" />
            100% das mães que testaram querem continuar
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-tight mb-6 animate-slide-up">
            Sua cabeça tá cheia demais.
            <span className="block text-primary mt-1">Deixa a Monna ajudar.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md animate-slide-up stagger-1">
            A assistente via WhatsApp que organiza sua rotina, antecipa lembretes e guarda o que importa sobre sua família.
          </p>

          {/* CTA */}
          <div className="mb-6 animate-slide-up stagger-2">
            <Button size="lg" className="gap-3 h-12 px-6 text-base" onClick={onCtaClick}>
              Quero testar grátis
              <ArrowRight weight="regular" className="h-4 w-4" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 py-6 animate-slide-up stagger-3">
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
              <CheckCircle size={20} weight="regular" />
              <span className="text-sm font-medium">Sem baixar app</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
              <CheckCircle size={20} weight="regular" />
              <span className="text-sm font-medium">Sem cadastros infinitos</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
              <ChatCircle size={20} weight="regular" />
              <span className="text-sm font-medium">Direto no WhatsApp</span>
            </Badge>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="flex justify-center lg:justify-end animate-fade-in stagger-2">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
