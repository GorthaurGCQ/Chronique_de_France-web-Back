import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services_M/admin/auth";
import { getAdminStats } from "@/lib/services_M/admin/stats.service";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !isAdminRole(session.user.role)) {
    return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
  }

  const data = await getAdminStats();
  return Response.json({ success: true, data });
}
