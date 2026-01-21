import { Brain, CalendarCheck, ShoppingCart, SunHorizon } from '@phosphor-icons/react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
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
];

export function FeaturesSection() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </section>
  );
}
