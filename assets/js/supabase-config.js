/* =========================================================
   DuckWorth's Shine Co. — Supabase Configuration
   ========================================================= */

const SUPABASE_URL = 'https://fhewtozgljtptsxxtzpd.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZXd0b3pnbGp0cHRzeHh0enBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTg0NzAsImV4cCI6MjEwNzQzNDQ3MH0.c9NfhRSEdgErc5hX5cctsE5GbvfUIjmUCS-__6Rad3E';

/* Initialize the client — don't edit below this line */
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);