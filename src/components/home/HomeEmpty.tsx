import { Sparkle, Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function HomeEmpty() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <Sparkle weight="regular" className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Estou pronta para ajudar
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Adicione seus filhos, lembretes e compromissos para que eu organize seu dia.
      </p>
      
      <div className="space-y-3 w-full max-w-xs">
        <Button 
          onClick={() => navigate('/filhos')}
          className="w-full bg-annia-olive hover:bg-annia-olive-hover text-primary-foreground transition-colors duration-200"
        >
          <Plus weight="regular" className="w-4 h-4 mr-2" />
          Adicionar filho
        </Button>
        <Button 
          onClick={() => navigate('/lembretes')}
          variant="outline"
          className="w-full transition-colors duration-200"
        >
          <Plus weight="regular" className="w-4 h-4 mr-2" />
          Criar lembrete
        </Button>
      </div>
    </div>
  );
}
