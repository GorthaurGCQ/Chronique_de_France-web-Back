// =============================================================================
// GARDE D'ACCÈS ADMIN — Vérifie session + rôle admin | founder
// Utilisé par les routes /api/events, /api/resources (POST/PUT/DELETE)
// =============================================================================

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services_M/admin/auth";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

/**
 * Récupère la session courante et vérifie le rôle admin | founder.
 * Retourne soit la session valide, soit une Response 403 prête à renvoyer.
 */
export async function getAdminSessionOr403(): Promise<
  { ok: true; session: Session } | { ok: false; response: Response }
> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !isAdminRole(session.user.role)) {
    return {
      ok: false,
      response: Response.json({ success: false, message: "Accès refusé." }, { status: 403 }),
    };
  }
  return { ok: true, session };
}
