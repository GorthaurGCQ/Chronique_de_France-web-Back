// =============================================================================
// COUCHE MODÈLE — Profil utilisateur, avatar, mot de passe, historique
// Consommé par : /api/profile/*, dashboard
// =============================================================================

// Module : node_modules/drizzle-orm
import { eq, and, desc } from "drizzle-orm";
// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import { authUser, authAccount, resourceViews, resources } from "@/models_M/schema";
// Lib : src/lib/supabase.ts
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
// Module : node_modules/@better-auth/utils/password
import { hashPassword, verifyPassword } from "@better-auth/utils/password";

export async function getUserPreferences(userId: string) {
  // SELECT — authUser : récupère les préférences JSON d'un utilisateur par son ID
  const [user] = await db
    .select({ userPreferences: authUser.userPreferences })
    .from(authUser)
    .where(eq(authUser.id, userId))
    .limit(1);

  return user?.userPreferences ?? null;
}

export async function updateProfile(
  userId: string,
  body: {
    name?: string;
    email?: string;
    image?: string | null;
    userPreferences?: unknown;
  },
) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
      return { error: "Nom invalide (minimum 2 caractères).", status: 400 as const };
    }
    updates.name = body.name.trim();
  }

  if (body.email !== undefined) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(body.email)) {
      return { error: "Adresse e-mail invalide.", status: 400 as const };
    }
    const [existing] = await db
      // SELECT — authUser : vérifie si l'email est déjà utilisé par un autre compte
      .select({ id: authUser.id })
      .from(authUser)
      .where(eq(authUser.email, body.email.trim().toLowerCase()))
      .limit(1);
    if (existing && existing.id !== userId) {
      return { error: "Cette adresse e-mail est déjà utilisée.", status: 409 as const };
    }
    updates.email = body.email.trim().toLowerCase();
  }

  if (body.image !== undefined) {
    updates.image = body.image || null;
  }

  if (body.userPreferences !== undefined) {
    updates.userPreferences =
      typeof body.userPreferences === "string"
        ? body.userPreferences
        : JSON.stringify(body.userPreferences);
  }

  // UPDATE — authUser : enregistre les modifications du profil (nom, email, avatar, préférences)
  await db.update(authUser).set(updates).where(eq(authUser.id, userId));
  return { success: true as const };
}

export async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!allowed.includes(ext)) {
    return { error: "Format non supporté (jpg, png, webp, gif).", status: 400 as const };
  }

  const path = `avatars/${userId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) {
    console.error("[uploadAvatar]", error);
    return { error: "Erreur upload.", status: 500 as const };
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  // UPDATE — authUser : enregistre l'URL de l'avatar uploadé sur Supabase Storage
  await db
    .update(authUser)
    .set({ image: publicUrl, updatedAt: new Date() })
    .where(eq(authUser.id, userId));

  return { url: publicUrl };
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (!currentPassword || !newPassword) {
    return { error: "Champs manquants.", status: 400 as const };
  }
  if (newPassword.length < 8) {
    return {
      error: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      status: 400 as const,
    };
  }

  const strongEnough =
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);
  if (!strongEnough) {
    return {
      error:
        "Le nouveau mot de passe doit contenir une majuscule, un chiffre et un symbole.",
      status: 400 as const,
    };
  }

  // SELECT — authAccount : récupère le hash du mot de passe actuel (provider credential)
  const [account] = await db
    .select({ password: authAccount.password })
    .from(authAccount)
    .where(
      and(eq(authAccount.userId, userId), eq(authAccount.providerId, "credential")),
    )
    .limit(1);

  if (!account?.password) {
    return {
      error: "Aucun mot de passe associé à ce compte.",
      status: 400 as const,
    };
  }

  const valid = await verifyPassword(account.password, currentPassword);
  if (!valid) {
    return { error: "Mot de passe actuel incorrect.", status: 403 as const };
  }

  const newHash = await hashPassword(newPassword);
  // UPDATE — authAccount : enregistre le nouveau hash de mot de passe, WHERE userId + provider credential
  await db
    .update(authAccount)
    .set({ password: newHash, updatedAt: new Date() })
    .where(
      and(eq(authAccount.userId, userId), eq(authAccount.providerId, "credential")),
    );

  return { success: true as const };
}

export async function getViewHistory(userId: string) {
  // SELECT — resourceViews + resources : 10 dernières ressources consultées par l'utilisateur
  return db
    .select({
      resourceId: resourceViews.resourceId,
      viewedAt: resourceViews.viewedAt,
      titre: resources.titre,
      description: resources.description,
      type: resources.type,
      timeline: resources.timeline,
      thumbnailUrl: resources.thumbnailUrl,
    })
    .from(resourceViews)
    .innerJoin(resources, eq(resourceViews.resourceId, resources.id))
    .where(eq(resourceViews.userId, userId))
    .orderBy(desc(resourceViews.viewedAt))
    .limit(10);
}

export async function recordView(userId: string, resourceId: string) {
  // INSERT/UPDATE — resourceViews : enregistre ou met à jour la date de consultation d'une ressource
  await db
    .insert(resourceViews)
    .values({ userId, resourceId, viewedAt: new Date() })
    .onConflictDoUpdate({
      target: [resourceViews.userId, resourceViews.resourceId],
      set: { viewedAt: new Date() },
    });
}
