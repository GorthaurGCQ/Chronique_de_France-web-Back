import { auth } from "@/lib/auth";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { headers } from "next/headers";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: Request) {
  try {
    // ── Auth ──────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    // ── Lecture du fichier ────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ success: false, message: "Aucun fichier reçu." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ success: false, message: "Format non supporté. Utilisez JPG, PNG, WebP ou GIF." }, { status: 400 });
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return Response.json({ success: false, message: `Fichier trop volumineux (max ${MAX_SIZE_MB} Mo).` }, { status: 400 });
    }

    // ── Création du bucket si besoin ──────────────────────────
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === STORAGE_BUCKET);
    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, { public: true });
    }

    // ── Upload ────────────────────────────────────────────────
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("[upload] Supabase Storage error:", error);
      return Response.json({ success: false, message: "Erreur lors de l'upload." }, { status: 500 });
    }

    // ── URL publique ──────────────────────────────────────────
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    return Response.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    return Response.json({ success: false, message: "Erreur interne.", error: String(err) }, { status: 500 });
  }
}
