import { useNavigate } from 'react-router-dom';
import { Baby, Syringe, Star, ArrowRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Child } from '@/hooks/useChildren';
import type { ChildInsight } from '@/hooks/useChildrenInsights';

interface KidsDashboardProps {
  children: Child[];
  insights: Record<string, ChildInsight>;
}

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  // Ajusta se ainda não fez aniversário este ano
  const adjustedMonths = months < 0 ? 12 + months : months;
  const adjustedYears = months < 0 ? years - 1 : years;
  
  if (adjustedYears === 0) {
    return `${adjustedMonths} ${adjustedMonths === 1 ? 'mês' : 'meses'}`;
  }
  
  if (adjustedYears < 2) {
    const totalMonths = adjustedYears * 12 + adjustedMonths;
    return `${totalMonths} meses`;
  }
  
  return `${adjustedYears} anos`;
}

export function KidsDashboard({ children, insights }: KidsDashboardProps) {
  const navigate = useNavigate();

  if (children.length === 0) {
    return null; // Não exibe se não há filhos cadastrados
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2 px-1">
        <Baby weight="thin" className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-foreground">Meus filhos</p>
      </div>

      <div className="grid gap-3">
        {children.slice(0, 3).map((child) => {
          const insight = insights[child.id];
          
          return (
            <div
              key={child.id}
              className="annia-glass rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {(child.nickname || child.name).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {child.nickname || child.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {calculateAge(child.birth_date)}
                    </span>
                  </div>

                  {/* Indicadores condicionais */}
                  <div className="flex items-center gap-2 mt-1">
                    {child.vaccination_reminders_enabled && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Syringe weight="thin" className="h-3 w-3" />
                        <span>Vacinas ativas</span>
                      </div>
                    )}
                    
                    {child.show_standard_milestones && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star weight="thin" className="h-3 w-3" />
                        <span>Marcos</span>
                      </div>
                    )}
                  </div>

                  {/* Insight do filho */}
                  {insight && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {insight.title}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => navigate(`/filhos`)}
                >
                  <ArrowRight weight="thin" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
