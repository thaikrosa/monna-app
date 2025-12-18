-- HARDENING DE SEGURANÇA: Corrigir Function Search Path nas funções que ainda precisam
-- Apenas as funções SECURITY DEFINER que não têm SET search_path

-- Funções que ainda precisam de correção:
ALTER FUNCTION public.handle_recurring_reminder() SET search_path = public;
ALTER FUNCTION public.shopping_clear_checked_items(integer) SET search_path = public;
ALTER FUNCTION public.generate_reminder_occurrences(uuid, integer) SET search_path = public;
ALTER FUNCTION public.get_pending_notifications(integer) SET search_path = public;

-- Documentação
COMMENT ON FUNCTION public.handle_recurring_reminder() IS 'Trigger para gerar próxima recorrência - search_path fixo para segurança';
COMMENT ON FUNCTION public.shopping_clear_checked_items(integer) IS 'Limpa itens marcados - search_path fixo para segurança';
COMMENT ON FUNCTION public.generate_reminder_occurrences(uuid, integer) IS 'Gera ocorrências de lembretes - search_path fixo para segurança';
COMMENT ON FUNCTION public.get_pending_notifications(integer) IS 'Busca notificações pendentes - search_path fixo para segurança';