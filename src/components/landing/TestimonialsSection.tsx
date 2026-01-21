import { useEffect, useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

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
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Sync indicator with current slide
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  // Autoplay every 5 seconds
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

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

        {/* Carousel */}
        <div
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '100ms' }}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-6 sm:p-8 bg-primary-foreground/10 border border-primary-foreground/10 rounded-lg h-full flex flex-col">
                    <p className="text-primary-foreground italic leading-relaxed mb-6 flex-1">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="text-primary-foreground font-medium text-sm">{testimonial.author}</p>
                      <p className="text-primary-foreground/60 text-xs mt-0.5">{testimonial.role}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  current === index 
                    ? "bg-primary-foreground w-6" 
                    : "bg-primary-foreground/30 w-2"
                )}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Highlight */}
        <div
          className={cn(
            "text-center mt-10 pt-10 border-t border-primary-foreground/10 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-xl sm:text-2xl text-primary-foreground italic font-light">
            "A Monna já é minha best!"
          </p>
          <p className="text-primary-foreground/60 text-sm mt-2">
            — Mãe testadora beta
          </p>
        </div>
      </div>
    </section>
  );
}
