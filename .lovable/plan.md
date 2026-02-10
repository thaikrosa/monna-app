

# Fix: Login Google loop na /bem-vinda

## Causa raiz

A URL `/bem-vinda` nao esta na whitelist de Redirect URLs do Supabase (Authentication > URL Configuration). Apenas `/home` esta configurada. Quando o OAuth redireciona para uma URL nao-whitelisted, o Supabase descarta os tokens — a usuaria chega sem sessao.

## Solucao

Usar `/home` como redirect do OAuth (ja whitelisted) e um flag em `sessionStorage` para redirecionar de volta a `/bem-vinda`.

---

## Arquivos modificados

### 1. `src/pages/BemVinda.tsx`

Na funcao `handleGoogleLogin`:

```typescript
// ANTES:
await signInWithGoogle('/bem-vinda');

// DEPOIS:
sessionStorage.setItem('onboarding_redirect', 'true');
await signInWithGoogle(); // usa default /home (whitelisted)
```

Remover o parametro '/bem-vinda' do signInWithGoogle. Adicionar flag em sessionStorage ANTES de iniciar o OAuth.

### 2. `src/components/ProtectedRoute.tsx`

Adicionar verificacao apos o usuario ser detectado (antes de renderizar children):

```typescript
// Apos confirmar que user existe e loading = false:
const onboardingRedirect = sessionStorage.getItem('onboarding_redirect');
if (onboardingRedirect) {
  sessionStorage.removeItem('onboarding_redirect');
  return <Navigate to="/bem-vinda" replace />;
}
```

Isso intercepta a chegada em `/home` e redireciona para `/bem-vinda` antes de renderizar o dashboard.

---

## Fluxo corrigido

```text
1. Usuaria clica "Entrar com Google" em /bem-vinda
2. sessionStorage.setItem('onboarding_redirect', 'true')
3. signInWithGoogle() → redirect para /home (whitelisted)
4. Google OAuth completa → Supabase redireciona para /home com tokens
5. AuthContext processa tokens, sessao estabelecida
6. ProtectedRoute detecta flag 'onboarding_redirect' em sessionStorage
7. ProtectedRoute redireciona para /bem-vinda
8. BemVinda detecta user logado, calcula step → Step 2
```

## Alternativa descartada

Adicionar `/bem-vinda` na whitelist do Supabase resolveria tambem, mas depende de configuracao manual no dashboard e no dominio de producao. A solucao via sessionStorage e auto-contida no codigo e funciona em qualquer ambiente (preview, producao).

---

## Secao tecnica

### Mudancas em BemVinda.tsx
- Linha do `handleGoogleLogin`: trocar `signInWithGoogle('/bem-vinda')` por `sessionStorage.setItem(...)` + `signInWithGoogle()`

### Mudancas em ProtectedRoute.tsx
- Apos `if (!user) return <Navigate to="/auth" />` (linha ~130), ANTES de retornar children, adicionar check do sessionStorage

### Nenhum arquivo novo. Nenhuma dependencia nova.

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/BemVinda.tsx` | Remover redirectTo, adicionar sessionStorage flag |
| `src/components/ProtectedRoute.tsx` | Interceptar flag e redirecionar para /bem-vinda |

