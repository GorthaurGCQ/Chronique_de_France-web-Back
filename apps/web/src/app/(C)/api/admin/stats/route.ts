// GET /api/admin/stats — Statistiques du tableau de bord (admin | founder)

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services_M/admin/auth";
import { getAdminStats } from "@/lib/services_M/admin/stats.service";

/** Handler GET — retourne les statistiques agrégées du tableau de bord admin */
export async function GET() {
  // Vérification session + rôle admin | founder
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !isAdminRole(session.user.role)) {
    return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
  }

  // Agrégation des compteurs (users, events, resources…) via le service
  const data = await getAdminStats();
  return Response.json({ success: true, data });
}
