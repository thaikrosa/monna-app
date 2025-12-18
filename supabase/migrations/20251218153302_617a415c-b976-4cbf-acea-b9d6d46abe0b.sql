-- CORREÇÃO CRÍTICA DE SEGURANÇA
-- A view v_shopping_items_with_frequency estava expondo dados de todos os usuários
-- porque não usava SECURITY INVOKER

-- Recriar a view com SECURITY INVOKER para respeitar RLS das tabelas subjacentes
DROP VIEW IF EXISTS v_shopping_items_with_frequency;

CREATE VIEW v_shopping_items_with_frequency
WITH (security_invoker = true)
AS
SELECT 
    i.id,
    i.user_id,
    i.tag_id,
    t.name AS tag_name,
    i.name,
    i.quantity_text,
    i.notes,
    i.is_checked,
    i.checked_at,
    i.last_purchased_at,
    i.created_at,
    i.updated_at,
    s.avg_days_between,
    s.intervals_count,
    s.last_checked_at,
    s.last_calculated_at
FROM shopping_items i
LEFT JOIN shopping_tags t ON t.id = i.tag_id
LEFT JOIN shopping_item_stats s ON s.user_id = i.user_id AND s.item_id = i.id;

-- Comentário para documentação
COMMENT ON VIEW v_shopping_items_with_frequency IS 'View com SECURITY INVOKER - respeita RLS das tabelas shopping_items, shopping_tags e shopping_item_stats';