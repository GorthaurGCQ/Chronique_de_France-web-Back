import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services/admin/auth";
import {
  listEventRegistrations,
  deleteEventRegistration,
} from "@/lib/services/admin/events.service";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { id } = await params;
    const list = await listEventRegistrations(id);
    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/events/[id]/registrations]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    await params;
    const { registrationId } = await req.json();
    if (!registrationId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    await deleteEventRegistration(registrationId);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/events/[id]/registrations]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
