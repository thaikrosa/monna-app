import { Headset, Heart, ShieldCheck, WhatsappLogo, XCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function FinalCTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="cta-final"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 px-4 sm:px-6 bg-foreground relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/40 to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Title */}
        <h2
          className={cn(
            "text-4xl sm:text-5xl font-light tracking-tight text-card leading-tight mb-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Uma coisa de cada vez.
          <span className="block text-secondary mt-1">As outras, a Monna segura.</span>
        </h2>

        {/* Subtitle */}
        <p
          className={cn(
            "text-lg text-card/70 mb-10 leading-relaxed transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '100ms' }}
        >
          7 dias grátis para sentir a diferença.<br />Sem cartão, sem compromisso.
        </p>

        {/* CTA Button */}
        <div
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '200ms' }}
        >
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="gap-3 h-14 px-8 text-base text-primary hover:bg-card"
          >
            <a
              href="https://wa.me/5516999999999?text=Oi%20Monna!%20Quero%20testar%20grátis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappLogo weight="regular" className="h-5 w-5" />
              Começar meu teste grátis
            </a>
          </Button>
        </div>

        {/* Note */}
        <p
          className={cn(
            "flex items-center justify-center gap-2 mt-6 text-card/60 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '300ms' }}
        >
          <Heart weight="regular" className="h-4 w-4 text-secondary" />
          Você merece esse alívio.
        </p>

        {/* Badges */}
        <div
          className={cn(
            "flex flex-wrap justify-center gap-6 mt-10 text-sm text-card/50 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '400ms' }}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck weight="regular" className="h-4 w-4" />
            Dados criptografados
          </span>
          <span className="flex items-center gap-1.5">
            <Headset weight="regular" className="h-4 w-4" />
            Suporte humanizado
          </span>
          <span className="flex items-center gap-1.5">
            <XCircle weight="regular" className="h-4 w-4" />
            Cancele quando quiser
          </span>
        </div>
      </div>
    </section>
  );
}
