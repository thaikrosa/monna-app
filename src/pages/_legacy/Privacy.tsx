import { Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const Privacy = () => {
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
            Política de Privacidade
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-background rounded-lg border border-border shadow-elevated p-6">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="text-xs text-muted-foreground mb-6">Última atualização: 19 de janeiro de 2025</p>
            
            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">1. Introdução</h2>
              <p>
                A Monna ("nós", "nosso" ou "Monna") opera o aplicativo Monna (o "Serviço"). 
                Esta página informa sobre nossas políticas relativas à coleta, uso e divulgação 
                de informações pessoais quando você utiliza nosso Serviço.
              </p>
              <p>
                Ao utilizar o Serviço, você concorda com a coleta e uso de informações de acordo 
                com esta política. As informações pessoais que coletamos são utilizadas para 
                fornecer e melhorar o Serviço. Não usaremos ou compartilharemos suas informações 
                com ninguém, exceto conforme descrito nesta Política de Privacidade.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">2. Definições</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Dados Pessoais:</strong> informações que podem identificá-lo direta ou indiretamente.</li>
                <li><strong className="text-foreground">Dados de Uso:</strong> informações coletadas automaticamente pela utilização do Serviço.</li>
                <li><strong className="text-foreground">Cookies:</strong> pequenos arquivos armazenados em seu dispositivo.</li>
                <li><strong className="text-foreground">Controlador de Dados:</strong> pessoa jurídica que determina as finalidades do tratamento.</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">3. Coleta e Uso de Informações</h2>
              <p>Coletamos diferentes tipos de informações para diversos fins, visando fornecer e melhorar nosso Serviço.</p>
              
              <h3 className="text-base font-medium text-foreground mt-4">3.1 Dados Pessoais</h3>
              <p>Durante o uso do nosso Serviço, podemos solicitar certas informações pessoalmente identificáveis:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Endereço de e-mail</li>
                <li>Nome e sobrenome</li>
                <li>Número de telefone (WhatsApp)</li>
                <li>Informações sobre seus filhos (nome, data de nascimento, informações de saúde)</li>
                <li>Contatos da sua rede de apoio</li>
                <li>Lembretes e compromissos</li>
                <li>Lista de compras</li>
              </ul>

              <h3 className="text-base font-medium text-foreground mt-4">3.2 Dados de Uso</h3>
              <p>Também coletamos informações sobre como o Serviço é acessado e utilizado:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tipo de dispositivo</li>
                <li>Identificadores únicos do dispositivo</li>
                <li>Sistema operacional</li>
                <li>Horários e datas de acesso</li>
                <li>Páginas visitadas</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">4. Uso dos Dados</h2>
              <p>A Monna utiliza os dados coletados para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer e manter o Serviço</li>
                <li>Notificá-lo sobre alterações no Serviço</li>
                <li>Permitir recursos interativos</li>
                <li>Fornecer suporte ao cliente</li>
                <li>Fornecer análises para melhorar o Serviço</li>
                <li>Monitorar o uso do Serviço</li>
                <li>Detectar e prevenir problemas técnicos</li>
                <li>Enviar lembretes e notificações personalizadas</li>
                <li>Oferecer sugestões proativas baseadas em seu perfil</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">5. Transferência de Dados</h2>
              <p>
                Suas informações podem ser transferidas e mantidas em computadores localizados 
                fora de sua jurisdição. Se você está localizado fora do Brasil e opta por nos 
                fornecer informações, observe que transferimos os dados para o Brasil e os 
                processamos lá.
              </p>
              <p>
                Seu consentimento com esta Política de Privacidade, seguido pelo envio de tais 
                informações, representa sua concordância com essa transferência.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">6. Segurança dos Dados</h2>
              <p>
                A segurança dos seus dados é importante para nós, mas lembre-se que nenhum 
                método de transmissão pela Internet ou método de armazenamento eletrônico é 
                100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis 
                para proteger seus Dados Pessoais, não podemos garantir sua segurança absoluta.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">7. Seus Direitos (LGPD)</h2>
              <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimizar, bloquear ou eliminar dados desnecessários</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminar dados tratados com seu consentimento</li>
                <li>Informação sobre compartilhamento de dados</li>
                <li>Revogar o consentimento</li>
              </ul>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">8. Privacidade de Menores</h2>
              <p>
                Nosso Serviço pode coletar informações sobre menores fornecidas pelos pais ou 
                responsáveis legais. Não coletamos intencionalmente informações de identificação 
                pessoal diretamente de menores de 18 anos. Se você é pai/mãe ou responsável e 
                sabe que seu filho nos forneceu Dados Pessoais diretamente, entre em contato conosco.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">9. Integrações com Terceiros</h2>
              <p>Nosso Serviço pode integrar-se com serviços de terceiros, incluindo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Google Calendar:</strong> para sincronizar seus compromissos</li>
                <li><strong className="text-foreground">WhatsApp:</strong> para enviar notificações e lembretes</li>
              </ul>
              <p className="mt-2">
                Cada serviço de terceiros possui sua própria Política de Privacidade. 
                Recomendamos que você revise as políticas de privacidade desses serviços.
              </p>
            </section>

            <section className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-foreground">10. Alterações nesta Política</h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos 
                você sobre quaisquer alterações publicando a nova Política de Privacidade nesta 
                página e atualizando a data de "última atualização".
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">11. Contato</h2>
              <p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:</p>
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

export default Privacy;
