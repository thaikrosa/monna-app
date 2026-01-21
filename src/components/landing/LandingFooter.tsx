import { Link } from "react-router-dom";
import logoMonna from "@/assets/logo-monna.png";

const footerLinks = {
  produto: [
    { label: "Como funciona", href: "#solution" },
    { label: "Funcionalidades", href: "#features" },
    { label: "Entrar", href: "/auth", isRoute: true },
  ],
  empresa: [
    { label: "Sobre", href: "/sobre", isRoute: true },
    { label: "FAQ", href: "/faq", isRoute: true },
    { label: "Contato", href: "/contato", isRoute: true },
  ],
  legal: [
    { label: "Termos de uso", href: "/termos", isRoute: true },
    { label: "Privacidade", href: "/privacidade", isRoute: true },
    { label: "Cookies", href: "/cookies", isRoute: true },
  ],
  contato: [
    { label: "contato@monna.ia.br", href: "mailto:contato@monna.ia.br" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="py-16 px-4 sm:px-6 bg-foreground border-t border-card/10">
      <div className="max-w-5xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 max-w-[200px]">
            <p className="text-sm text-card/60 leading-relaxed">
              A assistente de IA que cuida da logística invisível da maternidade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-medium text-card mb-4 tracking-wide">Produto</h4>
            <ul className="space-y-2">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link to={link.href} className="text-sm text-card/50 hover:text-card transition-colors duration-150">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm text-card/50 hover:text-card transition-colors duration-150">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-card mb-4 tracking-wide">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-card/50 hover:text-card transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-card mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-card/50 hover:text-card transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-card mb-4 tracking-wide">Contato</h4>
            <ul className="space-y-2">
              {footerLinks.contato.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-card/50 hover:text-card transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-card/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-card/40">
          <p>© 2026 Annia Labs</p>
          <p>Feito para mães brasileiras</p>
        </div>
      </div>
    </footer>
  );
}
