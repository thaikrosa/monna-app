

# Update Pricing Modal Copy

## Summary

Replace the text content in `PlanSelectionDialog` with the new copy. No structural or styling changes — only text updates.

## Changes in `src/components/landing/PlanSelectionDialog.tsx`

| Element | Current | New |
|---------|---------|-----|
| DialogTitle | "Escolha seu plano" | "Respira. A Monna cuida do resto." |
| DialogDescription | "7 dias gratis em qualquer plano. Cancele quando quiser." | "Sua paz mental por menos de R$1 ao dia." |
| Annual card badge | "Melhor valor" (keep) | No change |
| Annual card — add plan name above price | (none) | Add `"Anual"` label in `text-sm font-medium text-muted-foreground` |
| Annual card "Economize 14%" badge | Keep badge, change text | "2 meses gratis" (with gift emoji prefix) |
| Monthly card — add plan name above price | (none) | Add `"Mensal"` label in `text-sm font-medium text-muted-foreground` |
| CTA button | "Comecar meu teste gratis" | "TESTAR 7 DIAS GRATIS" (uppercase) |
| Cancel text | "Nao gostou? Cancele com uma mensagem no WhatsApp. Sem burocracia." | "Nao gostou? Cancele com um zap." |

## Technical details

- All text changes are string replacements within existing JSX elements
- Plan name labels use existing semantic text classes (`text-sm`, `font-medium`, `text-muted-foreground`)
- No new components, dependencies, or design tokens needed
- The `Star` import (unused) can be removed as cleanup

