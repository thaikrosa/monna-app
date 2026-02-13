import { ChatCircleDots, WhatsappLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function AnniaQuestionsSection() {
  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-3">
        Perguntas especiais da Annia
      </h2>

      <div className="annia-glass p-4 rounded-lg border border-border/30">
        <div className="flex items-start gap-3 mb-4">
          <ChatCircleDots weight="thin" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground">
              Suas respostas nos ajudam a te conhecer melhor e personalizar minha ajuda.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Você ainda não respondeu. Que tal começar?
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <a
            href="https://wa.me/5516996036137?text=Quero%20atualizar%20minhas%20respostas"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo weight="thin" className="h-4 w-4 mr-2" />
            Atualizar respostas via WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
}
