import { ChatCircle, HandHeart, Sparkle } from '@phosphor-icons/react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const solutions = [
  {
    icon: ChatCircle,
    title: 'Onde você já está',
    description: 'WhatsApp, não mais um app para baixar',
  },
  {
    icon: HandHeart,
    title: 'Você fala, ela faz',
    description: 'Linguagem natural, não comandos complicados',
  },
  {
    icon: Sparkle,
    title: 'Ela antecipa',
    description: 'Não espera você pedir, avisa antes',
  },
];

export function SolutionSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 px-4 sm:px-6 bg-secondary"
    >
      <div className="max-w-4xl mx-auto">
        {/* Intro */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground mb-2">
            Monna não é mais um app.
          </h2>
          <p className="text-xl sm:text-2xl font-normal text-primary mb-4">
            É como ter uma assistente no seu WhatsApp.
          </p>
          <p className="text-lg text-muted-foreground">
            Você conversa naturalmente. Ela entende, organiza e antecipa.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className={cn(
                "group p-6 sm:p-8 bg-card rounded-lg border border-transparent hover:border-primary hover:shadow-elevated text-center transition-all duration-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="w-14 h-14 bg-secondary group-hover:bg-primary rounded-md flex items-center justify-center mx-auto mb-5 transition-colors duration-200">
                <solution.icon
                  weight="regular"
                  className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-200"
                />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">{solution.title}</h3>
              <p className="text-sm text-muted-foreground">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
