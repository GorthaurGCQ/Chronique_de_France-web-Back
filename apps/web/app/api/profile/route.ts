import { auth } from "@/lib/auth";
import { db } from "@/db";
import { authUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    const [user] = await db
      .select({ userPreferences: authUser.userPreferences })
      .from(authUser)
      .where(eq(authUser.id, session.user.id))
      .limit(1);

    return Response.json({ success: true, userPreferences: user?.userPreferences ?? null });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });

    const body = await req.json();
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    // ── Nom ──────────────────────────────────────────────────────────────────
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length < 2) {
        return Response.json({ success: false, message: "Nom invalide (minimum 2 caractères)." }, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    // ── Email ─────────────────────────────────────────────────────────────────
    if (body.email !== undefined) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(body.email)) {
        return Response.json({ success: false, message: "Adresse e-mail invalide." }, { status: 400 });
      }
      // Vérifier unicité
      const [existing] = await db
        .select({ id: authUser.id })
        .from(authUser)
        .where(eq(authUser.email, body.email.trim().toLowerCase()))
        .limit(1);
      if (existing && existing.id !== session.user.id) {
        return Response.json({ success: false, message: "Cette adresse e-mail est déjà utilisée." }, { status: 409 });
      }
      updates.email = body.email.trim().toLowerCase();
    }

    // ── Image (avatar) ────────────────────────────────────────────────────────
    if (body.image !== undefined) {
      updates.image = body.image || null;
    }

    // ── Préférences ───────────────────────────────────────────────────────────
    if (body.userPreferences !== undefined) {
      updates.userPreferences = typeof body.userPreferences === "string"
        ? body.userPreferences
        : JSON.stringify(body.userPreferences);
    }

    await db.update(authUser).set(updates).where(eq(authUser.id, session.user.id));

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/profile]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

// ── Upload avatar (POST multipart) ─────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return Response.json({ success: false, message: "Aucun fichier." }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!allowed.includes(ext)) {
      return Response.json({ success: false, message: "Format non supporté (jpg, png, webp, gif)." }, { status: 400 });
    }

    const path = `avatars/${session.user.id}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: true });

    if (error) {
      console.error("[POST /api/profile avatar]", error);
      return Response.json({ success: false, message: "Erreur upload." }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    // Mettre à jour le champ image de l'utilisateur
    await db.update(authUser)
      .set({ image: publicUrl, updatedAt: new Date() })
      .where(eq(authUser.id, session.user.id));

    return Response.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("[POST /api/profile]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
