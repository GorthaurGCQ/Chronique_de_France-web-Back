// GET    /api/events/[id] — Détail d'un événement (public)
// PUT    /api/events/[id] — Modification (ADMIN / SCIENTIFIQUE)
// DELETE /api/events/[id] — Suppression (ADMIN uniquement)

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events, users } from "@/db/schema";
import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth";
import { parseBody, updateEventSchema } from "@/lib/validation";

type RouteParams = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET — Détail d'un événement
// ---------------------------------------------------------------------------

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const [event] = await db
      .select({
        id: events.id,
        titre: events.titre,
        description: events.description,
        lieu: events.lieu,
        date: events.date,
        organisateurId: events.organisateurId,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        organisateur: {
          id: users.id,
          nom: users.nom,
          email: users.email,
        },
      })
      .from(events)
      .leftJoin(users, eq(events.organisateurId, users.id))
      .where(eq(events.id, id))
      .limit(1);

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

// ---------------------------------------------------------------------------
// PUT — Modification d'un événement
// ---------------------------------------------------------------------------

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload);

    const { id } = await params;

    const [existing] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!existing) {
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

    const [updated] = await db
      .update(events)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    const [organisateur] = await db
      .select({ id: users.id, nom: users.nom, email: users.email })
      .from(users)
      .where(eq(users.id, updated.organisateurId))
      .limit(1);

    return Response.json({
      success: true,
      data: { ...updated, organisateur },
      message: "Événement mis à jour avec succès.",
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

// ---------------------------------------------------------------------------
// DELETE — Suppression d'un événement
// ---------------------------------------------------------------------------

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

    const { id } = await params;

    const [existing] = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!existing) {
      return Response.json(
        { success: false, message: "Événement introuvable." },
        { status: 404 },
      );
    }

    await db.delete(events).where(eq(events.id, id));

    return Response.json({ success: true, message: "Événement supprimé avec succès." });
  } catch (error) {
    return handleAuthError(error);
  }
}
