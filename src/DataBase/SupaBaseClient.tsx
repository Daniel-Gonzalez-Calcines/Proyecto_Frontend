import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idktivoijzlaerdwglwp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlka3Rpdm9panpsYWVyZHdnbHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NzA3NzEsImV4cCI6MjA1NjA0Njc3MX0.zCb0SgySNhztbMmIyIzqKGmsBRWJYLf7WKStqskrw0Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);