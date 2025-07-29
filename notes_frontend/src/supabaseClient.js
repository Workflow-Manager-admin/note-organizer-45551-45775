import { createClient } from '@supabase/supabase-js';

/*
 * PUBLIC_INTERFACE
 * Returns a configured Supabase client using environment variables.
 * Requires:
 *   - REACT_APP_SUPABASE_URL: The Supabase project URL
 *   - REACT_APP_SUPABASE_KEY: The anon public API key
 *
 * Note: Never commit .env files with secrets to public repos.
 */

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

/**
 * Validates Supabase URL and Key from environment variables and initializes the client.
 * Provides clear errors if env vars are missing, empty or obviously invalid.
 */
function validateSupabaseConfig(url, key) {
  if (!url) {
    throw new Error(
      "Supabase URL is missing or empty. Please set REACT_APP_SUPABASE_URL in your environment (.env file or deployment environment)."
    );
  }
  if (!/^https?:\/\/[\w.-]+/.test(url)) {
    throw new Error(
      `Supabase URL appears malformed: "${url}". Check your REACT_APP_SUPABASE_URL value.`
    );
  }
  if (!key) {
    throw new Error(
      "Supabase anon/public key is missing or empty. Please set REACT_APP_SUPABASE_KEY in your environment."
    );
  }
  if (key.length < 20) {
    throw new Error(
      `Supabase anon/public key is too short or malformed: "${key}".`
    );
  }
}

try {
  validateSupabaseConfig(supabaseUrl, supabaseKey);
} catch (err) {
  // Log a clear message in the browser for developers
  // (Shows up only in dev mode, since build will fail if .env is absent)
  // Do not let the app crash unexpectedly
  // You may optionally export a dummy for testing.
  // eslint-disable-next-line no-console
  console.error("[SupabaseClient initialization error]", err.message);
  // Re-throw so that user sees error in screen in common error boundaries
  throw err;
}

// The supabase client for API access
export const supabase = createClient(supabaseUrl, supabaseKey);
