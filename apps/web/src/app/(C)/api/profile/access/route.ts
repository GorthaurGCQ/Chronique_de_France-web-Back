// GET /api/profile/access — Rôle + permissions granulaires de l'utilisateur connecté

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/permissions.service.ts
import { getUserAccess } from "@/lib/services_M/permissions.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const access = await getUserAccess(session.user.id);
    return Response.json({ success: true, data: access });
  } catch (err) {
    console.error("[GET /api/profile/access]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
