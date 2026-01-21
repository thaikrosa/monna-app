import { Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import logoMonna from '@/assets/logo-monna.png';

export default function About() {
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
            <span className="font-medium text-foreground">Sobre a Monna</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-background rounded-lg border border-border/50 p-6 sm:p-8 space-y-8">
          {/* Mission */}
          <section>
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Nossa missão
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Devolver tempo e leveza para mães brasileiras, cuidando da logística invisível que ninguém vê — mas que pesa todos os dias.
            </p>
          </section>

          {/* Problem */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              O problema que resolvemos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              90% das mães brasileiras relatam sobrecarga. Não é desorganização. É carga mental materna: a responsabilidade invisível de lembrar, organizar e coordenar absolutamente tudo da família.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Apps de produtividade não resolvem — eles aumentam a carga. São mais uma coisa para gerenciar, mais uma senha para lembrar, mais um lugar para atualizar.
            </p>
          </section>

          {/* Solution */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Nossa solução
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A Monna é uma assistente de inteligência artificial que vive onde você já está: no WhatsApp.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Você conversa naturalmente. Ela entende, organiza, lembra e antecipa. Sem apps para baixar. Sem curva de aprendizado. Sem mais uma coisa na sua lista.
            </p>
          </section>

          {/* History */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Nossa história
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              A Monna nasceu da experiência real de maternidade. Não em um laboratório de tecnologia, mas na rotina de quem vive o problema todos os dias.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Em 2025, nossa fundadora — mãe, designer e desenvolvedora — decidiu criar a ferramenta que ela mesma precisava. Depois de meses testando com outras mães, a Monna provou que funciona: 100% de retenção entre as testadoras e 2.74 interações por dia em média.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3 font-medium">
              Não é um app de produtividade. É uma parceira que entende.
            </p>
          </section>

          {/* Principles */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Nossos princípios
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <h3 className="font-medium text-foreground mb-2">Tecnologia invisível</h3>
                <p className="text-sm text-muted-foreground">
                  A melhor tecnologia é a que você nem percebe que está usando. A Monna trabalha nos bastidores para que você não precise trabalhar para ela.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <h3 className="font-medium text-foreground mb-2">Sem julgamento</h3>
                <p className="text-sm text-muted-foreground">
                  Esqueceu a consulta? Atrasou a vacina? A Monna não julga. Ela ajuda a resolver.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <h3 className="font-medium text-foreground mb-2">Privacidade primeiro</h3>
                <p className="text-sm text-muted-foreground">
                  Seus dados são seus. Usamos criptografia, não vendemos informações, e você pode apagar tudo quando quiser.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <h3 className="font-medium text-foreground mb-2">Feita no Brasil, para o Brasil</h3>
                <p className="text-sm text-muted-foreground">
                  Entendemos o calendário escolar brasileiro, a rede de apoio típica das famílias daqui, e o jeito brasileiro de se comunicar.
                </p>
              </div>
            </div>
          </section>

          {/* Annia Labs */}
          <section className="pt-6 border-t border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Annia Labs
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              A Monna é o primeiro produto da Annia Labs, empresa brasileira de tecnologia focada em automação inteligente para o dia a dia.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nossa visão é criar assistentes de IA que realmente ajudam — não apenas respondem, mas executam, antecipam e cuidam.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-border/50 text-center">
            <p className="text-muted-foreground mb-2">Contato</p>
            <a
              href="mailto:contato@monna.ia.br"
              className="text-primary hover:underline"
            >
              contato@monna.ia.br
            </a>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Annia Labs • CNPJ: 64.377.255/0001-50</p>
              <p>Ribeirão Preto, São Paulo, Brasil</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground italic">
              Monna — Tecnologia com cuidado.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
