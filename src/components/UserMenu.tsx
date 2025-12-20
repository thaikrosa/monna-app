import { Link, useNavigate } from 'react-router-dom';
import { SignOut, UserCircle, Gear, CaretRight, House } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  const displayName = profile?.nickname || profile?.first_name || 'Usuário';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-transform hover:scale-105">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 annia-glass p-0">
        {/* Header with large avatar - clickable to go Home */}
        <button
          onClick={() => navigate('/')}
          className="w-full p-4 flex items-center gap-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer text-left"
        >
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
            <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-semibold text-foreground">
              {displayName}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </button>
        
        {/* Navigation links */}
        <div className="py-2">
          <DropdownMenuItem asChild className="cursor-pointer px-4 py-3">
            <Link to="/" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <House weight="thin" className="h-5 w-5 text-muted-foreground" />
                <span>Home</span>
              </div>
              <CaretRight weight="thin" className="h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer px-4 py-3">
            <Link to="/perfil" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <UserCircle weight="thin" className="h-5 w-5 text-muted-foreground" />
                <span>Meu perfil</span>
              </div>
              <CaretRight weight="thin" className="h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="cursor-pointer px-4 py-3">
            <Link to="/configuracoes" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Gear weight="thin" className="h-5 w-5 text-muted-foreground" />
                <span>Configurações</span>
              </div>
              <CaretRight weight="thin" className="h-4 w-4 text-muted-foreground" />
            </Link>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <div className="py-2">
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="cursor-pointer px-4 py-3 text-destructive focus:text-destructive"
          >
            <SignOut weight="thin" className="mr-3 h-5 w-5" />
            Sair
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
