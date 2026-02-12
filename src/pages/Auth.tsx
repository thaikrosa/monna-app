import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';
import logoMonna from '@/assets/logo-monna.png';

export default function Auth() {
  const { user, isReady, userState, signInWithGoogle } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isReady) return;

    if (userState === 'READY') {
      navigate('/home', { replace: true });
    } else if (userState === 'ONBOARDING') {
      navigate('/bem-vinda', { replace: true });
    } else if (userState === 'NO_SUBSCRIPTION') {
      toast.error('Você precisa de uma assinatura ativa para acessar o app.');
      navigate('/#planos', { replace: true });
    }
  }, [isReady, userState, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Erro ao entrar com Google. Tente novamente.');
    }
  };

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
          <p className="text-muted-foreground text-sm text-center">
            Sua parceira no invisível da maternidade
          </p>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          size="lg"
          className="w-full flex items-center justify-center gap-3 h-12 text-base"
          disabled={!isReady && user !== null}
        >
          <GoogleLogo weight="regular" className="w-5 h-5" />
          Continuar com Google
        </Button>

        {/* OAuth transparency text */}
        <p className="text-xs text-muted-foreground text-center">
          Usamos sua conta Google apenas para autenticação e, se autorizado por você, para integração com o Google Calendar.
        </p>

        {/* Legal links */}
        <p className="text-xs text-muted-foreground text-center">
          Ao continuar, você concorda com nossos{' '}
          <a href="/static/termos.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors duration-150">
            Termos de Uso
          </a>
          {' '}e{' '}
          <a href="/static/privacidade.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors duration-150">
            Política de Privacidade
          </a>
        </p>

        {/* Loading indicator */}
        {!isReady && (
          <p className="text-xs text-muted-foreground/60 animate-pulse">
            Verificando sessão...
          </p>
        )}
      </div>
    </div>
  );
}
