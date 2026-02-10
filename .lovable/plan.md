

# Capitalizar lembretes no TodayRemindersCard

O unico local que ainda exibe o titulo do lembrete sem capitalizar e o componente `TodayRemindersCard.tsx` (linha 64).

Os demais componentes (`ReminderCard`, `RecurringReminderCard`, `RemindersSection`) ja usam `capitalizeFirst`.

## Mudanca

**Arquivo**: `src/components/home/TodayRemindersCard.tsx`

- Importar `capitalizeFirst` de `@/lib/reminder-utils`
- Linha 64: trocar `{reminder.title}` por `{capitalizeFirst(reminder.title)}`

Nenhum outro arquivo precisa ser alterado.

