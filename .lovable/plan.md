

# Fix: Redirect Loop After Google Login

## Root Cause

Three components form a redirect triangle:

```text
Auth.tsx (no subscription) ---> /#planos
       ^                            |
       |                            v
ProtectedRoute <--- /home <--- LandingPage (sees logged user, redirects)
(no subscription)
  ---> /#planos
```

LandingPage blindly redirects all logged-in users to `/home`, even those without a subscription who were intentionally sent to `/#planos`.

## Fix (3 files)

### 1. `src/pages/LandingPage.tsx` — Only redirect if user has active subscription

The redirect `useEffect` must check subscription status before redirecting. If user has no subscription, they should stay on the landing page to view/purchase plans.

```ts
useEffect(() => {
  if (loading || profileLoading) return;
  if (!user) return;
  if (location.hash.includes('access_token')) return;

  // Only redirect if user has completed onboarding AND has subscription
  // Users without subscription should stay here to see plans
  const checkAndRedirect = async () => {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (!subscription) return; // Stay on landing — user needs to subscribe

    if (profile?.onboarding_completed) {
      navigate('/home', { replace: true });
    } else {
      navigate('/bem-vinda', { replace: true });
    }
  };

  checkAndRedirect();
}, [user, loading, profile, profileLoading, navigate, location.hash]);
```

### 2. `src/pages/Auth.tsx` — No changes needed

The current logic is correct: wait for loading to finish, check subscription, redirect accordingly. The loop was caused by LandingPage, not Auth.tsx.

### 3. `src/components/ProtectedRoute.tsx` — Add guard against repeated toasts

The `SubscriptionGate` useEffect fires on every render causing repeated toasts. Add a `hasRedirected` ref to prevent multiple redirects/toasts:

```ts
const hasRedirected = useRef(false);

useEffect(() => {
  if (!subLoading && !subscription && !hasRedirected.current) {
    hasRedirected.current = true;
    toast.error('Voce precisa de uma assinatura ativa para acessar o app.');
    navigate('/#planos', { replace: true });
  }
}, [subLoading, subscription, navigate]);
```

## Summary

| File | Change |
|------|--------|
| `LandingPage.tsx` | Check subscription before redirecting logged-in users. No subscription = stay on landing. |
| `ProtectedRoute.tsx` | Add `hasRedirected` ref to prevent duplicate toast/redirect. |
| `Auth.tsx` | No changes needed. |

## Why this works

- User without subscription lands on `/#planos` and STAYS there (LandingPage no longer kicks them out)
- User WITH subscription who visits landing gets redirected to `/home` as expected
- ProtectedRoute remains the final safety net but won't cause loops because LandingPage no longer bounces users back

