import { Skeleton } from '@/components/ui/skeleton';

export function HomeSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Greeting skeleton */}
      <div className="bg-annia-navy rounded-lg p-6">
        <Skeleton className="h-6 w-40 bg-primary-foreground/20 mb-3" />
        <Skeleton className="h-4 w-full bg-primary-foreground/10 mb-4" />
        <Skeleton className="h-10 w-full bg-primary-foreground/10 mb-2" />
        <Skeleton className="h-8 w-32 bg-primary-foreground/10" />
      </div>
      
      {/* Agenda skeleton */}
      <div className="bg-card border border-border/60 rounded-lg p-4">
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
      <div className="bg-card border border-border/60 rounded-lg p-4">
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
