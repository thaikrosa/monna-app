import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: 'Finalmente alguém que entende que eu não preciso de mais produtividade. Preciso de alívio.',
    author: 'Carolina',
    role: 'mãe de 3',
  },
  {
    quote: 'Testei por 7 dias e não quero mais viver sem. É como ter uma amiga que lembra de tudo.',
    author: 'Fernanda',
    role: 'mãe e empreendedora',
  },
  {
    quote: 'O dia acabou, a casa tá de pé, e eu também. Vitória.',
    author: 'Beatriz',
    role: 'mãe de gêmeos',
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 px-4 sm:px-6 bg-primary relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-card/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-3 block">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-primary-foreground">
            O que as mães estão dizendo
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                "p-6 sm:p-8 bg-primary-foreground/10 border border-primary-foreground/10 rounded-lg hover:bg-primary-foreground/15 transition-all duration-200 hover:-translate-y-1",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <p className="text-primary-foreground italic leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <p className="text-primary-foreground font-medium text-sm">{testimonial.author}</p>
              <p className="text-primary-foreground/60 text-xs mt-0.5">{testimonial.role}</p>
            </div>
          ))}
        </div>

        {/* Highlight */}
        <div
          className={cn(
            "text-center mt-10 pt-10 border-t border-primary-foreground/10 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '400ms' }}
        >
          <p className="text-lg text-primary-foreground/70 italic">
            <strong className="text-secondary">"A Monna já é minha best."</strong> — Mãe testadora beta
          </p>
        </div>
      </div>
    </section>
  );
}
