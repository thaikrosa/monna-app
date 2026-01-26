import { useState, useEffect } from 'react';
import { MagnifyingGlass, Brain, WhatsappLogo, Desktop, X } from '@phosphor-icons/react';
import { useMemories } from '@/hooks/useMemories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  saude: 'Saúde',
  escola: 'Escola',
  alimentacao: 'Alimentação',
  rotina: 'Rotina',
  familia: 'Família',
  outros: 'Outros',
  all: 'Todas',
};

function SourceIcon({ source }: { source: string | null }) {
  if (source === 'whatsapp') {
    return <WhatsappLogo weight="regular" className="h-3 w-3" />;
  }
  return <Desktop weight="regular" className="h-3 w-3" />;
}

function MemoryCard({ memory }: { memory: {
  id: string;
  content: string;
  category: string;
  category_normalized: string;
  keywords: string[];
  source: string | null;
  created_at: string;
}}) {
  return (
    <div className="bg-background border border-border/50 rounded-lg p-4 break-inside-avoid mb-4 shadow-sm hover:shadow-elevated transition-shadow duration-200">
      {/* Content */}
      <p className="text-sm text-foreground leading-relaxed mb-3">
        {memory.content}
      </p>

      {/* Keywords */}
      {memory.keywords && memory.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {memory.keywords.slice(0, 4).map((keyword, idx) => (
            <span
              key={idx}
              className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-primary/70">
          {categoryLabels[memory.category_normalized] || memory.category}
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <SourceIcon source={memory.source} />
          </span>
          <span>
            {formatDistanceToNow(new Date(memory.created_at), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Memory() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useMemories({
    category: selectedCategory,
    search: debouncedSearch,
  });

  const memories = data?.memories || [];
  const categories = data?.categories || [];

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4">
      {/* Header */}
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Memória</h1>
        <p className="text-sm text-muted-foreground">
          Tudo que você me contou, guardado com carinho
        </p>
      </div>

      {/* Spotlight Search */}
      <div className="relative mb-4">
        <MagnifyingGlass
          weight="regular"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Buscar nas memórias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10 h-12 bg-background border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setSearch('')}
          >
            <X weight="regular" className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-shrink-0 rounded-lg px-4 h-9 text-sm font-normal transition-colors duration-150",
            selectedCategory === 'all'
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          onClick={() => setSelectedCategory('all')}
        >
          Todas
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="ghost"
            size="sm"
            className={cn(
              "flex-shrink-0 rounded-lg px-4 h-9 text-sm font-normal transition-colors duration-150",
              selectedCategory === cat
                ? "bg-primary/10 text-primary hover:bg-primary/15"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => setSelectedCategory(cat)}
          >
            {categoryLabels[cat] || cat}
          </Button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="columns-1 sm:columns-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-background border border-border/50 rounded-lg p-4 mb-4 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-16">
          <Brain weight="thin" className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {search || selectedCategory !== 'all' 
              ? 'Nenhuma memória encontrada'
              : 'Sua memória está vazia'
            }
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {search || selectedCategory !== 'all'
              ? 'Tente ajustar sua busca ou filtros'
              : 'Converse comigo pelo WhatsApp e eu guardarei tudo para você'
            }
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 gap-4">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      )}
    </div>
  );
}
