

# Fix: OAuth tokens aterrissam na Landing Page sem redirect

## Causa raiz

Sem `redirectTo` no `signInWithOAuth`, o Supabase redireciona para a Site URL configurada no dashboard. Os tokens chegam em `/#access_token=...` (rota `/`, a Landing Page). A Landing Page nao tem nenhuma logica de redirect para usuarios autenticados — a sessao e processada, mas a usuaria fica presa na pagina publica.

## Solucao (2 camadas de protecao)

### 1. `src/contexts/AuthContext.tsx` — Restaurar redirectTo para /home

Adicionar `redirectTo` apontando para `/home` (rota protegida que tem toda a logica de roteamento):

```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/home`,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });
  // ...
};
```

Isso garante que o OAuth retorne para `/home`, onde o ProtectedRoute ja tem a logica de:
- Detectar `sessionStorage('onboarding_redirect')` e redirecionar para `/bem-vinda`
- Verificar `onboarding_completed` e redirecionar para `/bem-vinda`

### 2. `src/pages/LandingPage.tsx` — Fallback para tokens que aterrissam em /

Caso os tokens cheguem na landing page (Site URL sem `/home`, ou `redirectTo` nao whitelisted), adicionar redirect automatico:

```typescript
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const { user, loading, profile, profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Se tokens OAuth aterrissaram aqui, ou se user logado chegou com hash
  useEffect(() => {
    const hasOAuthHash = location.hash.includes('access_token');
    if (!hasOAuthHash) return;
    if (loading) return;
    if (!user) return;
    if (profileLoading) return;

    // Limpar hash
    window.history.replaceState(null, '', location.pathname);

    // Redirecionar baseado em onboarding
    if (profile?.onboarding_completed) {
      navigate('/home', { replace: true });
    } else {
      navigate('/bem-vinda', { replace: true });
    }
  }, [user, loading, profile, profileLoading, location.hash, navigate]);

  // ... resto do componente
}
```

Isso funciona como rede de seguranca — se por qualquer motivo os tokens chegarem na `/`, a landing page redireciona automaticamente.

## Fluxo corrigido

```text
Caminho feliz (redirectTo funciona):
1. signInWithGoogle() com redirectTo=/home
2. OAuth retorna para /home#access_token=...
3. ProtectedRoute processa → sessionStorage flag → /bem-vinda

Caminho fallback (redirectTo nao whitelisted):
1. signInWithGoogle() com redirectTo=/home (nao whitelisted)
2. Supabase usa Site URL → /#access_token=...
3. LandingPage detecta hash + user → redireciona para /bem-vinda
```

## Configuracao necessaria no Supabase

Para o caminho feliz funcionar no preview, a URL do preview deve estar na whitelist de Redirect URLs do Supabase Dashboard. Para producao (monna.ia.br/home), ja deve estar configurada.

## Arquivos modificados

| Arquivo | Mudanca |
|---------|---------|
| `src/contexts/AuthContext.tsx` | Adicionar `redirectTo: origin + '/home'` |
| `src/pages/LandingPage.tsx` | Adicionar fallback redirect para hash OAuth |

Nenhum arquivo novo. Nenhuma dependencia nova.
