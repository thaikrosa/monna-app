
# Plano: Wizard Multi-Step na pagina /bem-vinda

## Resumo

Substituir a pagina estatica `/bem-vinda` por um wizard de 4 steps com barra de progresso, login Google, coleta de nickname + aceites legais, conexao opcional com Google Calendar, e tela final com disparo de onboarding.

---

## Decisoes de Arquitetura

### Redirect do Google Auth
O `signInWithGoogle` atual redireciona para `/home`. Para o wizard, sera criada uma variante que redireciona de volta para `/bem-vinda`. Isso sera feito adicionando um parametro `redirectTo` ao `signInWithGoogle` no AuthContext.

### Deteccao de step atual
Ao carregar a pagina, o wizard detecta o estado da usuaria:
- Sem sessao -> Step 1 (login)
- Logada, sem nickname -> Step 2
- Logada, com nickname, sem onboarding completo -> Step 3
- Logada, com onboarding completo -> Step 4

### Campos do banco
Os campos `terms_accepted_at`, `privacy_accepted_at`, `onboarding_completed`, `onboarding_completed_at` e `nickname` ja existem na tabela `profiles`. Nenhuma migracao necessaria.

### Seguranca do trigger-onboarding
A Edge Function `trigger-onboarding` usa `verify_jwt = false` no config.toml (abordagem recomendada com signing-keys), mas valida o JWT **no codigo** via `getClaims()`. O `user_id` e extraido do token JWT, NAO aceito do body. Isso impede que qualquer pessoa chame o endpoint com user_ids arbitrarios.

---

## Arquivos Criados

### 1. `supabase/functions/trigger-onboarding/index.ts`
Edge Function que:
- Valida o JWT via `getClaims()` (rejeita requests nao autenticados com 401)
- Extrai `user_id` do claim `sub` do JWT (ignora qualquer user_id do body)
- Retorna `{ success: true }`
- CORS headers inclusos
- `verify_jwt = false` no config.toml (validacao feita no codigo)

### 2. Componentes do Wizard (dentro de `src/pages/BemVinda.tsx`)
O wizard sera implementado diretamente no arquivo `BemVinda.tsx`, substituindo o conteudo atual. Os 4 steps serao componentes internos no mesmo arquivo (ou extraidos para `src/components/onboarding/` se ficarem grandes).

---

## Arquivos Modificados

### 1. `src/pages/BemVinda.tsx` — Reescrita completa
Wizard com 4 steps, barra de progresso (4 bolinhas conectadas por linhas), transicoes suaves via CSS (opacity + translate).

**Step 1 — Login Google**
- Logo Monna, titulo "Prontinho!", subtitulo sobre assinatura confirmada
- Botao "Entrar com Google" (chama `signInWithGoogle` com redirect para `/bem-vinda`)
- Texto "Usamos o Google para criar sua conta de forma segura."
- Apos login detectado via `useAuth`, avanca automaticamente

**Step 2 — Nickname + Aceites**
- Campo texto pre-preenchido com `profile?.first_name` ou `user.user_metadata.full_name?.split(' ')[0]`
- Dois checkboxes obrigatorios com links para `/termos` e `/privacidade` (target=_blank)
- Botao "Continuar" desabilitado ate validacao
- Ao clicar: atualiza `profiles` com `nickname`, `terms_accepted_at: new Date().toISOString()`, `privacy_accepted_at: new Date().toISOString()`

**Step 3 — Google Calendar (opcional)**
- Titulo, subtitulo e 3 beneficios com icones Phosphor (weight="thin")
- Botao primario "Conectar Google Calendar" (usa `useGoogleCalendarOAuth().initiateCalendarOAuth()`)
- Botao secundario "Farei depois"
- Antes de chamar OAuth, salva flag em `sessionStorage` para redirect de volta ao wizard

**Step 4 — Tela final (dispara onboarding)**
- Titulo "Prontinho, {nickname}!"
- Subtitulo sobre WhatsApp
- Ao montar: POST autenticado para `trigger-onboarding` (sem body, user_id vem do JWT) e marca `onboarding_completed = true`, `onboarding_completed_at = now()` no `profiles`

### 2. `src/contexts/AuthContext.tsx` — Parametro redirectTo
Adicionar parametro opcional `redirectTo` ao `signInWithGoogle`:
```
signInWithGoogle: (redirectTo?: string) => Promise<void>
```
Se fornecido, usa esse valor como `redirectTo` no OAuth. Caso contrario, usa `/home` (comportamento atual mantido).

### 3. `src/pages/OAuthCallback.tsx` — Redirect condicional
Detectar via `sessionStorage` se o OAuth do Calendar foi iniciado durante o onboarding. Se sim, redirecionar para `/bem-vinda` em vez de `/configuracoes`.

### 4. `supabase/config.toml` — Nova function
Adicionar:
```toml
[functions.trigger-onboarding]
verify_jwt = false
```
(Validacao JWT feita no codigo via getClaims para compatibilidade com signing-keys)

### 5. `src/contexts/AuthContext.tsx` — Profile interface
Adicionar campos `onboarding_completed`, `terms_accepted_at` ao `Profile` interface para que o wizard possa detectar o step correto.

---

## Fluxo Completo

```text
Stripe Checkout sucesso
    |
    v
/bem-vinda (Step 1)
    |
    v
Clica "Entrar com Google"
    |
    v
Google OAuth -> redirect /bem-vinda#access_token=...
    |
    v
Supabase processa hash, detecta sessao
    |
    v
/bem-vinda (Step 2 — auto-avanca)
    |
    v
Preenche nickname + aceita termos
    |
    v
Salva no profiles -> avanca Step 3
    |
    v
Conecta Calendar (opcional) ou "Farei depois"
    |
    v
/bem-vinda (Step 4 — tela final)
    |
    v
POST trigger-onboarding (JWT auth, user_id do token) + marca onboarding_completed
```

---

## Secao Tecnica

### Barra de progresso
4 circulos (24px) conectados por linhas horizontais. Step atual tem fundo `primary`, completos tem fundo `primary`, futuros tem fundo `border`. Linhas entre circulos: completas tem cor `primary`, futuras `border`.

### Transicoes
CSS transitions com `opacity` e `transform: translateX()` para efeito de slide horizontal entre steps. Duration de 300ms com ease-out.

### Protecao de rota
A pagina `/bem-vinda` NAO usa `ProtectedRoute`. O Step 1 funciona sem autenticacao. A partir do Step 2, o componente verifica `user` do `useAuth()` e se nao houver, volta para Step 1.

### Google Calendar OAuth — ida e volta
Antes de chamar `initiateCalendarOAuth()`, salvar `sessionStorage.setItem('onboarding_calendar_redirect', 'true')`. No `OAuthCallback.tsx`, verificar essa flag e redirecionar para `/bem-vinda` em vez de `/configuracoes`. O wizard detecta que Calendar ja esta conectado (via query de `calendar_connections` ou `google_oauth_tokens`) e avanca para Step 4.

### Seguranca do trigger-onboarding
```typescript
// Na Edge Function:
const authHeader = req.headers.get('Authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { headers: { Authorization: authHeader } }
});
const { data, error } = await supabase.auth.getClaims(token);
const userId = data.claims.sub; // user_id vem do JWT, nao do body
```

### Dependencias
Nenhuma nova dependencia. Usa Phosphor Icons, Radix Checkbox, componentes UI existentes.
