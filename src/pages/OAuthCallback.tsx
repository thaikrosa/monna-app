import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoogleCalendarOAuth } from "@/hooks/useGoogleCalendarOAuth";
import { Spinner } from "@phosphor-icons/react";

type ProcessingStep = "exchanging" | "saving" | "syncing";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useGoogleCalendarOAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("exchanging");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Flag para garantir execução única
  const hasProcessed = useRef(false);

  const getProcessingMessage = () => {
    switch (processingStep) {
      case "exchanging":
        return "Trocando código por tokens...";
      case "saving":
        return "Salvando conexão...";
      case "syncing":
        return "Sincronizando eventos...";
      default:
        return "Conectando sua agenda...";
    }
  };

  useEffect(() => {
    const processCallback = async () => {
      // Evita duplo processamento
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Handle OAuth errors
      if (error) {
        setStatus("error");
        setErrorMessage(errorDescription || "Autorização cancelada ou negada");
        setTimeout(() => navigate("/configuracoes"), 3000);
        return;
      }

      if (!code) {
        setStatus("error");
        setErrorMessage("Código de autorização não encontrado");
        setTimeout(() => navigate("/configuracoes"), 3000);
        return;
      }

      try {
        setProcessingStep("exchanging");
        const result = await handleOAuthCallback(code, state || "");

        if (result?.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(result?.error || "Erro ao conectar calendário");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Erro inesperado");
      }

      // Redirect after processing — back to wizard if onboarding
      const redirectTarget = sessionStorage.getItem('onboarding_calendar_redirect')
        ? '/bem-vinda'
        : '/configuracoes';
      sessionStorage.removeItem('onboarding_calendar_redirect');
      setTimeout(() => navigate(redirectTarget), 2000);
    };

    processCallback();
  }, []); // Dependências vazias - executa apenas uma vez no mount

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm px-4">
        {status === "processing" && (
          <>
            <Spinner className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-foreground">{getProcessingMessage()}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-foreground font-medium">Agenda conectada com sucesso!</p>
            <p className="text-sm text-muted-foreground">
              Seus eventos serão sincronizados automaticamente.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-destructive font-medium">Erro ao conectar calendário</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Se o problema persistir, tente revogar o acesso em{" "}
              <a 
                href="https://myaccount.google.com/permissions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                myaccount.google.com/permissions
              </a>{" "}
              e reconectar.
            </p>
          </>
        )}

        <p className="text-sm text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}