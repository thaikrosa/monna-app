

# Agenda: Trocar Fonte de Dados + Editar e Excluir Eventos

## Resumo

Trocar todas as consultas de `calendar_events` para `agenda_view`, criar modal de edicao de eventos, e adicionar exclusao com confirmacao (incluindo opcao para eventos recorrentes). Usar `instance_id` como React key.

---

## TAREFA 1: Trocar fonte de dados para `agenda_view`

### 1.1 Atualizar tipo `CalendarEvent`

**Arquivo**: `src/hooks/useTodayCalendarEvents.ts`

Atualizar a interface `CalendarEvent` para refletir as colunas da `agenda_view`:

- Renomear `id` para `instance_id`
- Adicionar `event_id`, `external_instance_id`, `description`, `is_recurring`, `source`
- Remover `external_calendar_id`, `created_at`, `updated_at`

### 1.2 Atualizar `useTodayCalendarEvents`

**Arquivo**: `src/hooks/useTodayCalendarEvents.ts`

- Trocar `.from('calendar_events')` para `.from('agenda_view')` (a tipagem vai usar `as` cast)
- A view ja filtra cancelados, nao precisa de filtro extra

### 1.3 Atualizar `useCalendarEventsByDate`

**Arquivo**: `src/hooks/useCalendarEventsByDate.ts`

- Trocar `.from('calendar_events')` para `.from('agenda_view')`
- Retornar tipado com a nova interface

### 1.4 Atualizar `useHomeDashboard`

**Arquivo**: `src/hooks/useHomeDashboard.ts`

- Trocar `.from('calendar_events')` para `.from('agenda_view')`

### 1.5 Atualizar React keys

**Arquivos**: `src/pages/Agenda.tsx`, `src/components/home/CalendarSection.tsx`

- Trocar `key={event.id}` para `key={event.instance_id}`

---

## TAREFA 2: Modal de Edicao de Evento

### 2.1 Novo componente `EditEventDialog`

**Novo arquivo**: `src/components/agenda/EditEventDialog.tsx`

Dialog centralizado (mesmo padrao do `AddEventDialog`) com:
- Campos: Titulo (input), Data (date), Hora inicio (time), Hora fim (time), Dia inteiro (switch), Local (input), Descricao (textarea)
- Pre-preenchido com dados do evento selecionado
- Botao "Salvar" que chama `update-google-calendar-event` via `supabase.functions.invoke`
- Envia apenas campos alterados + `user_id`, `event_id`, `instance_id` (se recorrente), `timezone`
- Loading state no botao durante a chamada
- Error handling com toast amigavel
- Apos sucesso: fecha modal, invalida queries `calendar-events`

### 2.2 Novo hook `useUpdateCalendarEvent`

**Novo arquivo**: `src/hooks/useUpdateCalendarEvent.ts`

Mutation hook similar ao `useCreateCalendarEvent`:
- Chama `supabase.functions.invoke('update-google-calendar-event', { body })`
- `onSuccess`: invalida `calendar-events`

### 2.3 Tornar `EventCard` clicavel

**Arquivo**: `src/components/agenda/EventCard.tsx`

- Adicionar prop `onClick`
- Adicionar `cursor-pointer` e feedback visual de toque (`active:scale-[0.98]`)

### 2.4 Integrar na pagina Agenda

**Arquivo**: `src/pages/Agenda.tsx`

- Adicionar estado `selectedEvent` para controlar qual evento esta sendo editado
- Ao clicar num `EventCard`, setar `selectedEvent` e abrir `EditEventDialog`
- Passar os dados completos do evento para o dialog

---

## TAREFA 3: Excluir Evento

### 3.1 Novo hook `useDeleteCalendarEvent`

**Novo arquivo**: `src/hooks/useDeleteCalendarEvent.ts`

Mutation hook:
- Chama `supabase.functions.invoke('delete-google-calendar-event', { body })`
- Body: `user_id`, `event_id`, `instance_id` (se recorrente), `delete_series`
- `onSuccess`: invalida `calendar-events`

### 3.2 Botao de excluir dentro do `EditEventDialog`

- Botao "Excluir evento" no rodape do modal, com estilo `variant="ghost"` e cor `text-destructive`
- Ao clicar: abre `AlertDialog` de confirmacao
  - Para eventos normais (`is_recurring === false`): confirmar "Excluir este evento?"
  - Para eventos recorrentes (`is_recurring === true`): duas opcoes:
    - "Excluir apenas este" -> `instance_id` preenchido, `delete_series: false`
    - "Excluir toda a serie" -> `delete_series: true`
- Loading state durante a chamada
- Apos sucesso: fecha tudo, toast de confirmacao, invalida queries

---

## Detalhes Tecnicos

### Arquivos novos (4)
| Arquivo | Descricao |
|---------|-----------|
| `src/components/agenda/EditEventDialog.tsx` | Modal de edicao de evento |
| `src/hooks/useUpdateCalendarEvent.ts` | Mutation hook para atualizar evento |
| `src/hooks/useDeleteCalendarEvent.ts` | Mutation hook para excluir evento |
| `src/components/agenda/DeleteEventAlert.tsx` | AlertDialog de confirmacao de exclusao (com suporte a recorrentes) |

### Arquivos modificados (5)
| Arquivo | Mudanca |
|---------|---------|
| `src/hooks/useTodayCalendarEvents.ts` | Interface + query para `agenda_view` |
| `src/hooks/useCalendarEventsByDate.ts` | Query para `agenda_view` |
| `src/hooks/useHomeDashboard.ts` | Query para `agenda_view` |
| `src/pages/Agenda.tsx` | Keys, click handler, EditEventDialog |
| `src/components/agenda/EventCard.tsx` | Prop `onClick` |
| `src/components/home/CalendarSection.tsx` | Keys com `instance_id` |

### Nao sera alterado
- `AddEventDialog` (criacao ja funciona)
- Nenhuma outra funcionalidade do app

### Nota sobre tipagem
A `agenda_view` nao esta no `types.ts` gerado. As queries vao usar cast `as AgendaEvent[]` no retorno do Supabase, como ja e feito em outros hooks do projeto. Quando os types forem regenerados, o cast pode ser removido.
