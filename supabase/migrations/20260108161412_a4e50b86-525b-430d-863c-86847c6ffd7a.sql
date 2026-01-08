-- Add UNIQUE constraint on calendar_connections for upsert to work
ALTER TABLE calendar_connections 
ADD CONSTRAINT calendar_connections_user_provider_unique 
UNIQUE (user_id, provider);

-- Add UNIQUE constraint on google_oauth_tokens for upsert to work
ALTER TABLE google_oauth_tokens 
ADD CONSTRAINT google_oauth_tokens_user_id_unique 
UNIQUE (user_id);