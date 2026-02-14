import { FileText, ShieldCheck, CaretRight } from '@phosphor-icons/react';

export function AboutSection() {
  return (
    <section>
      <h2 className="text-base font-medium text-foreground mb-1">
        Sobre a Monna
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Informações legais e institucionais
      </p>

      <div className="annia-glass p-4 rounded-lg border border-border/30 space-y-3">
        <a
          href="/static/termos.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between group min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <FileText weight="thin" className="h-5 w-5 text-primary" />
            <span className="text-foreground text-sm font-medium">Termos de Uso</span>
          </div>
          <CaretRight
            weight="thin"
            className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-150"
          />
        </a>

        <div className="border-t border-border/20" />

        <a
          href="/static/privacidade.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between group min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck weight="thin" className="h-5 w-5 text-primary" />
            <span className="text-foreground text-sm font-medium">Política de Privacidade</span>
          </div>
          <CaretRight
            weight="thin"
            className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-150"
          />
        </a>
      </div>
    </section>
  );
}
