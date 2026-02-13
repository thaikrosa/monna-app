# Monna

**Assistente inteligente para a maternidade**

![Node](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/Licen%C3%A7a-Privada-red)

---

## Sobre o Projeto

A **Monna** e uma assistente inteligente que ajuda maes brasileiras a organizar a rotina da maternidade. O canal principal de interacao e o **WhatsApp**, e este **web app** funciona como complemento — oferecendo dashboards, listas, lembretes e agenda em uma interface mobile-first.

- **Publico-alvo:** Maes brasileiras
- **Canais:** WhatsApp (principal) + Web App (complementar)
- **URL:** [https://monna.ia.br](https://monna.ia.br)

---

## Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18 + TypeScript 5.8 + Vite 5 |
| **UI** | Tailwind CSS 3 + shadcn/ui + Radix UI |
| **State** | React Query (TanStack) + Context API |
| **Auth** | Supabase Auth (Google OAuth) |
| **Backend** | Supabase (PostgreSQL) + Edge Functions |
| **Automacao** | n8n (workflows WhatsApp) |
| **Pagamento** | Stripe |
| **Icons** | Phosphor Icons |
| **Fonts** | Inter (@fontsource, local) |
| **Animacoes** | Framer Motion (drag gestures) + CSS |

---

## Pre-requisitos

- Node.js >= 18
- npm >= 9

---

## Instalacao e Setup

```bash
# Clone o repositorio
git clone https://github.com/thaikrosa/monna-app.git
cd monna-app

# Instale dependencias
npm install

# Configure variaveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variaveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variaveis:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_GOOGLE_CLIENT_ID=
```

---

## Scripts Disponiveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de producao
npm run build:dev  # Build em modo desenvolvimento
npm run preview    # Preview do build
npm run lint       # Lint do codigo (ESLint)
```

---

## Estrutura do Projeto

```
src/
├── components/        # Componentes React organizados por feature
│   ├── agenda/        # Eventos e calendario
│   ├── children/      # Gestao de filhos
│   ├── contacts/      # Rede de apoio
│   ├── home/          # Dashboard principal + BottomBar
│   ├── landing/       # Landing page
│   ├── onboarding/    # Steps do wizard BemVinda
│   ├── profile/       # Secoes do perfil
│   ├── reminders/     # Lembretes e recorrencia
│   ├── settings/      # Secoes de configuracao
│   ├── shared/        # Componentes compartilhados (formularios)
│   ├── shopping/      # Lista de compras
│   └── ui/            # shadcn/ui components
├── contexts/          # React Context (SessionContext)
├── data/              # Dados mock (artigos)
├── hooks/             # Custom hooks (useProfile, useReminders, etc.)
├── integrations/      # Supabase client + types
├── layouts/           # App layout com BottomBar
├── lib/               # Utilitarios
├── pages/             # Paginas/rotas
└── types/             # TypeScript types
```

---

## Arquitetura

### Roteamento

React Router com protecao por estado. O `SessionContext` computa o estado do usuario e o `RequireState` redireciona automaticamente:

```
ANONYMOUS → NO_SUBSCRIPTION → ONBOARDING → READY
```

- **Publico:** Landing, Auth, FAQ, Termos, Privacidade
- **Protegido:** Home, Agenda, Lembretes, Lista, Perfil, Configuracoes

### Autenticacao

`SessionContext` centraliza autenticacao via Supabase Auth com Google OAuth. O fluxo inclui verificacao de subscription (Stripe) e onboarding wizard.

### Data Fetching

Custom hooks com React Query (`useQuery`/`useMutation`). Exemplos: `useProfile()`, `useShoppingItems()`, `useReminders()`. Configurado com `staleTime: 5min` e `retry: 1`.

### Mobile-First

99% dos usuarios acessam via mobile. O design e otimizado para telas 320-428px com:
- Safe areas para iOS (notch/home indicator)
- Touch targets >= 44px
- Bottom navigation fixa
- Code splitting por rota (React.lazy)

### Backend

O backend e **gerenciado separadamente** via Supabase (PostgreSQL + Edge Functions) e n8n (workflows WhatsApp). Este repositorio contem apenas o frontend.

---

## Features

- **Lista de compras** com categorias e optimistic updates
- **Lembretes** com recorrencia e swipe-to-complete
- **Agenda** integrada com Google Calendar
- **Gestao de filhos** com dados de saude
- **Rede de apoio** (contatos de confianca)
- **Dark mode** (sistema/manual)
- **PWA-ready** (instalavel na home screen)
- **Acessibilidade** WCAG AA (ARIA labels, skip link, prefers-reduced-motion)
- **Deteccao de offline** com banner informativo
- **Memoria** (artigos e conteudos salvos)

---

## Padroes do Projeto

- **Componentes focados** — single responsibility, arquivos < 150 linhas
- **Optimistic updates** para acoes rapidas (shopping list)
- **Error states** com retry em todas as telas principais
- **Semantic HTML** + ARIA labels em elementos interativos
- **Design tokens** via CSS variables (light + dark)
- **Zero `any`** no TypeScript
- **Zero console.log** em producao
- **Code splitting** por rota com React.lazy + Suspense

---

## Contribuicao

Este e um projeto privado da **Annia Labs**.
Para contribuir, entre em contato com a equipe.

---

## Licenca

Propriedade de **Annia Labs**. Todos os direitos reservados.
