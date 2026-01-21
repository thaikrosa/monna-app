import { Check } from '@phosphor-icons/react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const identifications = [
  'Você lembra do que todo mundo precisa — e ninguém lembra do que você precisa',
  'Tem mil abas mentais abertas: escola, médico, mercado, mensagens...',
  'Já baixou apps de organização e desistiu porque dava mais trabalho',
  'Sente que está sempre correndo atrás e nunca alcança',
  'Quer alguém que ajude de verdade, não mais uma coisa pra gerenciar',
];

export function IdentificationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 px-4 sm:px-6 bg-secondary"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
            Para você que...
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Reconhece essa rotina?
          </h2>
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-3">
          {identifications.map((text, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4 p-4 sm:p-5 bg-card rounded-lg border border-transparent hover:border-primary hover:shadow-elevated transition-all duration-200 cursor-default",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-6 h-6 border-2 border-primary rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check weight="regular" className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <p
          className={cn(
            "text-center mt-10 text-lg text-muted-foreground transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '600ms' }}
        >
          Se marcou pelo menos duas, <strong className="text-primary font-medium">a Monna foi feita para você</strong>.
        </p>
      </div>
    </section>
  );
}
