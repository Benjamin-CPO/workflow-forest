import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error(
    'Invalid Supabase URL. Please ensure your VITE_SUPABASE_URL is a valid URL starting with https://'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);