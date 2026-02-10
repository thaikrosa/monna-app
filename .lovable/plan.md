

# Roteamento baseado em onboarding_completed

## Resumo

Implementar verificacao de `onboarding_completed` em 3 pontos do app para garantir que usuarias com onboarding incompleto sempre sejam direcionadas ao wizard `/bem-vinda`.

## Problema atual

- ProtectedRoute nao verifica `onboarding_completed` -- usuaria com onboarding incompleto consegue acessar `/home`
- Auth.tsx redireciona sempre para `/home` apos login, ignorando estado do onboarding
- Profile interface no AuthContext nao inclui `onboarding_completed`

## Arquivos modificados

### 1. `src/contexts/AuthContext.tsx` — Adicionar campo ao Profile

Adicionar `onboarding_completed` na interface `Profile`:

```typescript
export interface Profile {
  // ... campos existentes ...
  onboarding_completed: boolean | null;
}
```

Nenhuma outra mudanca neste arquivo. O `select('*')` no fetchProfile ja traz o campo do banco.

### 2. `src/components/ProtectedRoute.tsx` — Verificar onboarding_completed

Atualmente o ProtectedRoute libera loading antes do profile carregar (`profileLoading` nao e considerado). Para verificar `onboarding_completed`, precisamos esperar o profile.

Mudancas:
- Importar `profile` e `profileLoading` do `useAuth()`
- Apos confirmar que `user` existe e `loading` e false, verificar se `profileLoading` ainda e true — se sim, mostrar skeleton
- Apos profile carregar, verificar `onboarding_completed`:
  - Se `false` ou `null` → `<Navigate to="/bem-vinda" replace />`
  - Se `true` → continuar normalmente
- Manter o check do `sessionStorage('onboarding_redirect')` ANTES do check de onboarding (para nao criar loop)

Logica final (simplificada):
```text
loading? → skeleton
hasOAuthHash processing? → "Finalizando login..."
profileError? → botao "Entrar novamente"
!user? → Navigate /auth
sessionStorage 'onboarding_redirect'? → Navigate /bem-vinda (remove flag)
profileLoading? → skeleton (aguardando profile)
profile.onboarding_completed === false? → Navigate /bem-vinda
render children
```

### 3. `src/pages/Auth.tsx` — Redirecionar baseado em onboarding

Atualmente redireciona sempre para `/home`. Precisa verificar `onboarding_completed` do profile.

Mudancas:
- Importar `profile` e `profileLoading` do `useAuth()`
- No useEffect de redirect, esperar `profile` carregar antes de decidir destino:
  - Se `profile.onboarding_completed === true` → navigate `/home`
  - Se `profile.onboarding_completed === false/null` → navigate `/bem-vinda`
- Enquanto profile carrega, nao redirecionar (mostrar UI de login normalmente)

### 4. `src/pages/BemVinda.tsx` — Redirecionar se onboarding ja completo

Adicionar verificacao: se user logado E `onboarding_completed === true`, redirecionar para `/home`.

Mudanca minima:
- Importar `useNavigate` de react-router-dom
- No `calculateStep`, antes de calcular, verificar `onboarding_completed` do profile
- Se `onboarding_completed === true` → `navigate('/home', { replace: true })` e retornar

---

## Tabela de decisao implementada

| Situacao | Resultado |
|----------|-----------|
| /home sem login | → /auth |
| /home logada, onboarding=false | → /bem-vinda |
| /home logada, onboarding=true | dashboard |
| /auth logada, onboarding=false | → /bem-vinda |
| /auth logada, onboarding=true | → /home |
| /bem-vinda sem login | Step 1 (login) |
| /bem-vinda logada, onboarding=false | calcula step 2/3/4 |
| /bem-vinda logada, onboarding=true | → /home |

## Secao tecnica

### Timing do profile

O AuthContext carrega profile em background apos liberar `loading`. Isso significa que quando ProtectedRoute detecta `user` e `loading=false`, o `profile` pode ainda ser `null` com `profileLoading=true`.

Para evitar flash de redirect incorreto, o ProtectedRoute deve mostrar skeleton enquanto `profileLoading === true` (apos user existir). Isso adiciona um breve delay (~100-300ms) mas garante decisao correta.

### Nenhuma migracao necessaria

O campo `onboarding_completed` (boolean, default false) ja existe na tabela `profiles`.

### Nenhuma dependencia nova

| Arquivo | Mudanca |
|---------|---------|
| `src/contexts/AuthContext.tsx` | Adicionar `onboarding_completed` ao interface Profile |
| `src/components/ProtectedRoute.tsx` | Aguardar profile + verificar onboarding_completed |
| `src/pages/Auth.tsx` | Redirecionar baseado em onboarding_completed |
| `src/pages/BemVinda.tsx` | Redirecionar para /home se onboarding ja completo |

