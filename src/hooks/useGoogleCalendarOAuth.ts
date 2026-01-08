import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar.events", "openid", "email", "profile"];

export function useGoogleCalendarOAuth() {
  const { user } = useAuth();
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

    console.log("Initiating Google Calendar OAuth...");
    console.log("Redirect URI:", getRedirectUri());

    window.location.href = authUrl;
  }, [user, isConnecting, getRedirectUri]);

  const handleOAuthCallback = useCallback(
    async (code: string, state: string) => {
      if (isConnecting) return;

      setIsConnecting(true);

      try {
        const storedUserId = sessionStorage.getItem("google_calendar_oauth_user_id");
        const storedRedirectUri = sessionStorage.getItem("google_calendar_oauth_redirect_uri");

        // Verify state matches
        if (state !== storedUserId) {
          console.warn("State mismatch, but proceeding with stored user_id");
        }

        const userId = storedUserId || state;
        const redirectUri = storedRedirectUri || `${window.location.origin}/oauth/callback`;

        if (!userId) {
          throw new Error("User ID not found");
        }

        console.log("Exchanging code for tokens...");
        console.log("User ID:", userId);
        console.log("Redirect URI:", redirectUri);

        // Call edge function to exchange code for tokens
        const { data, error } = await supabase.functions.invoke("save-google-calendar-token", {
          body: {
            code,
            redirect_uri: redirectUri,
            user_id: userId,
          },
        });

        console.log("Edge function response:", data);

        if (error) {
          console.error("Edge function error:", error);
          throw new Error(error.message || "Erro ao conectar calendário");
        }

        if (data?.error === "no_refresh_token") {
          toast.error("Não foi possível autorizar edição no calendário. Tente novamente.");
          return { success: false, error: "no_refresh_token" };
        }

        if (data?.error) {
          throw new Error(data.message || data.error);
        }

        // Log tokens for debug (temporary)
        console.log("Google Calendar connected successfully!");
        console.log("Email:", data.email);
        console.log("Google User ID:", data.google_user_id);

        // Invalidate calendar connections query
        queryClient.invalidateQueries({ queryKey: ["calendar-connections"] });

        // Clear session storage
        sessionStorage.removeItem("google_calendar_oauth_user_id");
        sessionStorage.removeItem("google_calendar_oauth_redirect_uri");

        toast.success("Agenda conectada com sucesso!");

        return { success: true, data };
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        toast.error(error.message || "Erro ao conectar calendário");
        return { success: false, error: error.message };
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
