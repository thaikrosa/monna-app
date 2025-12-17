import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { profile } = useAuth();

  const displayName = profile?.nickname || profile?.first_name || 'você';

  return (
    <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Olá, {displayName} 👋
      </h1>
      <p className="text-muted-foreground">
        Central de Comando em construção.
      </p>
    </div>
  );
}
