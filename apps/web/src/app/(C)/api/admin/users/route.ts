// GET   /api/admin/users — Liste des utilisateurs (admin | founder)
// PATCH /api/admin/users — Modifier un utilisateur { userId, action, … } (admin | founder)

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services_M/admin/auth";
import { listAdminUsers, patchAdminUser } from "@/lib/services_M/admin/users.service";

/** Handler GET — retourne la liste complète des utilisateurs (admin panel) */
export async function GET() {
  try {
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    // Lecture de tous les utilisateurs en BDD
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
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action } = body;

    // Validation : userId obligatoire
    if (!userId) {
      return Response.json({ success: false, message: "userId manquant." }, { status: 400 });
    }
    // Sécurité : un admin ne peut pas se modifier lui-même via cette route
    if (userId === session.user.id) {
      return Response.json(
        { success: false, message: "Vous ne pouvez pas modifier votre propre compte ici." },
        { status: 400 },
      );
    }

    // Application de l'action (changement rôle, permissions…) + audit
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
