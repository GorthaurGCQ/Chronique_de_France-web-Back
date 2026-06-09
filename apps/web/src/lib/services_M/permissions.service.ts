// =============================================================================
// SERVICE — Permissions granulaires (customPermissions sur auth_user)
// Consommé par : pages (V), /api/profile/access, panel admin
// =============================================================================

// Module : node_modules/drizzle-orm
import { eq } from "drizzle-orm";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Module : node_modules/next/navigation
import { redirect } from "next/navigation";
// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import { authUser } from "@/models_M/schema";
// Module : src/lib/permissions.shared.ts
import {
  ALL_PERMISSIONS,
  type Permission,
  parsePermissions,
  isPrivilegedRole,
  canAccessPage,
} from "@/lib/permissions.shared";

export type { Permission } from "@/lib/permissions.shared";
export {
  ALL_PERMISSIONS,
  ADMIN_PANEL_PERMISSIONS,
  RESSOURCES_SECTION_PERMISSIONS,
  parsePermissions,
  isPrivilegedRole,
  hasAdminPanelAccess,
  hasResourcesSectionAccess,
  canCreateResource,
  canEditResource,
  canDeleteResource,
  canImportMedia,
  canAccessAdminRoute,
  canAccessPage,
  DEFAULT_MEMBER_PAGE_PERMISSIONS,
} from "@/lib/permissions.shared";

export type PageAccessResult =
  | { kind: "guest" }
  | { kind: "denied" }
  | { kind: "ok" };

export async function getUserAccess(userId: string) {
  const [user] = await db
    .select({
      role: authUser.role,
      customPermissions: authUser.customPermissions,
    })
    .from(authUser)
    .where(eq(authUser.id, userId))
    .limit(1);

  if (!user) {
    return { role: null as string | null, permissions: [] as Permission[] };
  }

  if (isPrivilegedRole(user.role)) {
    return { role: user.role, permissions: ALL_PERMISSIONS };
  }

  return { role: user.role, permissions: parsePermissions(user.customPermissions) };
}

type SessionLike = { user: { id: string; role?: string | null } } | null;

/**
 * Vérifie si l'utilisateur possède un droit.
 * - Visiteur non connecté : refus
 * - admin / founder : tous les droits
 * - membre : droits stockés en BDD (customPermissions)
 */
export async function userHasPermission(
  session: SessionLike,
  permission: Permission,
): Promise<boolean> {
  if (!session) return false;
  if (isPrivilegedRole(session.user.role)) return true;

  const { permissions } = await getUserAccess(session.user.id);
  return canAccessPage(true, session.user.role, permissions, permission);
}

/** Contrôle d'accès RSC — guest (login requis) | denied (droit manquant) | ok */
export async function checkPageAccess(
  permission: Permission,
): Promise<PageAccessResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { kind: "guest" };
  if (isPrivilegedRole(session.user.role)) return { kind: "ok" };

  const { permissions } = await getUserAccess(session.user.id);
  if (!canAccessPage(true, session.user.role, permissions, permission)) {
    return { kind: "denied" };
  }
  return { kind: "ok" };
}

/** Espace membre — connexion obligatoire, pas de droit granulaire */
export async function checkMemberAccess(): Promise<"guest" | "ok"> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ? "ok" : "guest";
}

/** @deprecated Préférer checkPageAccess() + LoginRequiredScreen / AccessDeniedScreen */
export async function requirePermission(permission: Permission): Promise<void> {
  const access = await checkPageAccess(permission);
  if (access.kind === "guest") redirect("/connexion");
  if (access.kind === "denied") redirect("/profil?erreur=acces");
}
