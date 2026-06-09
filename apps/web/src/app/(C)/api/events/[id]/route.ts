// GET    /api/events/[id] — Détail d'un événement (public)
// PUT    /api/events/[id] — Modification, body JSON validé (admin | founder)
// DELETE /api/events/[id] — Suppression (admin | founder)

// Auth : src/lib/auth/require-session.ts
import { getAdminSessionOr403 } from "@/lib/auth/require-session";
// Modèle : src/models_M/schemas/validation.ts
import { parseBody, updateEventSchema } from "@/models_M/schemas/validation";
// Service : src/lib/services_M/events.service.ts
import {
  getEventById,
  eventExists,
  updateEvent,
  deleteEvent,
} from "@/lib/services_M/events.service";

type RouteParams = { params: Promise<{ id: string }> };

/** Handler GET — retourne le détail d'un événement par son ID (accès public) */
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Recherche de l'événement en BDD
    const event = await getEventById(id);

    if (!event) {
      return Response.json(
        { success: false, message: "Événement introuvable." },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: event });
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

/** Handler PUT — modifie un événement existant (réservé admin | founder) */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    // Vérification session + rôle admin | founder
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    const { id } = await params;

    // Vérifie que l'événement existe avant modification
    if (!(await eventExists(id))) {
      return Response.json(
        { success: false, message: "Événement introuvable." },
        { status: 404 },
      );
    }

    // Lecture et validation du body JSON (schéma updateEventSchema)
    const body = await req.json();
    const parsed = parseBody(updateEventSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    // Mise à jour en BDD via le service
    const updated = await updateEvent(id, parsed.data);

    return Response.json({
      success: true,
      data: updated,
      message: "Événement mis à jour avec succès.",
    });
  } catch (error) {
    console.error("[PUT /api/events/[id]]", error);
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

/** Handler DELETE — supprime un événement (réservé admin | founder) */
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    // Vérification session + rôle admin | founder
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    const { id } = await params;

    // Vérifie que l'événement existe avant suppression
    if (!(await eventExists(id))) {
      return Response.json(
        { success: false, message: "Événement introuvable." },
        { status: 404 },
      );
    }

    // Suppression en BDD via le service
    await deleteEvent(id);

    return Response.json({ success: true, message: "Événement supprimé avec succès." });
  } catch (error) {
    console.error("[DELETE /api/events/[id]]", error);
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}
