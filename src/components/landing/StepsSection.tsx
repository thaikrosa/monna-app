import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "1",
    title: "Conecte",
    description: "Adicione a Monna no WhatsApp, se apresente e inicie seu teste grátis",
  },
  {
    number: "2",
    title: "Converse",
    description: "Mande suas listas, compromissos e informações da família",
  },
  {
    number: "3",
    title: "Relaxe",
    description: "A Monna organiza tudo e lembra no momento certo",
  },
];

export function StepsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-20 px-4 sm:px-6 bg-card">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Como funciona</span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Simples como mandar uma mensagem
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "p-6 sm:p-8 bg-secondary rounded-lg transition-all duration-200 hover:-translate-y-1",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="text-7xl font-extralight text-primary/30 leading-none mb-3">{step.number}</div>
              <h3 className="text-lg font-medium text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
