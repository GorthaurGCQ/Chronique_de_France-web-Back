import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services_M/admin/auth";
import { listAuditLogs } from "@/lib/services_M/admin/audit.service";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const list = await listAuditLogs(category);

    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/audit]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
