

## Adicionar Campo WhatsApp com Mascara no Step 2 do Wizard

### Resumo
Adicionar um campo de WhatsApp com mascara visual no Step 2 da pagina `/bem-vinda`, entre o campo "nickname" e os checkboxes LGPD. O campo sera obrigatorio para habilitar o botao "Continuar" e o numero sera salvo no banco com prefixo `55`.

### Arquivo alterado
- `src/pages/BemVinda.tsx` (unico arquivo modificado)

### Detalhes tecnicos

**1. Funcoes utilitarias (dentro do arquivo)**

Adicionar 3 funcoes auxiliares no topo do componente (antes do `export default`):

- `formatWhatsApp(value)` — aplica mascara `(XX) XXXXX-XXXX` a partir dos digitos
- `extractDigits(value)` — remove tudo que nao e digito
- `isValidWhatsApp(digits)` — valida se tem 10 ou 11 digitos

**2. Novos estados no Step 2**

- `whatsappDisplay` (string) — valor formatado exibido no input
- `whatsappDigits` (string) — apenas digitos, usado para validacao e save

**3. Pre-preenchimento**

No `calculateStep`, ao inicializar o Step 2, verificar se o profile ja tem `whatsapp`. Se sim, extrair os digitos sem o prefixo `55` e pre-preencher os estados. A query do `calculateStep` sera atualizada para incluir o campo `whatsapp` no SELECT.

**4. Campo visual**

Inserido apos o bloco do nickname (linha 403) e antes dos checkboxes LGPD (linha 406):

- Label: "WhatsApp"
- Input tipo `tel`, placeholder `(00) 00000-0000`
- Dica abaixo: "Informe com DDD. E por aqui que a Monna vai te ajudar (emoji)"
- Mesmo estilo do campo nickname (`space-y-1`, mesmos componentes `Label` e `Input`)

**5. Validacao**

- `canContinueStep2` recebe condicao adicional: `isValidWhatsApp(whatsappDigits)`
- Se o campo tiver sido tocado e for invalido, exibir mensagem em vermelho abaixo da dica

**6. Save no banco**

No `handleSaveProfile`, adicionar `whatsapp: '55' + whatsappDigits` ao objeto do UPDATE.

### O que NAO muda

- Step 1, Step 3, SessionContext, RequireState, rotas, hooks, edge functions
- Nenhum outro arquivo alem de `BemVinda.tsx`
