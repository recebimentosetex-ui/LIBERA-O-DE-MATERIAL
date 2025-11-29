
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://qwvwlarkxirtoizgstmu.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dndsYXJreGlydG9pemdzdG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODk3ODIsImV4cCI6MjA3OTk2NTc4Mn0.wXLYpZ-Fd5iJvj9y8dUwIwtiyLgpOerql-1tTOi5BEs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
