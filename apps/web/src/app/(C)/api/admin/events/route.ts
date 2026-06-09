// GET    /api/admin/events — Liste complète des événements (admin | founder)
// POST   /api/admin/events — Création événement, body JSON (admin | founder)
// PATCH  /api/admin/events — Modification événement { eventId, … } (admin | founder)
// DELETE /api/admin/events — Suppression événement { eventId } (admin | founder)

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/admin/auth.ts
import { isAdminRole } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/events.service.ts
import {
  listAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
} from "@/lib/services_M/admin/events.service";

/** Handler GET — retourne tous les événements pour le panel admin */
export async function GET() {
  try {
    // Vérification session + rôle admin | founder
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

/** Handler POST — crée un événement depuis le panel admin (avec audit) */
export async function POST(req: Request) {
  try {
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine } = body;

    // Validation manuelle des champs obligatoires
    if (!titre || !description || !lieu || !date || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Insertion en BDD + journalisation audit
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

/** Handler PATCH — modifie un événement depuis le panel admin (avec audit) */
export async function PATCH(req: Request) {
  try {
    // Vérification session + rôle admin | founder
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

    // Mise à jour en BDD + journalisation audit
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

/** Handler DELETE — supprime un événement depuis le panel admin (avec audit) */
export async function DELETE(req: Request) {
  try {
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { eventId } = await req.json();
    if (!eventId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    // Suppression en BDD + journalisation audit
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
