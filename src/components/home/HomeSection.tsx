import { ReactNode } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HomeSectionProps {
  icon: ReactNode;
  title: string;
  count?: number;
  onAdd?: () => void;
  addDisabled?: boolean;
  addDisabledLabel?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
  children: ReactNode;
  emptyState?: ReactNode;
}

export function HomeSection({
  icon,
  title,
  count,
  onAdd,
  addDisabled,
  addDisabledLabel,
  onViewAll,
  viewAllLabel = 'Ver todos',
  children,
  emptyState,
}: HomeSectionProps) {
  const hasContent = !emptyState;

  return (
    <div className="bg-background rounded-lg p-5 animate-fade-in border border-border/50 shadow-elevated">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
            <span className="text-primary">{icon}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{title}</p>
            {count !== undefined && count > 0 && (
              <span className="text-xs text-muted-foreground">({count})</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && hasContent && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-auto py-1 px-2"
              onClick={onViewAll}
            >
              {viewAllLabel}
            </Button>
          )}

          {onAdd && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onAdd}
                      disabled={addDisabled}
                    >
                      <Plus weight="regular" className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {addDisabled && addDisabledLabel && (
                  <TooltipContent>
                    <p>{addDisabledLabel}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {emptyState ? emptyState : children}
    </div>
  );
}
