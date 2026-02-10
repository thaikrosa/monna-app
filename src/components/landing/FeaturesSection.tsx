import { Brain, CalendarCheck, ShoppingCart, SunHorizon, PaperPlaneTilt, Image } from '@phosphor-icons/react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: CalendarCheck,
    title: 'Agenda Inteligente',
    description: '"Consulta do Pedro quarta às 15h" — e pronto. Ela lembra, encaixa na agenda e avisa no dia anterior.',
  },
  {
    icon: ShoppingCart,
    title: 'Listas que Vivem',
    description: 'Mercado, farmácia, material escolar. Você fala, ela adiciona. Nunca mais esquecer o leite.',
  },
  {
    icon: Brain,
    title: 'Segundo Cérebro',
    description: '"Qual a alergia do João?" — Ela sabe. Guarda tudo que importa sobre sua família.',
  },
  {
    icon: SunHorizon,
    title: 'Check-in de Cuidado',
    description: 'Bom dia com o resumo do que vem. Lembrete gentil quando percebe que você precisa.',
  },
  {
    icon: PaperPlaneTilt,
    title: 'Recados pra Família',
    description: '"Avisa minha mãe do remédio do Lucas" — e ela avisa. Você não precisa ligar, mandar mensagem, nem lembrar de lembrar.',
  },
  {
    icon: Image,
    title: 'Entende o que Você Manda',
    description: 'Mandou o convite da festa? A foto da agenda escolar? Ela lê, entende e já cria os lembretes pra você.',
  },
];

interface FeaturesSectionProps {
  onCtaClick?: () => void;
}

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 px-4 sm:px-6 bg-secondary"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            O que a Monna faz por você
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "p-6 sm:p-8 bg-card rounded-lg border border-transparent hover:border-primary hover:shadow-elevated transition-all duration-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mb-5">
                <feature.icon weight="regular" className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          className={cn(
            "text-center mt-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '700ms' }}
        >
          <Button size="lg" className="text-base px-8" onClick={onCtaClick}>
            Começar meu teste grátis
          </Button>
        </div>
      </div>
    </section>
  );
}
