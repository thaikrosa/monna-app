import { Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import logoMonna from '@/assets/logo-monna.png';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Cookies() {
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
            <span className="font-medium text-foreground">Política de Cookies</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-background rounded-lg border border-border/50 p-6 sm:p-8 space-y-8">
          <p className="text-sm text-muted-foreground">
            Última atualização: Janeiro de 2026
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              1. O que são cookies?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) quando você visita um site. Eles permitem que o site reconheça seu dispositivo e lembre de informações sobre sua visita, como suas preferências e configurações.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Como a Monna usa cookies?
            </h2>

            {/* Essential */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">
                2.1 Cookies Essenciais
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Indispensáveis para o funcionamento do site e do aplicativo.
              </p>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cookie</TableHead>
                      <TableHead>Finalidade</TableHead>
                      <TableHead>Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-sm">session_id</TableCell>
                      <TableCell>Manter sua sessão de login ativa</TableCell>
                      <TableCell>Sessão</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">auth_token</TableCell>
                      <TableCell>Autenticação segura no web app</TableCell>
                      <TableCell>7 dias</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">csrf_token</TableCell>
                      <TableCell>Proteção contra ataques</TableCell>
                      <TableCell>Sessão</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Base legal: Execução de contrato e legítimo interesse.
              </p>
            </div>

            {/* Analytics */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">
                2.2 Cookies de Análise
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Nos ajudam a entender como você usa o site para melhorarmos a experiência. Os dados são coletados de forma anônima.
              </p>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cookie</TableHead>
                      <TableHead>Finalidade</TableHead>
                      <TableHead>Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-sm">_ga</TableCell>
                      <TableCell>Análise de uso - identificação</TableCell>
                      <TableCell>2 anos</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">_gid</TableCell>
                      <TableCell>Análise de uso - sessão</TableCell>
                      <TableCell>24 horas</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Base legal: Consentimento. Você pode recusar esses cookies sem prejuízo ao uso do serviço.
              </p>
            </div>

            {/* Functionality */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                2.3 Cookies de Funcionalidade
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Lembram suas escolhas para personalizar a experiência.
              </p>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cookie</TableHead>
                      <TableHead>Finalidade</TableHead>
                      <TableHead>Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-sm">preferences</TableCell>
                      <TableCell>Preferências de exibição</TableCell>
                      <TableCell>1 ano</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-sm">timezone</TableCell>
                      <TableCell>Fuso horário para lembretes</TableCell>
                      <TableCell>1 ano</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Base legal: Execução de contrato.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              3. Serviços de terceiros
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Para fornecer nosso serviço, utilizamos parceiros nas seguintes categorias:
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Finalidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Provedores de infraestrutura em nuvem</TableCell>
                    <TableCell>Armazenamento seguro de dados</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Serviços de análise</TableCell>
                    <TableCell>Entender o uso do site (anonimizado)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Plataformas de comunicação</TableCell>
                    <TableCell>Envio de mensagens via WhatsApp</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Provedores de inteligência artificial</TableCell>
                    <TableCell>Processamento de linguagem natural</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Esses parceiros podem utilizar cookies próprios conforme suas políticas de privacidade.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. Como gerenciar seus cookies
            </h2>
            <h3 className="text-lg font-medium text-foreground mb-2">Pelo navegador</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Você pode configurar seu navegador para bloquear ou alertar sobre cookies:
            </p>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside mb-4">
              <li><strong>Chrome:</strong> Configurações {'>'} Privacidade e segurança {'>'} Cookies</li>
              <li><strong>Firefox:</strong> Opções {'>'} Privacidade e Segurança {'>'} Cookies</li>
              <li><strong>Safari:</strong> Preferências {'>'} Privacidade {'>'} Cookies</li>
              <li><strong>Edge:</strong> Configurações {'>'} Privacidade {'>'} Cookies</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mb-2">Impacto da desativação</h3>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Cookies essenciais:</strong> O site/app pode não funcionar corretamente</li>
              <li><strong>Cookies de análise:</strong> Nenhum impacto no funcionamento</li>
              <li><strong>Cookies de funcionalidade:</strong> Preferências não serão lembradas</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. Atualizações
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas por email ou aviso no site.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. Contato
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Dúvidas sobre cookies ou privacidade:
            </p>
            <a
              href="mailto:contato@monna.ia.br"
              className="text-primary hover:underline"
            >
              contato@monna.ia.br
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Encarregada de Dados (DPO): Thaís Bueno Rosa
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              7. Base legal (LGPD)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018):
            </p>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Art. 7º, I: Consentimento (cookies não essenciais)</li>
              <li>Art. 7º, V: Execução de contrato (cookies essenciais)</li>
              <li>Art. 7º, IX: Legítimo interesse (segurança)</li>
            </ul>
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>Annia Labs • CNPJ: 64.377.255/0001-50</p>
            <p>Ribeirão Preto, São Paulo, Brasil</p>
            <p className="mt-3">
              Este documento complementa nossa{' '}
              <Link to="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>{' '}
              e{' '}
              <Link to="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
