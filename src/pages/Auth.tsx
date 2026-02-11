import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoMonna from '@/assets/logo-monna.png';

export default function Auth() {
  const { user, loading, profile, profileLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Redireciona se já estiver logado (espera profile carregar para decidir destino)
  useEffect(() => {
    if (loading || !user) return;
    if (profileLoading) return;

    const checkAndRedirect = async () => {
      // Checar subscription ativa antes de redirecionar
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!subscription) {
        toast.error('Você precisa de uma assinatura ativa para acessar o app.');
        navigate('/#planos', { replace: true });
        return;
      }

      if (profile?.onboarding_completed) {
        navigate('/home', { replace: true });
      } else {
        navigate('/bem-vinda', { replace: true });
      }
    };

    checkAndRedirect();
  }, [user, loading, profile, profileLoading, navigate]);

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
