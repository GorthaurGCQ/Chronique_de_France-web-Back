// =============================================================================
// CLIENT SUPABASE STORAGE — Upload d'images (avatars, bannières admin)
// Clé service_role : UNIQUEMENT côté serveur (jamais exposée au navigateur)
// Variables : Supabase_URL, SUPABASE_SERVICE_ROLE_KEY dans .env.local
// =============================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.Supabase_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Client admin Supabase — bypass RLS, accès complet au storage */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }, // Pas de session côté serveur
});

/** Nom du bucket public pour les images du site */
export const STORAGE_BUCKET = "chronique-images";
