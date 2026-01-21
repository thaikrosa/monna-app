import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'Funciona com a agenda que eu já uso?',
    answer: 'Sim! Monna sincroniza com Google Calendar, iCloud e outras. Você não precisa mudar nada da sua rotina.',
  },
  {
    question: 'Meus dados ficam seguros?',
    answer: 'Seus dados são criptografados e nunca compartilhados. Sua família, suas informações, seu controle total.',
  },
  {
    question: 'Preciso ser boa de tecnologia?',
    answer: 'Se você sabe mandar mensagem no WhatsApp, sabe usar a Monna. Zero configuração complicada.',
  },
  {
    question: 'Vai me mandar notificação demais?',
    answer: 'Não. A Monna só fala quando tem algo útil. Silêncio também é cuidado.',
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim, a qualquer momento, sem burocracia. Mas apostamos que você não vai querer.',
  },
];

export function FAQSection() {
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
            Dúvidas
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Perguntas frequentes
          </h2>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={cn(
                "bg-card rounded-lg border-transparent data-[state=open]:border-primary px-6 transition-all duration-200 hover:border-primary/30",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 1) * 80}ms` }}
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
