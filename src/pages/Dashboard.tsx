import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ListChecks, UsersThree, Baby, Bell, CaretRight } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useTodayRemindersCount } from '@/hooks/useReminders';

export default function Dashboard() {
  const { profile } = useAuth();
  const displayName = profile?.nickname || profile?.first_name || 'você';

  // Fetch pending items count
  const { data: pendingCount = 0, isLoading } = useQuery({
    queryKey: ['shopping-pending-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('v_shopping_items_with_frequency')
        .select('*', { count: 'exact', head: true })
        .eq('is_checked', false);

      if (error) throw error;
      return count ?? 0;
    },
  });

  // Fetch contacts count
  const { data: contactsCount = 0, isLoading: isContactsLoading } = useQuery({
    queryKey: ['contacts-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count ?? 0;
    },
  });

  // Fetch children count
  const { data: childrenCount = 0, isLoading: isChildrenLoading } = useQuery({
    queryKey: ['children-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('children')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count ?? 0;
    },
  });

  // Fetch today's reminders count using the new hook
  const { data: todayRemindersCount = 0, isLoading: isRemindersLoading } = useTodayRemindersCount();

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in">
      {/* Greeting */}
      <header className="text-center mb-10">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Olá, {displayName} 👋
        </h1>
        <p className="text-muted-foreground">
          Central de Comando
        </p>
      </header>

      {/* Quick Access Cards */}
      <div className="grid gap-4">
        <Link to="/lista" className="block group">
          <div className="annia-glass p-4 rounded-lg border border-border/30 transition-all duration-150 group-hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ListChecks weight="thin" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Lista de Compras</h3>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? (
                      'Carregando...'
                    ) : pendingCount === 0 ? (
                      'Nenhum item pendente'
                    ) : pendingCount === 1 ? (
                      '1 item pendente'
                    ) : (
                      `${pendingCount} itens pendentes`
                    )}
                  </p>
                </div>
              </div>
              <CaretRight weight="thin" className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all duration-150" />
            </div>
          </div>
        </Link>

        {/* Rede de Apoio Card */}
        <Link to="/rede-apoio" className="block group">
          <div className="annia-glass p-4 rounded-lg border border-border/30 transition-all duration-150 group-hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UsersThree weight="thin" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Rede de Apoio</h3>
                  <p className="text-sm text-muted-foreground">
                    {isContactsLoading ? (
                      'Carregando...'
                    ) : contactsCount === 0 ? (
                      'Nenhum contato'
                    ) : contactsCount === 1 ? (
                      '1 contato'
                    ) : (
                      `${contactsCount} contatos`
                    )}
                  </p>
                </div>
              </div>
              <CaretRight weight="thin" className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all duration-150" />
            </div>
          </div>
        </Link>

        {/* Meus Filhos Card */}
        <Link to="/filhos" className="block group">
          <div className="annia-glass p-4 rounded-lg border border-border/30 transition-all duration-150 group-hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Baby weight="thin" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Meus Filhos</h3>
                  <p className="text-sm text-muted-foreground">
                    {isChildrenLoading ? (
                      'Carregando...'
                    ) : childrenCount === 0 ? (
                      'Nenhuma criança'
                    ) : childrenCount === 1 ? (
                      '1 criança'
                    ) : (
                      `${childrenCount} crianças`
                    )}
                  </p>
                </div>
              </div>
              <CaretRight weight="thin" className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all duration-150" />
            </div>
          </div>
        </Link>

        {/* Lembretes Card */}
        <Link to="/lembretes" className="block group">
          <div className="annia-glass p-4 rounded-lg border border-border/30 transition-all duration-150 group-hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell weight="thin" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Lembretes</h3>
                  <p className="text-sm text-muted-foreground">
                    {isRemindersLoading ? (
                      'Carregando...'
                    ) : todayRemindersCount === 0 ? (
                      'Mente livre hoje'
                    ) : todayRemindersCount === 1 ? (
                      '1 lembrete hoje'
                    ) : (
                      `${todayRemindersCount} lembretes hoje`
                    )}
                  </p>
                </div>
              </div>
              <CaretRight weight="thin" className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all duration-150" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
