import { useState, useCallback } from "react";
import { useSession } from '@/contexts/SessionContext';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar.events", "openid", "email", "profile"];

export function useGoogleCalendarOAuth() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  const getRedirectUri = useCallback(() => {
    return `${window.location.origin}/oauth/callback`;
  }, []);

  const initiateCalendarOAuth = useCallback(() => {
    if (!user) {
      toast.error("Você precisa estar logada para conectar o calendário");
      return;
    }

    if (isConnecting) return;

    // Store user_id in sessionStorage for callback
    sessionStorage.setItem("google_calendar_oauth_user_id", user.id);
    sessionStorage.setItem("google_calendar_oauth_redirect_uri", getRedirectUri());

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: getRedirectUri(),
      response_type: "code",
      scope: CALENDAR_SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent", // Force consent to ensure refresh_token
      state: user.id, // Pass user_id as state for verification
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log("[OAuth] Iniciando fluxo OAuth...");
    console.log("[OAuth] User ID:", user.id);
    console.log("[OAuth] Redirect URI:", getRedirectUri());
    console.log("[OAuth] Usando prompt: consent para forçar novo refresh_token");

    window.location.href = authUrl;
  }, [user, isConnecting, getRedirectUri]);

  const handleOAuthCallback = useCallback(
    async (code: string, state: string) => {
      if (isConnecting) return;

      setIsConnecting(true);
      const timestamp = new Date().toISOString();

      try {
        const storedUserId = sessionStorage.getItem("google_calendar_oauth_user_id");
        const storedRedirectUri = sessionStorage.getItem("google_calendar_oauth_redirect_uri");

        console.log("[OAuth] ========== CALLBACK INICIADO ==========");
        console.log("[OAuth] Timestamp:", timestamp);
        console.log("[OAuth] Code recebido:", code ? `${code.substring(0, 20)}...` : "VAZIO");
        console.log("[OAuth] State recebido:", state);
        console.log("[OAuth] Stored User ID:", storedUserId);
        console.log("[OAuth] Stored Redirect URI:", storedRedirectUri);

        // Verify state matches
        if (state !== storedUserId) {
          console.warn("[OAuth] State mismatch! state:", state, "storedUserId:", storedUserId);
        }

        const userId = storedUserId || state;
        const redirectUri = storedRedirectUri || `${window.location.origin}/oauth/callback`;

        if (!userId) {
          console.error("[OAuth] ERRO: User ID não encontrado!");
          throw new Error("User ID not found");
        }

        const payload = {
          code,
          redirect_uri: redirectUri,
          user_id: userId,
        };

        console.log("[OAuth] Chamando Edge Function save-google-calendar-token...");
        console.log("[OAuth] Payload:", JSON.stringify({ ...payload, code: payload.code.substring(0, 20) + "..." }, null, 2));

        // Call edge function to exchange code for tokens
        const { data, error } = await supabase.functions.invoke("save-google-calendar-token", {
          body: payload,
        });

        console.log("[OAuth] ========== RESPOSTA DA EDGE FUNCTION ==========");
        console.log("[OAuth] Data:", JSON.stringify(data, null, 2));
        console.log("[OAuth] Error:", error ? JSON.stringify(error, null, 2) : "null");

        if (error) {
          console.error("[OAuth] ERRO da Edge Function:", error);
          throw new Error(error.message || "Erro ao conectar calendário");
        }

        if (data?.error === "no_refresh_token") {
          console.error("[OAuth] ERRO: Refresh token não recebido do Google!");
          toast.error("Não foi possível autorizar edição no calendário. Tente revogar o acesso em myaccount.google.com/permissions e reconectar.");
          return { success: false, error: "no_refresh_token" };
        }

        if (data?.error) {
          console.error("[OAuth] ERRO retornado:", data.error, data.message);
          throw new Error(data.message || data.error);
        }

        console.log("[OAuth] ========== SUCESSO ==========");
        console.log("[OAuth] Email conectado:", data.email);
        console.log("[OAuth] Google User ID:", data.google_user_id);
        console.log("[OAuth] Tokens salvos com sucesso!");

        // Invalidate calendar connections query
        queryClient.invalidateQueries({ queryKey: ["calendar-connections"] });

        // Clear session storage
        sessionStorage.removeItem("google_calendar_oauth_user_id");
        sessionStorage.removeItem("google_calendar_oauth_redirect_uri");

        const successTime = new Date().toLocaleTimeString('pt-BR');
        toast.success(`Agenda conectada com sucesso! (${successTime})`);

        // Sync calendar events immediately after connection
        console.log("[OAuth] Iniciando sync de eventos...");
        const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-google-calendar', {
          body: { user_id: userId }
        });

        if (syncError) {
          console.error("[OAuth] ERRO no sync:", syncError);
        } else {
          console.log("[OAuth] Sync concluído!", syncData);
          // Invalidate queries to refresh the home
          queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
          queryClient.invalidateQueries({ queryKey: ["home-dashboard"] });
        }

        return { success: true, data };
      } catch (error: any) {
        console.error("[OAuth] ========== ERRO FATAL ==========");
        console.error("[OAuth] Mensagem:", error.message);
        console.error("[OAuth] Stack:", error.stack);
        toast.error(error.message || "Erro ao conectar calendário");
        return { success: false, error: error.message };
      } finally {
        setIsConnecting(false);
        console.log("[OAuth] ========== CALLBACK FINALIZADO ==========");
      }
    },
    [isConnecting, queryClient],
  );

  return {
    isConnecting,
    initiateCalendarOAuth,
    handleOAuthCallback,
  };
}
