// GET  /api/profile/history — Historique de consultation (user authentifié)
// POST /api/profile/history — Enregistrer une vue { resourceId } (user authentifié)

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getViewHistory, recordView } from "@/lib/services_M/profile.service";

/** Handler GET — retourne l'historique des ressources consultées par l'utilisateur */
export async function GET() {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    // Lecture de l'historique en BDD
    const rows = await getViewHistory(session.user.id);
    return Response.json({ success: true, data: rows });
  } catch (err) {
    console.error("[GET /api/profile/history]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}

/** Handler POST — enregistre une consultation de ressource dans l'historique */
export async function POST(req: Request) {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    const { resourceId } = await req.json();
    if (!resourceId) return Response.json({ success: false }, { status: 400 });

    // Insertion/mise à jour de la vue en BDD
    await recordView(session.user.id, resourceId);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/profile/history]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
