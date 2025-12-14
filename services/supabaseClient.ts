import { createClient } from '@supabase/supabase-js';

// Estos valores vendrán de tus variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Faltan variables de entorno de Supabase. La conexión fallará.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
