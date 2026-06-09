// =============================================================================
// UTILITAIRE AUTH ADMIN — Rôle admin | founder + permissions granulaires
// Partagé par les routes /api/admin/* et getAdminSessionOr403()
// =============================================================================

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Module : src/lib/permissions.shared.ts
import {
  type Permission,
  isPrivilegedRole,
  hasAdminPanelAccess,
  hasAnyPermission,
} from "@/lib/permissions.shared";
// Service : src/lib/services_M/permissions.service.ts
import { getUserAccess } from "@/lib/services_M/permissions.service";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

const FORBIDDEN = Response.json({ success: false, message: "Accès refusé." }, { status: 403 });

/** Retourne true si le rôle est admin ou founder */
export function isAdminRole(role: string | null | undefined): boolean {
  return isPrivilegedRole(role);
}

/** Vérifie qu'un utilisateur possède au moins un des droits demandés */
export async function userHasAnyPermission(
  userId: string,
  role: string | null | undefined,
  required: Permission | Permission[],
): Promise<boolean> {
  if (isPrivilegedRole(role)) return true;
  const { permissions } = await getUserAccess(userId);
  return hasAnyPermission(permissions, required);
}

/**
 * Session valide pour le panneau admin.
 * Sans argument : au moins un droit admin (section visible).
 * Avec argument : au moins un des droits passés.
 */
export async function getAdminSessionOr403(
  required?: Permission | Permission[],
): Promise<{ ok: true; session: Session } | { ok: false; response: Response }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, response: FORBIDDEN };

  if (isPrivilegedRole(session.user.role)) {
    return { ok: true, session };
  }

  if (!required) {
    const { permissions } = await getUserAccess(session.user.id);
    if (!hasAdminPanelAccess(session.user.role, permissions)) {
      return { ok: false, response: FORBIDDEN };
    }
    return { ok: true, session };
  }

  const allowed = await userHasAnyPermission(
    session.user.id,
    session.user.role,
    required,
  );
  if (!allowed) return { ok: false, response: FORBIDDEN };

  return { ok: true, session };
}

/** Réservé admin | founder (événements admin, journal d'audit…) */
export async function getFullAdminSessionOr403(): Promise<
  { ok: true; session: Session } | { ok: false; response: Response }
> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isPrivilegedRole(session.user.role)) {
    return { ok: false, response: FORBIDDEN };
  }
  return { ok: true, session };
}
