import { Card, CardContent } from '@/components/ui/card';

interface EventCardProps {
  startTime: string;
  endTime?: string;
  title: string;
  isAllDay?: boolean;
}

export function EventCard({ startTime, endTime, title, isAllDay }: EventCardProps) {
  return (
    <Card className={isAllDay ? 'bg-secondary/40 border-border/30' : 'bg-card border-border/30'}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 min-w-[60px]">
            <span className="text-sm font-semibold text-primary">
              {startTime}
            </span>
            {endTime && (
              <span className="text-xs text-muted-foreground block">
                até {endTime}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
