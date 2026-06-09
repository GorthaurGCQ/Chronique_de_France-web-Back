// GET   /api/admin/users — Liste des utilisateurs
// PATCH /api/admin/users — Modifier un utilisateur { userId, action, … }

// Service : src/lib/services_M/admin/auth.ts
import { getAdminSessionOr403 } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/users.service.ts
import { listAdminUsers, patchAdminUser } from "@/lib/services_M/admin/users.service";

/** Handler GET — retourne la liste complète des utilisateurs (admin panel) */
export async function GET() {
  try {
    const authResult = await getAdminSessionOr403("GERER_UTILISATEURS");
    if (!authResult.ok) return authResult.response;

    const users = await listAdminUsers();
    return Response.json({ success: true, data: users });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

/** Handler PATCH — modifie le rôle ou les permissions d'un utilisateur */
export async function PATCH(req: Request) {
  try {
    const authResult = await getAdminSessionOr403("GERER_UTILISATEURS");
    if (!authResult.ok) return authResult.response;
    const session = authResult.session;

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
