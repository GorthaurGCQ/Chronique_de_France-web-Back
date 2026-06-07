// GET    /api/events/[id] — Détail d'un événement (public)
// PUT    /api/events/[id] — Modification (ADMIN / SCIENTIFIQUE)
// DELETE /api/events/[id] — Suppression (ADMIN uniquement)

import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth/jwt";
import { parseBody, updateEventSchema } from "@/models_M/schemas/validation";
import {
  getEventById,
  updateEvent,
  deleteEvent,
} from "@/lib/services/events.service";
import { db } from "@/models_M/db";
import { events } from "@/models_M/schema";
import { eq } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

async function eventExists(id: string) {
  const [existing] = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  return existing ?? null;
}

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
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload);

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
    return handleAuthError(error);
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

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
    return handleAuthError(error);
  }
}
