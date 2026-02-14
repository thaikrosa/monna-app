import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarBlank, PencilSimple, Trash } from '@phosphor-icons/react';

interface EventCardProps {
  startTime: string;
  endTime?: string;
  title: string;
  isAllDay?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EventCard({ startTime, endTime, title, isAllDay, onClick, onEdit, onDelete }: EventCardProps) {
  return (
    <Card
      className={`border border-border shadow-elevated ${isAllDay ? 'bg-secondary' : 'bg-card'} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-100' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <CalendarBlank weight="regular" className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-primary/80">
                {startTime}
              </span>
              {endTime && (
                <span className="text-xs text-muted-foreground">
                  → {endTime}
                </span>
              )}
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                >
                  <PencilSimple weight="regular" className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                >
                  <Trash weight="regular" className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
