// =============================================================================
// SERVICE ADMIN — Upload d'images vers Supabase Storage
// Appelé par POST /api/admin/upload (bannières, miniatures événements/ressources)
// =============================================================================

import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

/** Upload une image admin : validation format/taille → Supabase → URL publique */
export async function uploadAdminImage(file: File) {
  // Validation du type MIME
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      error: "Format non supporté. Utilisez JPG, PNG, WebP ou GIF.",
      status: 400 as const,
    };
  }
  // Validation de la taille (max 5 Mo)
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return {
      error: `Fichier trop volumineux (max ${MAX_SIZE_MB} Mo).`,
      status: 400 as const,
    };
  }

  // Crée le bucket s'il n'existe pas encore (premier upload)
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === STORAGE_BUCKET);
  if (!bucketExists) {
    await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, { public: true });
  }

  // Nom unique : banners/{timestamp}-{random}.{ext}
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[uploadAdminImage]", error);
    return { error: "Erreur lors de l'upload.", status: 500 as const };
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

  return { url: publicUrl };
}
