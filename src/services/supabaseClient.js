import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseAdmin = createClient(
  supabaseUrl,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export { supabaseAdmin };

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Ensure session persistence
    storage: localStorage, // Use localStorage for session storage
  },
});
