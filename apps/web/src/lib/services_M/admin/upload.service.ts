import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export async function uploadAdminImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      error: "Format non supporté. Utilisez JPG, PNG, WebP ou GIF.",
      status: 400 as const,
    };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return {
      error: `Fichier trop volumineux (max ${MAX_SIZE_MB} Mo).`,
      status: 400 as const,
    };
  }

  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === STORAGE_BUCKET);
  if (!bucketExists) {
    await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, { public: true });
  }

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
