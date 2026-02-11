

# Liberar acesso ao app no Step 4 do Wizard

## O que muda

No arquivo `src/pages/BemVinda.tsx`, dentro do `useEffect` do Step 4 (linhas 198-223), adicionar a chamada para setar `onboarding_completed = true` no perfil da usuaria, em paralelo com o trigger de onboarding existente.

## Detalhes tecnicos

**Arquivo**: `src/pages/BemVinda.tsx`

**Trecho atual (linhas 198-223)**:
```ts
// Step 4 — Trigger onboarding
useEffect(() => {
  if (step !== 4 || triggerRef.current || !session) return;
  triggerRef.current = true;

  const trigger = async () => {
    try {
      const { data: onb } = await supabase
        .from('onboarding')
        .select('status')
        ...
    }
  };
  trigger();
}, [step, session]);
```

**Trecho novo**: Dentro da funcao `trigger`, antes do bloco try/catch existente, adicionar:

```ts
// Liberar acesso ao app
const { error: profileError } = await supabase
  .from('profiles')
  .update({
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  })
  .eq('id', session.user.id);

if (profileError) {
  console.error('[Onboarding] Erro ao atualizar onboarding_completed:', profileError);
}
```

**Botao "Ir para o aplicativo"**: Ja existe no Step 4 (adicionado na ultima edicao) com `navigate('/home')`. Nenhuma alteracao necessaria.

**ProtectedRoute**: Nenhuma alteracao. Ja checa `onboarding_completed` corretamente.

---

## Resumo

- 1 arquivo modificado: `src/pages/BemVinda.tsx`
- 1 insercao: chamada de update no `profiles` dentro do useEffect do Step 4
- 0 alteracoes em ProtectedRoute ou Edge Functions
