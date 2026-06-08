// POST /api/profile/change-password — Changer le mot de passe { currentPassword, newPassword } (user authentifié)

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { changePassword } from "@/lib/services_M/profile.service";

/** Handler POST — change le mot de passe de l'utilisateur connecté */
export async function POST(req: Request) {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // Vérification ancien MDP + hash du nouveau via Better Auth
    const result = await changePassword(session.user.id, currentPassword, newPassword);

    if ("error" in result) {
      return Response.json({ success: false, message: result.error }, { status: result.status });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/profile/change-password]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
