

# Fix: OAuth redirect perde tokens porque redirectTo nao esta na whitelist

## Causa raiz

`signInWithGoogle()` envia `redirectTo: ${window.location.origin}/home`. No ambiente preview, essa URL (`https://preview-id.lovable.app/home`) nao esta na whitelist do Supabase. Quando a URL nao esta na whitelist, o Supabase redireciona para a Site URL configurada SEM os tokens no hash. A sessao e perdida.

## Solucao

Remover o parametro `redirectTo` do `signInWithOAuth`. Sem `redirectTo`, o Supabase usa a Site URL configurada no dashboard (que ja esta whitelisted por definicao). Os tokens chegam no hash, o `AuthContext` processa, e a logica de redirecionamento existente (`Auth.tsx`, `ProtectedRoute`) cuida do resto.

## Mudancas

### 1. `src/contexts/AuthContext.tsx` — Remover redirectTo do OAuth

```typescript
// ANTES (linhas 294-315):
const signInWithGoogle = async (redirectTo?: string) => {
  const redirectUrl = redirectTo
    ? `${window.location.origin}${redirectTo}`
    : `${window.location.origin}/home`;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: { ... },
    },
  });
};

// DEPOIS:
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    console.error('[Auth] Google sign-in error:', error);
    throw error;
  }
};
```

Remover o parametro `redirectTo` da funcao e da chamada OAuth. Sem esse parametro, o Supabase usa a Site URL do dashboard.

Atualizar a interface `AuthContextType` tambem:
```typescript
signInWithGoogle: () => Promise<void>;  // remover parametro opcional
```

### 2. `src/pages/BemVinda.tsx` — Ja esta correto

A chamada `signInWithGoogle()` em BemVinda ja nao passa argumentos (fix anterior). Nenhuma mudanca necessaria.

### 3. `src/pages/Auth.tsx` — Ja esta correto

A chamada `signInWithGoogle()` em Auth ja nao passa argumentos. Nenhuma mudanca necessaria.

## Configuracao necessaria no Supabase Dashboard

O usuario precisa verificar que a Site URL no Supabase (Authentication > URL Configuration) esta configurada como `https://monna.ia.br`.

Para testar no preview, adicionar a URL do preview (`https://id-preview--20f0cae3-cccb-4cdf-9b5a-e66cb61791cd.lovable.app`) na lista de Redirect URLs do dashboard.

## Fluxo corrigido

```text
1. Usuaria clica "Entrar com Google" em /bem-vinda
2. sessionStorage.setItem('onboarding_redirect', 'true')
3. signInWithGoogle() → OAuth SEM redirectTo
4. Supabase usa Site URL (https://monna.ia.br) como destino
5. Usuaria volta para monna.ia.br com tokens no hash (#access_token=...)
6. AuthContext detecta hash, processa tokens, sessao estabelecida
7. Landing page detecta sessao → LandingNavbar mostra "Ir para o app"
   OU Auth.tsx (se Site URL = /auth) detecta sessao e profile → redireciona
8. Ao chegar em rota protegida (/home), ProtectedRoute detecta flag 'onboarding_redirect'
9. Redireciona para /bem-vinda
10. Wizard calcula step (provavelmente Step 2)
```

## Secao tecnica

### Arquivo unico modificado

| Arquivo | Mudanca |
|---------|---------|
| `src/contexts/AuthContext.tsx` | Remover `redirectTo` param da funcao e do OAuth call |

### Dependencia de configuracao

O Site URL no Supabase Dashboard DEVE apontar para uma pagina que carrega o app React (onde AuthContext processa os tokens). Ideal: `https://monna.ia.br` ou `https://monna.ia.br/auth`.

### Preview/desenvolvimento

Para testar no preview Lovable, a URL do preview precisa estar na lista de Redirect URLs no Supabase Dashboard. Isso e uma limitacao do Supabase OAuth, nao do codigo.
