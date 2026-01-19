import { Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header simples */}
      <div className="sticky top-0 z-40 bg-secondary border-b border-border/30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent">
              <CaretLeft weight="thin" className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">
            Termos de Uso
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-background rounded-lg border border-border shadow-elevated p-6">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="text-xs text-muted-foreground mb-6">Última atualização: 19 de janeiro de 2025</p>
            
            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o aplicativo Monna ("Serviço"), você concorda em cumprir e 
                estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte 
                destes termos, não poderá acessar o Serviço.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">2. Descrição do Serviço</h2>
              <p>
                A Monna é um assistente digital de organização familiar que ajuda mães a 
                gerenciar sua rotina, lembretes, compromissos, lista de compras e informações 
                sobre seus filhos. O Serviço inclui:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gerenciamento de lembretes e compromissos</li>
                <li>Lista de compras compartilhável</li>
                <li>Acompanhamento de informações dos filhos</li>
                <li>Rede de contatos de apoio</li>
                <li>Integração com calendários externos</li>
                <li>Notificações via WhatsApp</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">3. Cadastro e Conta</h2>
              <h3 className="text-base font-medium text-foreground mt-4">3.1 Elegibilidade</h3>
              <p>
                Para usar o Serviço, você deve ter pelo menos 18 anos de idade ou ser 
                emancipado legalmente.
              </p>
              
              <h3 className="text-base font-medium text-foreground mt-4">3.2 Informações da Conta</h3>
              <p>
                Você é responsável por manter a confidencialidade de sua conta e senha. 
                Você concorda em aceitar responsabilidade por todas as atividades que 
                ocorram em sua conta.
              </p>
              
              <h3 className="text-base font-medium text-foreground mt-4">3.3 Informações Precisas</h3>
              <p>
                Você concorda em fornecer informações precisas, atuais e completas durante 
                o processo de registro e manter essas informações atualizadas.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">4. Uso Aceitável</h2>
              <p>Você concorda em não usar o Serviço para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violar qualquer lei aplicável</li>
                <li>Transmitir material ilegal, prejudicial ou ofensivo</li>
                <li>Interferir no funcionamento do Serviço</li>
                <li>Tentar acessar contas de outros usuários</li>
                <li>Usar o Serviço para fins comerciais não autorizados</li>
                <li>Copiar, modificar ou distribuir conteúdo do Serviço</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">5. Informações sobre Saúde</h2>
              <p className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-foreground">
                <strong>AVISO IMPORTANTE:</strong> A Monna é uma ferramenta de organização e 
                não substitui aconselhamento médico profissional. Informações sobre saúde 
                armazenadas no aplicativo são apenas para fins de organização. Sempre 
                consulte profissionais de saúde qualificados para questões médicas.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">6. Propriedade Intelectual</h2>
              <p>
                O Serviço e seu conteúdo original, recursos e funcionalidades são e 
                permanecerão propriedade exclusiva da Monna. O Serviço é protegido por 
                direitos autorais, marcas registradas e outras leis.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">7. Conteúdo do Usuário</h2>
              <p>
                Você mantém todos os direitos sobre o conteúdo que criar ou fornecer ao 
                Serviço. Ao fornecer conteúdo, você nos concede uma licença limitada para 
                usar, armazenar e processar esse conteúdo exclusivamente para fornecer o 
                Serviço a você.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">8. Limitação de Responsabilidade</h2>
              <p>
                Em nenhuma circunstância a Monna será responsável por danos indiretos, 
                incidentais, especiais, consequenciais ou punitivos, incluindo perda de 
                lucros, dados, uso ou outras perdas intangíveis.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">9. Isenção de Garantias</h2>
              <p>
                O Serviço é fornecido "como está" e "conforme disponível", sem garantias de 
                qualquer tipo, expressas ou implícitas, incluindo garantias de comercialização, 
                adequação a um propósito específico e não violação.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">10. Rescisão</h2>
              <p>
                Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, por 
                qualquer motivo, incluindo violação destes Termos. Você pode encerrar sua 
                conta a qualquer momento entrando em contato conosco.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">11. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. 
                Notificaremos você sobre alterações significativas. O uso continuado do 
                Serviço após alterações constitui aceitação dos novos Termos.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">12. Lei Aplicável</h2>
              <p>
                Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, 
                sem consideração a conflitos de disposições legais.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">13. Contato</h2>
              <p>Se você tiver dúvidas sobre estes Termos, entre em contato conosco:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>E-mail: contato@monna.ia.br</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
