# MONNA APP — Project Brief for Code Review

## 1. O Que é a Monna

Monna é uma assistente profissional de IA para mães brasileiras, entregue via WhatsApp e complementada por um web app. Desenvolvida pela Annia Labs (fundadora: Thaís). O produto resolve a "carga mental materna" — a gestão invisível de tarefas, compromissos e informações que sobrecarrega mães diariamente.

**Métricas de validação:** 100% retenção, 2.74 interações diárias por usuária.

**URL do app:** monna.ia.br  
**Supabase Project ID:** qxtviztoorgomfkerndj

---

## 2. Arquitetura Geral

### Stack do Web App (Frontend) — ESCOPO DO REVIEW
- **Framework:** React (via Lovable — plataforma no-code/low-code que gera React + Vite)
- **Styling:** Tailwind CSS + shadcn/ui + Lucide React icons
- **Auth:** Supabase Auth (Google OAuth)
- **DB Client:** @supabase/supabase-js
- **Hosting:** Lovable (deploy automático)
- **Repositório:** GitHub (código gerado pelo Lovable, sincronizado com GitHub)

### Stack do Backend — FORA DO ESCOPO (NÃO ALTERAR)
- **Orquestração:** n8n (workflows de automação)
- **Banco de dados:** Supabase (PostgreSQL) — tabelas, triggers, views, RLS policies, Edge Functions
- **Mensageria:** WhatsApp Business API
- **Pagamento:** Stripe (subscriptions + trial 7 dias)
- **Calendar:** Google Calendar API (OAuth + sync)

⚠️ **REGRA ABSOLUTA: O backend (Supabase e n8n) está sólido, validado e em produção. Nenhuma alteração deve ser proposta em tabelas, triggers, views, RLS policies, Edge Functions ou workflows n8n. O review é 100% frontend.**

### Arquitetura Macro
```
Landing Page (monna.ia.br)
    → Stripe Checkout (pagamento)
    → Supabase Auth (Google login)
    → Wizard /bem-vinda (onboarding web: nickname + LGPD + Calendar opcional)
    → Web App /home (dashboard com lista, lembretes, agenda)
    → WhatsApp (tour guiado + uso diário via IA)

Backend (FORA DO ESCOPO):
    n8n Workflows → Supabase DB → Edge Functions → Google Calendar API
    Stripe Webhooks → n8n → Supabase (user + subscription + onboarding)
```

---

## 3. Funcionalidades do Web App

### 3.1 Jornada da Usuária
1. **Landing page** → CTA → seleciona plano (mensal R$34,90 ou anual R$29,90/mês)
2. **Stripe Checkout** → preenche email, WhatsApp, dados do cartão. Trial 7 dias
3. **Wizard /bem-vinda** → login Google → nickname + aceites LGPD → Google Calendar (opcional) → tela final
4. **WhatsApp** → recebe template personalizado de boas-vindas
5. **Tour guiado** → aprende lista, lembrete e agenda testando de verdade
6. **App /home** → dashboard com funcionalidades

### 3.2 Features Core do Web App
- **Dashboard Home** — Cards de resumo (lembretes do dia, lista de mercado, próximos eventos)
- **Lista de Mercado** — CRUD completo, entrada múltipla (vírgula separa itens), realtime
- **Lembretes** — Criar, visualizar, snooze, completar
- **Agenda** — Eventos do Google Calendar, criação de eventos via Edge Function
- **Configurações** — Perfil, conexão Calendar, gerenciamento de assinatura

### 3.3 Máquina de Estados (Roteamento)
```
ANONYMOUS        → Sem sessão auth        → / ou /auth
NO_SUBSCRIPTION  → Auth sem subscription  → / (página de planos)
ONBOARDING       → Auth + sub active + onboarding_completed = false → /bem-vinda
READY            → Auth + sub active + onboarding_completed = true  → /home
```

---

## 4. Princípios de Design do Projeto

- **Produto profissional em construção, não MVP** — foco em soluções simples, eficientes, profissionais e escaláveis
- **SIMPLES:** mínimo de queries, estados e componentes
- **EFICIENTE:** sem re-renders desnecessários, sem loops de redirect
- **PROFISSIONAL:** tratamento de erro em cada etapa, loading states claros
- **ESCALÁVEL:** fácil adicionar novos steps ou features sem quebrar o existente
- **Mobile-first:** público-alvo são mães usando celular
- **LGPD compliant:** aceites de termos no wizard

---

## 5. Tabelas Supabase Relevantes (Referência — NÃO ALTERAR)

Estas tabelas existem e estão em produção. O frontend consome dados delas. Listadas aqui apenas para contexto de leitura do código:

- `profiles` — dados do usuário (nickname, phone, onboarding_completed, google_tokens)
- `subscriptions` — status da assinatura Stripe
- `onboarding` — status e step do tour WhatsApp
- `shopping_list_items` — itens de lista de mercado
- `reminders` — lembretes
- `reminder_occurrences` — instâncias de lembretes
- `calendar_events` — eventos do calendário
- `calendar_event_instances` — instâncias de eventos recorrentes

---

## 6. Objetivo do Code Review

Revisão profissional e profunda do **código frontend** do web app da Monna, cobrindo:

1. **Arquitetura de componentes** — organização, reutilização, separação de responsabilidades
2. **Gerenciamento de estado** — padrões, race conditions, loading states
3. **Roteamento e proteção de rotas** — robustez, clareza, tratamento de estados assíncronos
4. **Segurança frontend** — exposição de dados, validação de inputs, tratamento de tokens
5. **Performance** — re-renders, queries desnecessárias, bundle size, lazy loading
6. **Qualidade de código** — naming, tipagem TypeScript, tratamento de erros, consistência
7. **UX/Acessibilidade** — mobile-first, loading states, empty states, error states
8. **Escalabilidade** — facilidade de adicionar features sem quebrar o existente
9. **Padrões e boas práticas** — consistência, DRY, SOLID principles aplicáveis

⚠️ **FORA DO ESCOPO:** Backend Supabase (tabelas, triggers, views, RLS, Edge Functions), workflows n8n, WhatsApp Business API, Stripe webhooks. Não proponha alterações nesses componentes.
