import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirect_uri, user_id } = await req.json();

    if (!code || !redirect_uri || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: code, redirect_uri, user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("Missing Google OAuth credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    console.log("Google token response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      console.error("Google token error:", tokenData);
      return new Response(
        JSON.stringify({ error: "Failed to exchange code for tokens", details: tokenData }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { access_token, refresh_token, expires_in, id_token } = tokenData;

    // Check for refresh_token - essential for offline access
    if (!refresh_token) {
      console.warn("No refresh_token received. User may need to revoke and reconnect.");
      return new Response(
        JSON.stringify({ 
          error: "no_refresh_token",
          message: "Não foi possível obter autorização persistente. Tente novamente." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decode ID token to get user info (email, sub)
    let googleUserInfo = { email: "", sub: "" };
    if (id_token) {
      try {
        const [, payload] = id_token.split(".");
        const decoded = JSON.parse(atob(payload));
        googleUserInfo = { email: decoded.email || "", sub: decoded.sub || "" };
      } catch (e) {
        console.error("Failed to decode id_token:", e);
      }
    }

    // If no id_token, fetch user info from Google
    if (!googleUserInfo.email) {
      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        googleUserInfo = { email: userInfo.email || "", sub: userInfo.id || "" };
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Upsert calendar connection
    const { error: upsertError } = await supabase
      .from("calendar_connections")
      .upsert({
        user_id,
        provider: "google",
        external_calendar_id: googleUserInfo.email || googleUserInfo.sub,
        status: "connected",
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
        access_token,
        refresh_token,
        access_token_expires_at: expiresAt,
        last_synced_at: new Date().toISOString(),
        last_error: null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,provider",
      });

    if (upsertError) {
      console.error("Failed to save calendar connection:", upsertError);
      return new Response(
        JSON.stringify({ error: "Failed to save connection", details: upsertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also save to google_oauth_tokens for n8n compatibility
    const { error: tokenUpsertError } = await supabase
      .from("google_oauth_tokens")
      .upsert({
        user_id,
        google_user_id: googleUserInfo.sub,
        email: googleUserInfo.email,
        google_access_token: access_token,
        google_refresh_token: refresh_token,
        access_token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (tokenUpsertError) {
      console.error("Failed to save google_oauth_tokens:", tokenUpsertError);
      // Non-fatal - continue
    }

    console.log("Successfully saved Google Calendar connection for user:", user_id);

    return new Response(
      JSON.stringify({
        success: true,
        email: googleUserInfo.email,
        google_user_id: googleUserInfo.sub,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
