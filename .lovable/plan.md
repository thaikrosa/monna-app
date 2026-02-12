

# Fix: SessionProvider -- Loading lento + Skeletons eternos

## Causa raiz unica

O `SessionProvider` atual faz `getSession()` manual E registra `onAuthStateChange`. Dentro do callback do `onAuthStateChange`, as queries de profile/subscription sao `await`ed diretamente, causando deadlock no lock interno do Supabase SDK. Isso trava o estado em `LOADING` para usuarias autenticadas, e consequentemente os hooks de dados (`useShoppingList`, `useReminders`, etc.) nunca recebem `user`, mantendo `enabled: false` e skeletons eternos.

## Solucao

Alterar APENAS `src/contexts/SessionContext.tsx`:

1. **Remover** a funcao `initialize()` e a chamada `getSession()` manual (linhas 97-130)
2. **Usar** `onAuthStateChange` como fonte UNICA de sessao -- o evento `INITIAL_SESSION` do Supabase v2 ja fornece a sessao no mount
3. **Envolver** as queries de profile/subscription em `setTimeout(fn, 0)` dentro do callback, para que executem APOS o lock interno do Supabase liberar
4. **Remover** `fetchUserData` e `computeState` do array de dependencias do `useEffect` (usar `[]` vazio, pois o listener so precisa ser registrado uma vez)

## Codigo final do useEffect

```typescript
useEffect(() => {
  let cancelled = false;

  const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
    (event, currentSession) => {
      if (cancelled) return;

      if (!currentSession) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setSubscription(null);
        setUserState('ANONYMOUS');
        return;
      }

      setSession(currentSession);
      setUser(currentSession.user);

      // setTimeout(0) libera o lock interno do Supabase antes de fazer queries
      setTimeout(async () => {
        if (cancelled) return;
        try {
          const [profileRes, subRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', currentSession.user.id).single(),
            supabase.from('subscriptions').select('*').eq('user_id', currentSession.user.id).eq('status', 'active').maybeSingle(),
          ]);
          if (cancelled) return;
          setProfile((profileRes.data as Profile) ?? null);
          setSubscription((subRes.data as Subscription) ?? null);
          setUserState(computeState(currentSession, profileRes.data ?? null, subRes.data ?? null));
        } catch (error) {
          console.error('[Session] fetch error:', error);
          if (!cancelled) setUserState('ERROR');
        }
      }, 0);
    }
  );

  return () => {
    cancelled = true;
    authListener.unsubscribe();
  };
}, []);
```

## O que muda

- Remover linhas 94-130 (funcao `initialize()` + chamada)
- Substituir linhas 132-164 pelo novo bloco acima
- O `fetchUserData` pode ser mantido como funcao auxiliar para o `refetch()`, mas NAO e mais usado no useEffect
- Dependencias do useEffect mudam de `[fetchUserData, computeState]` para `[]`

## O que NAO muda

- Nenhum outro arquivo
- Tipos, interfaces, `refetch()`, `signOut()`, `signInWithGoogle()` permanecem identicos
- Nenhum componente visual, hook de dados, ou rota
