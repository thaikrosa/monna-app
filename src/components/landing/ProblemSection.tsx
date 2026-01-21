import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 px-4 sm:px-6 bg-foreground relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Title */}
        <h2
          className={cn(
            "text-3xl sm:text-4xl font-light tracking-tight text-card text-center mb-10 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          O nome disso é<br />
          <span className="text-secondary">Carga Mental Materna</span>
        </h2>

        {/* Text */}
        <div
          className={cn(
            "text-center space-y-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '150ms' }}
        >
          <p className="text-lg text-card/80 leading-relaxed">
            Não é desorganização. <strong className="text-card">É sobrecarga cognitiva.</strong>
          </p>
          <p className="text-lg text-card/80 leading-relaxed">
            São dezenas de microtarefas mentais por dia que ninguém vê, ninguém agradece, e que se você esquecer uma, a culpa é sua.
          </p>
          <p className="text-lg text-card/80 leading-relaxed">
            Apps de produtividade não resolvem — eles <span className="text-secondary font-medium">aumentam</span> a carga. São mais uma coisa pra lembrar de abrir.
          </p>
        </div>

        {/* Stat */}
        <div
          className={cn(
            "flex justify-center mt-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-card/10 border border-card/15 rounded-lg">
            <span className="text-4xl sm:text-5xl font-light text-card tracking-tight">90%</span>
            <span className="text-sm text-card/70 leading-snug text-left">
              das mães brasileiras<br />relatam sobrecarga
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
