import { Card, CardContent } from '@/components/ui/card';
import { CalendarBlank } from '@phosphor-icons/react';

interface EventCardProps {
  startTime: string;
  endTime?: string;
  title: string;
  isAllDay?: boolean;
}

export function EventCard({ startTime, endTime, title, isAllDay }: EventCardProps) {
  return (
    <Card className={`border border-border shadow-sm ${isAllDay ? 'bg-secondary' : 'bg-card'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
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
        </div>
      </CardContent>
    </Card>
  );
}