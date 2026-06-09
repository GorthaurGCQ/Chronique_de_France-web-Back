// GET /api/admin/stats — Statistiques du tableau de bord (admin | founder)

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/admin/auth.ts
import { isAdminRole } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/stats.service.ts
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
