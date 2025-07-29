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

// The supabase client for API access
export const supabase = createClient(supabaseUrl, supabaseKey);
