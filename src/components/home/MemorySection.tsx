import { Brain, WhatsappLogo, Desktop } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { HomeSection } from './HomeSection';
import { useRecentMemories } from '@/hooks/useMemories';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const categoryLabels: Record<string, string> = {
  saude: 'Saúde',
  escola: 'Escola',
  alimentacao: 'Alimentação',
  rotina: 'Rotina',
  familia: 'Família',
  outros: 'Outros',
};

function SourceBadge({ source }: { source: string | null }) {
  if (source === 'whatsapp') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <WhatsappLogo weight="regular" className="h-3 w-3" />
        WhatsApp
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Desktop weight="regular" className="h-3 w-3" />
      App
    </span>
  );
}

export function MemorySection() {
  const navigate = useNavigate();
  const { data, isLoading } = useRecentMemories(3);

  const memories = data?.memories || [];

  if (isLoading) {
    return (
      <HomeSection
        icon={<Brain weight="regular" className="h-5 w-5" />}
        title="Memória"
        onViewAll={() => navigate('/memoria')}
        viewAllLabel="Ver tudo"
      >
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      </HomeSection>
    );
  }

  const emptyState = memories.length === 0 ? (
    <div className="text-center py-6">
      <Brain weight="thin" className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">
        Suas memórias aparecerão aqui
      </p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        Converse comigo pelo WhatsApp para começar
      </p>
    </div>
  ) : undefined;

  return (
    <HomeSection
      icon={<Brain weight="regular" className="h-5 w-5" />}
      title="Memória"
      count={memories.length}
      onViewAll={() => navigate('/memoria')}
      viewAllLabel="Ver tudo"
      emptyState={emptyState}
    >
      <div className="space-y-2">
        {memories.map((memory) => (
          <button
            key={memory.id}
            onClick={() => navigate('/memoria')}
            className="w-full text-left bg-muted/30 hover:bg-muted/50 rounded-lg p-3 transition-colors duration-150"
          >
            <p className="text-sm text-foreground line-clamp-2 mb-2">
              {memory.content}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary/70 font-medium">
                {categoryLabels[memory.category_normalized] || memory.category}
              </span>
              <div className="flex items-center gap-2">
                <SourceBadge source={memory.source} />
                <span className="text-xs text-muted-foreground">
                  {memory.created_at ? formatDistanceToNow(new Date(memory.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  }) : ''}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </HomeSection>
  );
}
