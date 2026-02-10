
# Plano: Integrar Stripe Checkout na Landing Page

## Resumo

Criar o fluxo completo de checkout com Stripe: uma Edge Function que gera a sessao de pagamento, um dialog de selecao de plano na landing page, e uma pagina de sucesso `/bem-vinda`.

---

## Pre-requisito: Secret do Stripe

A secret `STRIPE_SECRET_KEY` ainda nao esta configurada no Supabase. Sera necessario adiciona-la antes de prosseguir com a implementacao.

---

## 1. Edge Function: `create-checkout-session`

**Arquivo:** `supabase/functions/create-checkout-session/index.ts`

- Recebe POST com `{ plan: "monthly" | "annual" }`
- Usa `stripe@14` via esm.sh
- Cria Checkout Session com:
  - `mode: "subscription"`
  - `trial_period_days: 7`
  - Campo customizado para WhatsApp
  - `success_url: "https://monna.ia.br/bem-vinda"`
  - `cancel_url: "https://monna.ia.br/"`
  - `allow_promotion_codes: true`
- Price IDs fixos no codigo conforme fornecido
- CORS headers padrao do Supabase

**Arquivo:** `supabase/config.toml` -- adicionar:
```toml
[functions.create-checkout-session]
verify_jwt = false
```

---

## 2. Dialog de Selecao de Plano

**Novo arquivo:** `src/components/landing/PlanSelectionDialog.tsx`

Um Dialog (Radix) que abre ao clicar em qualquer CTA da landing page. Conteudo:

- **Dois cards lado a lado** (empilhados no mobile)
- **Plano Anual (pre-selecionado, destaque):**
  - Badge "Melhor valor" com cor primary
  - R$ 29,90/mês (grande)
  - R$ 358,80/ano (menor)
  - Badge "Economize 14%"
  - Borda primary, shadow elevada
- **Plano Mensal:**
  - Visual neutro, borda border
  - R$ 34,90/mês (grande)
- Ambos: "7 dias gratis para testar" abaixo do preco
- Indicador de selecao via borda colorida + radio visual
- Botao full-width: "Comecar meu teste gratis"
- Texto abaixo: "Nao gostou? Cancele com uma mensagem no WhatsApp. Sem burocracia."
- Estado de loading no botao durante o redirect
- Ao clicar: POST para a Edge Function, recebe `{ url }`, faz `window.location.href = url`

---

## 3. Alterar CTAs da Landing Page

**Arquivos modificados:**
- `src/components/landing/HeroSection.tsx` -- botao "Quero testar gratis" abre o dialog em vez de scrollar para #cta-final
- `src/components/landing/FinalCTASection.tsx` -- botao "Comecar meu teste gratis" abre o dialog em vez de link WhatsApp
- `src/components/landing/StepsSection.tsx` -- se houver CTA, mesmo tratamento (verificacao: nao tem CTA nesta secao, sem alteracao)

Os 3 botoes de CTA mencionados (Hero + FinalCTA + possivelmente outro) passam a chamar `setDialogOpen(true)`. O estado do dialog sera gerenciado no componente pai `LandingPage.tsx` e passado via props, ou o dialog sera incluido diretamente em cada secao que precisa dele. Abordagem escolhida: **estado no LandingPage.tsx** com callback passado por props.

---

## 4. Pagina `/bem-vinda`

**Novo arquivo:** `src/pages/BemVinda.tsx`

- Pagina estatica simples
- Layout centralizado, fundo `bg-secondary`
- Logo Monna no topo
- Titulo: "Prontinho!" (com emoji)
- Subtitulo: "Vai la no WhatsApp que a Monna ja te mandou uma mensagem."
- Texto menor: "Se a mensagem ainda nao chegou, aguarde alguns segundinhos."
- Sem botoes de CTA
- Design system Monna (mesmas cores, fontes)

**Arquivo modificado:** `src/App.tsx` -- adicionar rota publica `/bem-vinda`

---

## Secao Tecnica

### Arquivos criados
| Arquivo | Descricao |
|---------|-----------|
| `supabase/functions/create-checkout-session/index.ts` | Edge Function Stripe |
| `src/components/landing/PlanSelectionDialog.tsx` | Dialog de selecao de plano |
| `src/pages/BemVinda.tsx` | Pagina de sucesso pos-pagamento |

### Arquivos modificados
| Arquivo | Mudanca |
|---------|---------|
| `supabase/config.toml` | Adicionar config da nova function |
| `src/App.tsx` | Adicionar rota `/bem-vinda` |
| `src/pages/LandingPage.tsx` | Estado do dialog + passar props |
| `src/components/landing/HeroSection.tsx` | CTA abre dialog |
| `src/components/landing/FinalCTASection.tsx` | CTA abre dialog |

### Fluxo do checkout

```text
Usuaria clica CTA
    |
    v
Dialog de plano abre (anual pre-selecionado)
    |
    v
Seleciona plano + clica "Comecar meu teste gratis"
    |
    v
POST /create-checkout-session { plan: "annual" }
    |
    v
Edge Function cria Stripe Session
    |
    v
Retorna { url: "https://checkout.stripe.com/..." }
    |
    v
window.location.href = url (redirect ao Stripe)
    |
    v
Stripe Checkout (cartao + trial 7 dias)
    |
    v
Sucesso -> redirect para /bem-vinda
```

### Dependencias
- Nenhuma nova dependencia necessaria (Stripe roda server-side na Edge Function via esm.sh)
- Dialog usa Radix Dialog ja instalado

### Secret necessaria
- `STRIPE_SECRET_KEY` -- sera adicionada via ferramenta de secrets antes de implementar
