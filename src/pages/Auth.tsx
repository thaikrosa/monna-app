import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import logoMonna from '@/assets/logo-monna.png';

export default function Auth() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Redireciona se já estiver logado
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

  // IMPORTANTE: Mostrar UI imediatamente, não bloquear em loading
  // Se estiver logado, o useEffect acima redireciona
  // Se loading=true mas user=null, mostrar botão de login mesmo assim
  // (previne tela presa em loading por muito tempo)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 animate-fade-in bg-card rounded-xl p-8 border border-border shadow-elevated">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <img 
            src={logoMonna} 
            alt="Monna" 
            className="w-32 h-auto"
          />
          <p className="text-muted-foreground text-sm">
            Sua parceira no invisível da maternidade
          </p>
        </div>

        {/* Login Button - sempre visível */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          size="lg"
          className="w-full flex items-center justify-center gap-3 h-12 text-base"
          disabled={loading && user !== null}
        >
          <GoogleLogo weight="regular" className="w-5 h-5" />
          Continuar com Google
        </Button>

        {/* Legal links */}
        <p className="text-xs text-muted-foreground text-center">
          Ao continuar, você concorda com nossos{' '}
          <Link to="/termos" className="underline hover:text-foreground transition-colors duration-150">
            Termos de Uso
          </Link>
          {' '}e{' '}
          <Link to="/privacidade" className="underline hover:text-foreground transition-colors duration-150">
            Política de Privacidade
          </Link>
        </p>

        {/* Indicador sutil de loading (não bloqueia interação) */}
        {loading && (
          <p className="text-xs text-muted-foreground/60 animate-pulse">
            Verificando sessão...
          </p>
        )}
      </div>
    </div>
  );
}
