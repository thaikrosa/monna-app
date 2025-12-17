import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Auth() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Erro ao entrar com Google. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Annia
          </h1>
          <p className="text-muted-foreground text-sm">
            Sua Central de Comando
          </p>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          size="lg"
          className="w-full flex items-center justify-center gap-3 h-12 text-base"
        >
          <GoogleLogo weight="regular" className="w-5 h-5" />
          Continuar com Google
        </Button>
      </div>
    </div>
  );
}
