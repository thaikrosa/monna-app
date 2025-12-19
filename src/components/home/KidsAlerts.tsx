import { Baby } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { KidAlert } from '@/types/home-dashboard';
import { useNavigate } from 'react-router-dom';

interface KidsAlertsProps {
  kids: KidAlert[];
}

export function KidsAlerts({ kids }: KidsAlertsProps) {
  const navigate = useNavigate();

  // Show max 2 alerts
  const displayKids = kids.slice(0, 2);

  if (displayKids.length === 0) return null;

  return (
    <div className="space-y-3">
      {displayKids.map((kid) => (
        <div key={kid.id} className="bg-card border border-border/60 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Baby weight="regular" className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-card-foreground">{kid.child_name}</h4>
                <span className="text-xs text-muted-foreground">{kid.age_label}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {kid.message}
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => {
                    if (kid.primaryCta.action === 'open_child') {
                      navigate('/filhos');
                    }
                  }}
                  className="bg-annia-olive hover:bg-annia-olive-hover text-primary-foreground transition-colors duration-200"
                >
                  {kid.primaryCta.label}
                </Button>
                
                {kid.secondaryCta && (
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {kid.secondaryCta.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
