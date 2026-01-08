import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleCalendarOAuth } from '@/hooks/useGoogleCalendarOAuth';
import { Spinner } from '@phosphor-icons/react';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useGoogleCalendarOAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Handle OAuth errors
      if (error) {
        console.error('OAuth error:', error);
        setStatus('error');
        setErrorMessage('Autorização cancelada ou negada');
        setTimeout(() => navigate('/configuracoes'), 2000);
        return;
      }

      if (!code) {
        console.error('No code in callback');
        setStatus('error');
        setErrorMessage('Código de autorização não encontrado');
        setTimeout(() => navigate('/configuracoes'), 2000);
        return;
      }

      try {
        const result = await handleOAuthCallback(code, state || '');
        
        if (result?.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(result?.error || 'Erro ao conectar calendário');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Erro inesperado');
      }

      // Redirect after processing
      setTimeout(() => navigate('/configuracoes'), 1500);
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === 'processing' && (
          <>
            <Spinner className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-foreground">Conectando sua agenda...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-foreground">Agenda conectada com sucesso!</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-destructive">{errorMessage}</p>
          </>
        )}
        
        <p className="text-sm text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}
