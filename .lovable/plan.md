

# Criar Edge Function trigger-onboarding com webhook n8n

## Resumo

Criar a Edge Function `trigger-onboarding` que valida o JWT da usuaria autenticada, extrai o `user_id` do token, e faz um POST para o webhook do n8n para disparar o template WhatsApp.

---

## Arquivo criado

### `supabase/functions/trigger-onboarding/index.ts`

- Handler para OPTIONS (CORS preflight)
- Valida JWT manualmente via Supabase client (`supabase.auth.getUser()` com o token do header Authorization)
- Extrai `user_id` do JWT (claim `sub`), **nao aceita user_id do body**
- Faz `fetch` POST para `https://n8nwebhook.n8nthais.cloud/webhook/onboarding-trigger` com body `{ user_id }`
- Retorna `{ success: true }` em caso de sucesso
- Retorna 401 se JWT invalido/ausente
- Retorna 500 se o POST ao n8n falhar
- CORS headers padrao em todas as respostas

## Arquivo modificado

### `supabase/config.toml`

Adicionar:
```toml
[functions.trigger-onboarding]
verify_jwt = false
```

A validacao JWT e feita no codigo (compativel com signing-keys). O `user_id` vem exclusivamente do token, impedindo chamadas com IDs arbitrarios.

---

## Secao tecnica

```typescript
// Fluxo simplificado:
const token = req.headers.get('Authorization')?.replace('Bearer ', '');
const { data: { user } } = await supabase.auth.getUser(token);
const userId = user.id;

await fetch('https://n8nwebhook.n8nthais.cloud/webhook/onboarding-trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: userId }),
});
```

Nenhuma dependencia nova. Nenhuma secret adicional necessaria.

