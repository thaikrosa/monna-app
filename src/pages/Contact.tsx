import { Link } from 'react-router-dom';
import { CaretLeft, Envelope, ChatCircle, Handshake, ShieldCheck } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import logoMonna from '@/assets/logo-monna.png';

const channels = [
  {
    icon: Envelope,
    title: 'Suporte e dúvidas gerais',
    description: 'Para dúvidas sobre uso do produto, problemas técnicos ou ajuda geral.',
    email: 'contato@monna.ia.br',
    response: 'Em até 24 horas úteis',
  },
  {
    icon: ShieldCheck,
    title: 'Privacidade e dados pessoais',
    description: 'Para exercer seus direitos previstos na LGPD (acesso, correção, exclusão de dados) ou dúvidas sobre tratamento de informações.',
    email: 'contato@monna.ia.br',
    subject: 'Privacidade - [sua solicitação]',
    response: 'Em até 5 dias úteis',
    extra: 'Encarregada de Dados (DPO): Thaís Bueno Rosa',
  },
  {
    icon: ChatCircle,
    title: 'Feedback e sugestões',
    description: 'Sua opinião nos ajuda a melhorar. Adoramos ouvir o que funciona e o que pode ser melhor.',
    email: 'contato@monna.ia.br',
  },
  {
    icon: Handshake,
    title: 'Comercial e parcerias',
    description: 'Para propostas de parceria, integrações B2B ou oportunidades comerciais.',
    email: 'contato@monna.ia.br',
    subject: 'Comercial - [sua proposta]',
  },
];

export default function Contact() {
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
            <span className="font-medium text-foreground">Contato</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-background rounded-lg border border-border/50 p-6 sm:p-8">
          {/* Intro */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Fale conosco
            </h1>
            <p className="text-muted-foreground">
              Estamos aqui para ajudar. Escolha o canal mais adequado para sua necessidade.
            </p>
          </div>

          {/* Channels */}
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((channel, index) => (
              <div
                key={index}
                className="p-5 rounded-lg bg-secondary/50 border border-border/30 hover:border-border/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <channel.icon weight="light" className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1">
                      {channel.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {channel.description}
                    </p>
                    <div className="space-y-1 text-sm">
                      <a
                        href={`mailto:${channel.email}${channel.subject ? `?subject=${encodeURIComponent(channel.subject)}` : ''}`}
                        className="text-primary hover:underline block"
                      >
                        {channel.email}
                      </a>
                      {channel.subject && (
                        <p className="text-muted-foreground text-xs">
                          Assunto: {channel.subject}
                        </p>
                      )}
                      {channel.response && (
                        <p className="text-muted-foreground text-xs">
                          Resposta: {channel.response}
                        </p>
                      )}
                      {channel.extra && (
                        <p className="text-muted-foreground text-xs mt-2">
                          {channel.extra}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company info */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Dados da empresa
            </h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Annia Labs</p>
              <p>CNPJ: 64.377.255/0001-50</p>
              <p>Ribeirão Preto, São Paulo, Brasil</p>
            </div>
          </div>

          {/* Business hours */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Horário de atendimento
            </h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Segunda a sexta:</strong> 9h às 18h (horário de Brasília)</p>
              <p><strong>Sábados, domingos e feriados:</strong> Sem atendimento humano, mas a Monna continua funcionando normalmente.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground italic">
              Monna — Tecnologia com cuidado.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
