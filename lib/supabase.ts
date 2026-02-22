import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('❌ Supabase URL is missing! Please set VITE_SUPABASE_URL in your environment variables.');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error('❌ Supabase Anon Key is missing! Please set VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
