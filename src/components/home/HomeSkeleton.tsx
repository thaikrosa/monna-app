import { Skeleton } from '@/components/ui/skeleton';
import logoMonnaDark from '@/assets/logo-monna.png';

export function HomeSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Logo Monna como indicador de loading */}
      <div className="flex justify-center py-6">
        <img 
          src={logoMonnaDark} 
          alt="" 
          className="h-8 w-auto animate-pulse"
        />
      </div>
      
      {/* Greeting skeleton */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-elevated">
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-8 w-32" />
      </div>
      
      {/* Agenda skeleton */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-elevated">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      
      {/* Reminders skeleton */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-elevated">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
