// GET /api/admin/stats — Statistiques du tableau de bord

// Service : src/lib/services_M/admin/auth.ts
import { getAdminSessionOr403 } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/stats.service.ts
import { getAdminStats } from "@/lib/services_M/admin/stats.service";

/** Handler GET — retourne les statistiques agrégées du tableau de bord admin */
export async function GET() {
  const authResult = await getAdminSessionOr403("VOIR_TABLEAU_BORD");
  if (!authResult.ok) return authResult.response;

  const data = await getAdminStats();
  return Response.json({ success: true, data });
}
