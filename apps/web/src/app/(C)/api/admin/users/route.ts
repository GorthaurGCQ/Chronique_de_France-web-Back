import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services/admin/auth";
import { listAdminUsers, patchAdminUser } from "@/lib/services/admin/users.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const users = await listAdminUsers();
    return Response.json({ success: true, data: users });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (!userId) {
      return Response.json({ success: false, message: "userId manquant." }, { status: 400 });
    }
    if (userId === session.user.id) {
      return Response.json(
        { success: false, message: "Vous ne pouvez pas modifier votre propre compte ici." },
        { status: 400 },
      );
    }

    const result = await patchAdminUser(
      session.user.id,
      session.user.name,
      session.user.role ?? undefined,
      body,
    );

    if ("error" in result) {
      return Response.json({ success: false, message: result.error }, { status: result.status });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/admin/users]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
