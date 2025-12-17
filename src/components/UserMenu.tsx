import { SignOut } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function UserMenu() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Você saiu da sua conta.');
    } catch (error) {
      toast.error('Erro ao sair. Tente novamente.');
    }
  };

  const getInitials = () => {
    if (profile?.nickname) {
      return profile.nickname.slice(0, 2).toUpperCase();
    }
    if (profile?.first_name) {
      const first = profile.first_name[0] || '';
      const last = profile.last_name?.[0] || '';
      return (first + last).toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
            <AvatarFallback className="bg-muted text-foreground text-sm font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <SignOut weight="thin" className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
