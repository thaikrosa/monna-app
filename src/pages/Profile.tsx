import { Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { useSession } from '@/contexts/SessionContext';
import { useProfile } from '@/hooks/useProfile';
import { PersonalDataSection } from '@/components/profile/PersonalDataSection';
import { ChildrenSection } from '@/components/profile/ChildrenSection';
import { ContactsPreview } from '@/components/profile/ContactsPreview';

export default function Profile() {
  const { user } = useSession();
  const { data: profile, isLoading: profileLoading, isError, refetch } = useProfile();

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <ErrorState
            message="Erro ao carregar perfil"
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/home">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
              >
                <CaretLeft weight="thin" className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Como a Monna te conhece</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <PersonalDataSection profile={profile} userEmail={user?.email} />
        <ChildrenSection />
        <ContactsPreview />
      </div>
    </div>
  );
}
