// GET    /api/admin/events/[id]/registrations — Inscriptions d'un événement (admin | founder)
// DELETE /api/admin/events/[id]/registrations — Supprimer une inscription { registrationId } (admin | founder)

// Service : src/lib/services_M/admin/auth.ts
import { getFullAdminSessionOr403 } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/events.service.ts
import {
  listEventRegistrations,
  deleteEventRegistration,
} from "@/lib/services_M/admin/events.service";

/** Handler GET — liste les inscriptions d'un événement donné */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await getFullAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    const { id } = await params;

    // Lecture des inscriptions en BDD pour cet événement
    const list = await listEventRegistrations(id);
    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/events/[id]/registrations]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

/** Handler DELETE — supprime une inscription à un événement */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await getFullAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    await params;
    const { registrationId } = await req.json();
    if (!registrationId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    // Suppression de l'inscription en BDD
    await deleteEventRegistration(registrationId);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/events/[id]/registrations]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
