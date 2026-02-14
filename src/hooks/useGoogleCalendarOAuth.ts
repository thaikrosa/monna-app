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

    // Store user_id and origin page in sessionStorage for callback
    sessionStorage.setItem("google_calendar_oauth_user_id", user.id);
    sessionStorage.setItem("google_calendar_oauth_redirect_uri", getRedirectUri());
    sessionStorage.setItem("google_calendar_oauth_origin", window.location.pathname);

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
    window.location.href = authUrl;
  }, [user, isConnecting, getRedirectUri]);

  const handleOAuthCallback = useCallback(
    async (code: string, state: string) => {
      if (isConnecting) return;

      setIsConnecting(true);

      try {
        const storedUserId = sessionStorage.getItem("google_calendar_oauth_user_id");
        const storedRedirectUri = sessionStorage.getItem("google_calendar_oauth_redirect_uri");

        const userId = storedUserId || state;
        const redirectUri = storedRedirectUri || `${window.location.origin}/oauth/callback`;

        if (!userId) {
          throw new Error("User ID not found");
        }

        const payload = {
          code,
          redirect_uri: redirectUri,
          user_id: userId,
        };

        // Call edge function to exchange code for tokens
        const { data, error } = await supabase.functions.invoke("save-google-calendar-token", {
          body: payload,
        });

        if (error) {
          throw new Error(error.message || "Erro ao conectar calendário");
        }

        if (data?.error === "no_refresh_token") {
          toast.error("Não foi possível autorizar edição no calendário. Tente revogar o acesso em myaccount.google.com/permissions e reconectar.");
          return { success: false, error: "no_refresh_token" };
        }

        if (data?.error) {
          throw new Error(data.message || data.error);
        }

        // Invalidate calendar connections query
        queryClient.invalidateQueries({ queryKey: ["calendar-connections"] });

        // Clear session storage
        sessionStorage.removeItem("google_calendar_oauth_user_id");
        sessionStorage.removeItem("google_calendar_oauth_redirect_uri");

        const successTime = new Date().toLocaleTimeString('pt-BR');
        toast.success(`Agenda conectada com sucesso! (${successTime})`);

        // Sync calendar events immediately after connection
        const { error: syncError } = await supabase.functions.invoke('sync-google-calendar', {
          body: { user_id: userId }
        });

        if (!syncError) {
          // Invalidate queries to refresh the home
          queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
          queryClient.invalidateQueries({ queryKey: ["home-dashboard"] });
        }

        return { success: true, data };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro ao conectar calendário";
        toast.error(message);
        return { success: false, error: message };
      } finally {
        setIsConnecting(false);
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
