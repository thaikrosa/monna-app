-- CORREÇÃO DE SEGURANÇA: Views de reminders também precisam de SECURITY INVOKER
-- Para respeitar as políticas RLS das tabelas reminders e reminder_occurrences

-- Recriar upcoming_reminders com SECURITY INVOKER
DROP VIEW IF EXISTS today_reminders;
DROP VIEW IF EXISTS upcoming_reminders;

CREATE VIEW upcoming_reminders
WITH (security_invoker = true)
AS
SELECT 
    r.id,
    r.user_id,
    r.title,
    r.description,
    r.category,
    r.priority,
    r.call_guarantee,
    o.id AS occurrence_id,
    o.scheduled_at,
    o.status AS occurrence_status
FROM reminders r
JOIN reminder_occurrences o ON r.id = o.reminder_id
WHERE r.status = 'active'::reminder_status 
  AND o.status = 'pending'::occurrence_status 
  AND o.scheduled_at >= now()
ORDER BY o.scheduled_at;

-- Recriar today_reminders com SECURITY INVOKER (depende de upcoming_reminders)
CREATE VIEW today_reminders
WITH (security_invoker = true)
AS
SELECT 
    id,
    user_id,
    title,
    description,
    category,
    priority,
    call_guarantee,
    occurrence_id,
    scheduled_at,
    occurrence_status
FROM upcoming_reminders
WHERE date(scheduled_at) = CURRENT_DATE;

-- Documentação
COMMENT ON VIEW upcoming_reminders IS 'View com SECURITY INVOKER - respeita RLS das tabelas reminders e reminder_occurrences';
COMMENT ON VIEW today_reminders IS 'View com SECURITY INVOKER - filtra lembretes de hoje da upcoming_reminders';