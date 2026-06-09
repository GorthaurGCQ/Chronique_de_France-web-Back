// GET /api/admin/audit — Journal d'audit ?category= (admin | founder)

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/admin/auth.ts
import { isAdminRole } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/audit.service.ts
import { listAuditLogs } from "@/lib/services_M/admin/audit.service";

/** Handler GET — retourne le journal d'audit, filtrable par catégorie */
export async function GET(req: Request) {
  try {
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    // Filtre optionnel par catégorie (?category=events, resources…)
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // Lecture des logs d'audit en BDD
    const list = await listAuditLogs(category);

    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/audit]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
