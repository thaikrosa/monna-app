import { Button } from '@/components/ui/button';
import { PencilSimple, Trash, Syringe } from '@phosphor-icons/react';
import { Child } from '@/hooks/useChildren';
import { calculateAge } from '@/lib/date-utils';

interface ChildCardProps {
  child: Child;
  onEdit: () => void;
  onDelete: () => void;
}

export function ChildCard({ child, onEdit, onDelete }: ChildCardProps) {
  const displayName = child.nickname || child.name;
  const age = calculateAge(child.birth_date);
  
  // Build health summary
  const healthParts: string[] = [];
  if (child.blood_type) healthParts.push(`Tipo ${child.blood_type}`);
  if (child.allergies) healthParts.push(`Alergias: ${child.allergies}`);
  const healthSummary = healthParts.join(' · ');

  return (
    <div className="bg-card p-4 rounded-lg border border-border shadow-elevated group transition-all duration-150 hover:border-primary/50 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{displayName}</h3>
            {child.vaccination_reminders_enabled && (
              <Syringe weight="regular" className="h-4 w-4 text-primary/70 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{age}</p>
          {healthSummary && (
            <p className="text-xs text-primary/70 mt-1 truncate">{healthSummary}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            <PencilSimple weight="thin" className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            <Trash weight="thin" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
