// GET    /api/admin/events/[id]/registrations — Inscriptions d'un événement (admin | founder)
// DELETE /api/admin/events/[id]/registrations — Supprimer une inscription { registrationId } (admin | founder)

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services_M/admin/auth";
import {
  listEventRegistrations,
  deleteEventRegistration,
} from "@/lib/services_M/admin/events.service";

/** Handler GET — liste les inscriptions d'un événement donné */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

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
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

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
