// GET    /api/admin/events — Liste complète des événements (admin | founder)
// POST   /api/admin/events — Création événement, body JSON (admin | founder)
// PATCH  /api/admin/events — Modification événement { eventId, … } (admin | founder)
// DELETE /api/admin/events — Suppression événement { eventId } (admin | founder)

import { getFullAdminSessionOr403 } from "@/lib/services_M/admin/auth";
import {
  listAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
} from "@/lib/services_M/admin/events.service";
import { normalizeEventStaffInput } from "@/lib/services_M/event-staff.service";

function parseCapaciteMax(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

function validateStaff(staff: ReturnType<typeof normalizeEventStaffInput>) {
  if (staff.length > 0 && !staff.some((s) => s.role === "ORGANISATEUR")) {
    return "Au moins un organisateur doit être assigné à l'événement.";
  }
  return null;
}

export async function GET() {
  try {
    const authResult = await getFullAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

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
    const authResult = await getFullAdminSessionOr403();
    if (!authResult.ok) return authResult.response;
    const session = authResult.session;

    const body = await req.json();
    const { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine, capaciteMax, staff } = body;
    const parsedStaff = normalizeEventStaffInput(staff);
    const staffError = validateStaff(parsedStaff);
    if (staffError) {
      return Response.json({ success: false, message: staffError }, { status: 400 });
    }

    if (!titre || !description || !lieu || !date || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const parsedCapacite = parseCapaciteMax(capaciteMax);
    if (capaciteMax !== undefined && capaciteMax !== null && capaciteMax !== "" && parsedCapacite === null) {
      return Response.json({ success: false, message: "Capacité invalide (entier ≥ 1 ou vide)." }, { status: 400 });
    }

    const event = await createAdminEvent(
      { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine, capaciteMax: parsedCapacite },
      session.user.id,
      parsedStaff,
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
    const authResult = await getFullAdminSessionOr403();
    if (!authResult.ok) return authResult.response;
    const session = authResult.session;

    const body = await req.json();
    const { eventId, titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine, capaciteMax, staff } = body;
    const parsedStaff = normalizeEventStaffInput(staff);
    const staffError = staff !== undefined ? validateStaff(parsedStaff) : null;
    if (staffError) {
      return Response.json({ success: false, message: staffError }, { status: 400 });
    }

    if (!eventId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }
    if (!titre || !description || !lieu || !date || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const parsedCapacite = parseCapaciteMax(capaciteMax);
    if (capaciteMax !== undefined && capaciteMax !== null && capaciteMax !== "" && parsedCapacite === null) {
      return Response.json({ success: false, message: "Capacité invalide (entier ≥ 1 ou vide)." }, { status: 400 });
    }

    const updated = await updateAdminEvent(
      eventId,
      { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine, capaciteMax: parsedCapacite },
      staff !== undefined ? parsedStaff : undefined,
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
    const authResult = await getFullAdminSessionOr403();
    if (!authResult.ok) return authResult.response;
    const session = authResult.session;

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
