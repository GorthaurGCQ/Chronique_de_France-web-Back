// GET    /api/profile/events — Inscriptions événements de l'utilisateur connecté
// DELETE /api/profile/events — Désinscription { registrationId }

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/events.service.ts
import {
  listUserEventRegistrations,
  cancelEventRegistration,
} from "@/lib/services_M/events.service";

/** Handler GET — liste les inscriptions liées à l'e-mail du compte */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const list = await listUserEventRegistrations(session.user.email);
    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/profile/events]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

/** Handler DELETE — désinscrit l'utilisateur et met à jour la capacité */
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { registrationId } = await req.json();
    if (!registrationId) {
      return Response.json(
        { success: false, message: "registrationId manquant." },
        { status: 400 },
      );
    }

    const result = await cancelEventRegistration(registrationId, {
      ownerEmail: session.user.email,
    });

    if (!result) {
      return Response.json(
        { success: false, message: "Inscription introuvable." },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Désinscription effectuée.",
      data: result,
    });
  } catch (err: unknown) {
    if (String(err).includes("FORBIDDEN")) {
      return Response.json(
        { success: false, message: "Action non autorisée." },
        { status: 403 },
      );
    }
    console.error("[DELETE /api/profile/events]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
