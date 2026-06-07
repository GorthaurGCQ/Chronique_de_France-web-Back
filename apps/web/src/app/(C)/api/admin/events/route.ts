import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services/admin/auth";
import {
  listAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
} from "@/lib/services/admin/events.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const list = await listAdminEvents();
    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/events]", err);
    return Response.json(
      { success: false, message: "Erreur interne.", error: String(err) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine } = body;

    if (!titre || !description || !lieu || !date || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const event = await createAdminEvent(
      { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine },
      session.user.id,
      { actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined },
    );

    return Response.json({ success: true, data: event }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/events]", err);
    return Response.json(
      { success: false, message: "Erreur interne.", error: String(err) },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { eventId, titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine } = body;

    if (!eventId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }
    if (!titre || !description || !lieu || !date || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const updated = await updateAdminEvent(
      eventId,
      { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine },
      { actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined },
    );

    return Response.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/admin/events]", err);
    return Response.json(
      { success: false, message: "Erreur interne.", error: String(err) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { eventId } = await req.json();
    if (!eventId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    await deleteAdminEvent(eventId, {
      actorId: session.user.id,
      actorName: session.user.name,
      actorRole: session.user.role ?? undefined,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/events]", err);
    return Response.json(
      { success: false, message: "Erreur interne.", error: String(err) },
      { status: 500 },
    );
  }
}
