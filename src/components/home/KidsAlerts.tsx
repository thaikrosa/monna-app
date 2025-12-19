import { Button } from '@/components/ui/button';
import { KidAlert } from '@/types/home-dashboard';
import { useNavigate } from 'react-router-dom';

interface KidsAlertsProps {
  kids: KidAlert[];
}

const getAvatarColors = (index: number) => {
  const colors = [
    'bg-primary/10 text-primary',
    'bg-secondary text-secondary-foreground', 
    'bg-accent text-accent-foreground',
  ];
  return colors[index % colors.length];
};

export function KidsAlerts({ kids }: KidsAlertsProps) {
  const navigate = useNavigate();

  // Show max 2 alerts
  const displayKids = kids.slice(0, 2);

  if (displayKids.length === 0) return null;

  return (
    <div className="space-y-3">
      {displayKids.map((kid, index) => (
        <div 
          key={kid.id} 
          className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${getAvatarColors(index)}`}>
              <span className="text-sm font-semibold">{kid.child_name.charAt(0).toUpperCase()}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-medium text-foreground">{kid.child_name}</h4>
                <span className="text-xs text-muted-foreground">{kid.age_label}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                Próximos marcos de desenvolvimento
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => {
                    if (kid.primaryCta.action === 'open_child') {
                      navigate('/filhos');
                    }
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
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
