import { Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import logoMonna from '@/assets/logo-monna.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Sobre o produto',
    questions: [
      {
        q: 'O que é a Monna?',
        a: 'A Monna é uma assistente de inteligência artificial via WhatsApp que ajuda mães a organizarem a rotina familiar. Ela gerencia agenda, listas de compras, lembretes e guarda informações importantes sobre a família.',
      },
      {
        q: 'Como a Monna funciona?',
        a: 'Você adiciona a Monna no WhatsApp e conversa naturalmente, como faria com uma amiga. Diga coisas como "me lembra da consulta do Pedro amanhã às 15h" ou "adiciona leite na lista do mercado". A Monna entende, organiza e lembra você no momento certo.',
      },
      {
        q: 'Preciso baixar algum aplicativo?',
        a: 'Não! A Monna funciona direto no WhatsApp, que você já tem. Também oferecemos um painel web (monna.ia.br) para visualizar sua agenda e listas, mas o WhatsApp é suficiente para usar todas as funcionalidades.',
      },
      {
        q: 'A Monna substitui minha agenda atual?',
        a: 'Não, ela complementa. A Monna sincroniza com Google Calendar e iCloud, então seus compromissos ficam em um só lugar. Você pode continuar usando sua agenda normalmente.',
      },
    ],
  },
  {
    title: 'Primeiros passos',
    questions: [
      {
        q: 'Como começo a usar?',
        a: '1. Clique em "Testar grátis" no site\n2. Você será direcionado para o WhatsApp\n3. Envie um "Oi" para a Monna\n4. Ela vai te guiar pelo processo de configuração\n5. Pronto! Comece a usar',
      },
      {
        q: 'Quanto tempo leva para configurar?',
        a: 'Menos de 5 minutos. A Monna faz algumas perguntas sobre sua rotina e preferências, e já está pronta para ajudar.',
      },
      {
        q: 'Preciso ser "boa de tecnologia"?',
        a: 'Não! Se você sabe mandar mensagem no WhatsApp, sabe usar a Monna. Não há comandos complicados, menus confusos ou configurações técnicas.',
      },
    ],
  },
  {
    title: 'Funcionalidades',
    questions: [
      {
        q: 'O que posso pedir para a Monna fazer?',
        a: '• Agenda: Criar, editar e lembrar de compromissos\n• Listas: Mercado, farmácia, material escolar, etc.\n• Lembretes: Pontuais ou recorrentes\n• Memórias: Guardar informações importantes (alergias, preferências, datas)\n• Check-ins: Receber resumo do dia e suporte quando precisar',
      },
      {
        q: 'A Monna entende áudio?',
        a: 'Sim! Você pode enviar mensagens de voz e ela transcreve e entende normalmente.',
      },
      {
        q: 'Posso usar a Monna para mais de um filho?',
        a: 'Sim! A Monna organiza informações de toda a família. Você pode ter agendas separadas por pessoa e listas compartilhadas.',
      },
      {
        q: 'A Monna manda mensagem sozinha ou só quando eu peço?',
        a: 'Ela faz as duas coisas. Você pode configurar:\n• Check-in da manhã: Resumo do que tem no dia\n• Lembretes proativos: Ela avisa antes dos compromissos\n• Modo silencioso: Ela só fala quando você fala',
      },
    ],
  },
  {
    title: 'Planos e pagamento',
    questions: [
      {
        q: 'Quanto custa?',
        a: 'Oferecemos 7 dias grátis para você testar. Depois:\n• Plano Essencial: R$ 29,90/mês no plano anual',
      },
      {
        q: 'Preciso colocar cartão de crédito para testar?',
        a: 'Sim, porém você pode cancelar a compra antes de finalizar os 7 dias.',
      },
      {
        q: 'Como cancelo?',
        a: 'A qualquer momento, sem burocracia. Basta enviar um e-mail para contato@monna.ia.br pedindo o cancelamento.',
      },
      {
        q: 'Vocês oferecem reembolso?',
        a: 'Sim. Se você não estiver satisfeita nos primeiros 7 dias após o pagamento, devolvemos 100% do valor.',
      },
    ],
  },
  {
    title: 'Privacidade e segurança',
    questions: [
      {
        q: 'Meus dados estão seguros?',
        a: 'Sim. Usamos criptografia em todas as comunicações e armazenamento. Seus dados ficam em servidores seguros e nunca são vendidos para terceiros.',
      },
      {
        q: 'Vocês leem minhas mensagens?',
        a: 'A Monna processa suas mensagens para entender e responder, mas humanos não têm acesso ao conteúdo das suas conversas. Tudo é automatizado.',
      },
      {
        q: 'Posso apagar meus dados?',
        a: 'Sim, a qualquer momento. Você pode pedir para a Monna apagar todas as suas informações, e faremos isso em até 48 horas. É seu direito pela LGPD.',
      },
      {
        q: 'Vocês usam meus dados para treinar a IA?',
        a: 'Não. Suas mensagens e informações pessoais não são usadas para treinar modelos de IA. Usamos apenas dados agregados e anonimizados para melhorar o produto.',
      },
    ],
  },
  {
    title: 'Problemas técnicos',
    questions: [
      {
        q: 'A Monna não está respondendo. O que faço?',
        a: '1. Verifique sua conexão com a internet\n2. Tente enviar "oi" novamente\n3. Se persistir, envie email para contato@monna.ia.br',
      },
      {
        q: 'Posso usar a Monna fora do Brasil?',
        a: 'Sim! Desde que você tenha WhatsApp e internet, a Monna funciona em qualquer lugar do mundo. Os lembretes respeitam seu fuso horário.',
      },
      {
        q: 'A Monna funciona no WhatsApp Business?',
        a: 'Sim, funciona tanto no WhatsApp normal quanto no WhatsApp Business.',
      },
    ],
  },
  {
    title: 'Contato',
    questions: [
      {
        q: 'Como falo com um humano?',
        a: 'Email: contato@monna.ia.br\nResposta: Em até 24 horas úteis',
      },
      {
        q: 'Tenho uma sugestão de funcionalidade. Como envio?',
        a: 'Adoramos feedback! Diga "tenho uma sugestão" para a Monna ou envie email para contato@monna.ia.br.',
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <CaretLeft weight="light" className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src={logoMonna} alt="Monna" className="h-6 w-6" />
            <span className="font-medium text-foreground">Perguntas Frequentes</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-background rounded-lg border border-border/50 p-6 sm:p-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8 last:mb-0">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, questionIndex) => (
                  <AccordionItem
                    key={questionIndex}
                    value={`${categoryIndex}-${questionIndex}`}
                    className="border-border/50"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* Footer info */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>Não encontrou sua pergunta?</p>
            <a
              href="mailto:contato@monna.ia.br"
              className="text-primary hover:underline"
            >
              contato@monna.ia.br
            </a>
            <div className="mt-4 text-xs">
              <p>Annia Labs • CNPJ: 64.377.255/0001-50</p>
              <p>Ribeirão Preto, SP</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
