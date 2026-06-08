import { eq } from "drizzle-orm";
import { db } from "@/models_M/db";
import { authUser } from "@/models_M/schema";
import { logAudit } from "@/lib/services_M/audit";

export async function listAdminUsers() {
  // SELECT — authUser : liste tous les utilisateurs pour le panel admin, triés par date de création
  return db
    .select({
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      banned: authUser.banned,
      emailVerified: authUser.emailVerified,
      customPermissions: authUser.customPermissions,
      createdAt: authUser.createdAt,
    })
    .from(authUser)
    .orderBy(authUser.createdAt);
}

export async function patchAdminUser(
  actorId: string,
  actorName: string,
  actorRole: string | undefined,
  body: {
    userId: string;
    action: string;
    role?: string;
    permissions?: unknown[];
  },
) {
  const { userId, action, role, permissions } = body;

  const [target] = await db
    // SELECT — authUser : récupère le rôle de l'utilisateur ciblé (vérifie si founder)
    .select({ role: authUser.role })
    .from(authUser)
    .where(eq(authUser.id, userId))
    .limit(1);

  if (target?.role === "founder") {
    return { error: "Le compte Fondateur est verrouillé et ne peut pas être modifié.", status: 403 as const };
  }

  if (action === "updatePermissions") {
    const [before] = await db
      // SELECT — authUser : récupère rôle et nom avant modification des permissions
      .select({ role: authUser.role, name: authUser.name })
      .from(authUser)
      .where(eq(authUser.id, userId))
      .limit(1);

    // UPDATE — authUser : modifie le rôle et les permissions personnalisées, WHERE id = userId
    await db
      .update(authUser)
      .set({
        role: role ?? "user",
        customPermissions: JSON.stringify(permissions ?? []),
        updatedAt: new Date(),
      })
      .where(eq(authUser.id, userId));

    await logAudit({
      actorId,
      actorName,
      actorRole,
      action: "UPDATE_USER_PERMISSIONS",
      category: "users",
      severity: "warning",
      target: `Utilisateur : ${before?.name ?? userId}`,
      details: `Rôle : ${before?.role ?? "?"} → ${role ?? "user"} · ${(permissions ?? []).length} droit(s)`,
    });
    return { success: true as const };
  }

  const [targetUser] = await db
    // SELECT — authUser : récupère nom et email de l'utilisateur ciblé (pour le log d'audit)
    .select({ name: authUser.name, email: authUser.email })
    .from(authUser)
    .where(eq(authUser.id, userId))
    .limit(1);
  const targetLabel = targetUser
    ? `${targetUser.name} (${targetUser.email})`
    : userId;

  switch (action) {
    case "makeAdmin":
      // UPDATE — authUser : promeut l'utilisateur au rôle admin
      await db
        .update(authUser)
        .set({ role: "admin", updatedAt: new Date() })
        .where(eq(authUser.id, userId));
      await logAudit({
        actorId,
        actorName,
        actorRole,
        action: "MAKE_ADMIN",
        category: "users",
        severity: "warning",
        target: `Utilisateur : ${targetLabel}`,
      });
      break;
    case "makeUser":
      // UPDATE — authUser : rétrograde l'utilisateur au rôle user
      await db
        .update(authUser)
        .set({ role: "user", updatedAt: new Date() })
        .where(eq(authUser.id, userId));
      await logAudit({
        actorId,
        actorName,
        actorRole,
        action: "MAKE_USER",
        category: "users",
        severity: "info",
        target: `Utilisateur : ${targetLabel}`,
      });
      break;
    case "ban":
      // UPDATE — authUser : bannit l'utilisateur (banned = true)
      await db
        .update(authUser)
        .set({ banned: true, updatedAt: new Date() })
        .where(eq(authUser.id, userId));
      await logAudit({
        actorId,
        actorName,
        actorRole,
        action: "BAN_USER",
        category: "users",
        severity: "danger",
        target: `Utilisateur : ${targetLabel}`,
      });
      break;
    case "unban":
      // UPDATE — authUser : débannit l'utilisateur (banned = false)
      await db
        .update(authUser)
        .set({ banned: false, updatedAt: new Date() })
        .where(eq(authUser.id, userId));
      await logAudit({
        actorId,
        actorName,
        actorRole,
        action: "UNBAN_USER",
        category: "users",
        severity: "info",
        target: `Utilisateur : ${targetLabel}`,
      });
      break;
    case "delete":
      // DELETE — authUser : supprime définitivement le compte utilisateur
      await db.delete(authUser).where(eq(authUser.id, userId));
      await logAudit({
        actorId,
        actorName,
        actorRole,
        action: "DELETE_USER",
        category: "users",
        severity: "danger",
        target: `Utilisateur : ${targetLabel}`,
      });
      break;
    default:
      return { error: "Action inconnue.", status: 400 as const };
  }

  return { success: true as const };
}
