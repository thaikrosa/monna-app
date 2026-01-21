import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const metrics = [
  { value: '100%', label: 'retenção nos testes' },
  { value: '2.74', label: 'interações por dia' },
  { value: '+100', label: 'mães na lista de espera' },
];

export function MetricsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 px-4 sm:px-6 bg-card"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 sm:gap-20">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "text-center transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="text-4xl sm:text-5xl font-light text-primary tracking-tight">
              {metric.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
