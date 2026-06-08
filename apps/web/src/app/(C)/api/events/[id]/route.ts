// GET    /api/events/[id] — Détail d'un événement (public)
// PUT    /api/events/[id] — Modification (admin)
// DELETE /api/events/[id] — Suppression (admin)

import { getAdminSessionOr403 } from "@/lib/auth/require-session";
import { parseBody, updateEventSchema } from "@/models_M/schemas/validation";
import {
  getEventById,
  eventExists,
  updateEvent,
  deleteEvent,
} from "@/lib/services_M/events.service";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    const { id } = await params;

    if (!(await eventExists(id))) {
      return Response.json(
        { success: false, message: "Événement introuvable." },
        { status: 404 },
      );
    }

    const body = await req.json();
    const parsed = parseBody(updateEventSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

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

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    const { id } = await params;

    if (!(await eventExists(id))) {
      return Response.json(
        { success: false, message: "Événement introuvable." },
        { status: 404 },
      );
    }

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
