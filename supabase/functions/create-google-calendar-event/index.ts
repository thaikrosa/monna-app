import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateEventPayload {
  user_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  is_all_day: boolean;
  location?: string;
  description?: string;
  timezone?: string;
}

interface GoogleTokens {
  google_access_token: string;
  google_refresh_token: string;
  access_token_expires_at: string | null;
}

async function refreshGoogleToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{ access_token: string; expires_in: number }> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[create-event] Token refresh failed:', error);
    throw new Error('Failed to refresh Google token');
  }

  return response.json();
}

// deno-lint-ignore no-explicit-any
async function getValidAccessToken(
  supabase: any,
  userId: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  // Get stored tokens
  const { data: tokenData, error: tokenError } = await supabase
    .from('google_oauth_tokens')
    .select('google_access_token, google_refresh_token, access_token_expires_at')
    .eq('user_id', userId)
    .single();

  if (tokenError || !tokenData) {
    console.error('[create-event] No tokens found for user:', userId);
    throw new Error('Google Calendar not connected');
  }

  const tokens = tokenData as GoogleTokens;
  const expiresAt = tokens.access_token_expires_at ? new Date(tokens.access_token_expires_at) : null;
  const now = new Date();

  // Check if token needs refresh (5 min buffer)
  const needsRefresh = !expiresAt || expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;

  if (!needsRefresh && tokens.google_access_token) {
    return tokens.google_access_token;
  }

  console.log('[create-event] Refreshing expired token...');
  
  const refreshed = await refreshGoogleToken(
    tokens.google_refresh_token,
    clientId,
    clientSecret
  );

  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

  // Update stored token
  await supabase
    .from('google_oauth_tokens')
    .update({
      google_access_token: refreshed.access_token,
      access_token_expires_at: newExpiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return refreshed.access_token;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: CreateEventPayload = await req.json();
    console.log('[create-event] Received payload:', JSON.stringify(payload, null, 2));

    const { user_id, title, starts_at, ends_at, is_all_day, location, description, timezone } = payload;

    if (!user_id || !title || !starts_at || !ends_at) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID')!;
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get valid access token
    const accessToken = await getValidAccessToken(supabase, user_id, clientId, clientSecret);

    // Build Google Calendar event
    const googleEvent: Record<string, unknown> = {
      summary: title,
      location: location || undefined,
      description: description || undefined,
    };

    if (is_all_day) {
      // All-day events use date format (no time)
      const startDate = starts_at.split('T')[0];
      const endDate = ends_at.split('T')[0];
      googleEvent.start = { date: startDate };
      googleEvent.end = { date: endDate };
    } else {
      // Timed events use dateTime format
      googleEvent.start = { 
        dateTime: starts_at, 
        timeZone: timezone || 'America/Sao_Paulo' 
      };
      googleEvent.end = { 
        dateTime: ends_at, 
        timeZone: timezone || 'America/Sao_Paulo' 
      };
    }

    console.log('[create-event] Creating Google Calendar event:', JSON.stringify(googleEvent, null, 2));

    // Create event in Google Calendar
    const googleResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleEvent),
      }
    );

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.error('[create-event] Google API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create event in Google Calendar' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const createdEvent = await googleResponse.json();
    console.log('[create-event] Google event created:', createdEvent.id);

    // Get external_calendar_id from connection
    const { data: connection } = await supabase
      .from('calendar_connections')
      .select('external_calendar_id')
      .eq('user_id', user_id)
      .eq('provider', 'google')
      .single();

    // Save event locally
    const localEvent = {
      user_id,
      external_event_id: createdEvent.id,
      external_calendar_id: connection?.external_calendar_id || 'primary',
      provider: 'google',
      title,
      starts_at,
      ends_at,
      is_all_day,
      location: location || null,
      status: 'confirmed',
      updated_from_provider_at: new Date().toISOString(),
    };

    const { data: savedEvent, error: saveError } = await supabase
      .from('calendar_events')
      .insert(localEvent)
      .select()
      .single();

    if (saveError) {
      console.error('[create-event] Error saving local event:', saveError);
      // Event was created in Google, so we still return success
    }

    return new Response(
      JSON.stringify({
        success: true,
        event: {
          id: savedEvent?.id || null,
          google_event_id: createdEvent.id,
          title,
          html_link: createdEvent.htmlLink,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[create-event] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
