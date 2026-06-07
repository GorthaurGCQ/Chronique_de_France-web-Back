import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.Supabase_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client avec la clé service_role — uniquement côté serveur (API routes)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export const STORAGE_BUCKET = "chronique-images";
