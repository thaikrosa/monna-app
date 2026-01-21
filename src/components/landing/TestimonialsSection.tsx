import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: 'Eu me impressionei muito com a Monna. Gosto muito da facilidade do áudio. Isso é vida!',
    author: 'Viridiane',
    role: 'engenheira e mãe',
  },
  {
    quote: 'Eu e meu marido usamos vários métodos para lembrarmos dos eventos, mas a Monna converge tudo num grupo só.',
    author: 'Priscila',
    role: 'fisioterapeuta e mãe',
  },
  {
    quote: 'Eu estou gostando muito. Achei bem prático e fácil. A gente visualiza muito mais no WhatsApp.',
    author: 'Gabriela',
    role: 'mentora de mães e mãe',
  },
  {
    quote: 'Gostei do jeito que ela manda mensagem, do checklist no fim do dia e no início da manhã.',
    author: 'Giselly',
    role: 'empresária e mãe',
  },
  {
    quote: 'Achei ela maravilhosa!',
    author: 'Vanessa',
    role: 'empresária',
  },
  {
    quote: 'A Monna já é minha best!',
    author: 'Priscila',
    role: 'mãe',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      </div>
    </section>
  );
}
