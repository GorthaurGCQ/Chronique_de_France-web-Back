// GET    /api/resources/[id] — Détail d'une ressource (public)
// PUT    /api/resources/[id] — Modification (ADMIN / SCIENTIFIQUE)
// DELETE /api/resources/[id] — Suppression (ADMIN uniquement)

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { resources, users } from "@/db/schema";
import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth";
import { parseBody, updateResourceSchema } from "@/lib/validation";

type RouteParams = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET — Détail d'une ressource
// ---------------------------------------------------------------------------

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const [resource] = await db
      .select({
        id: resources.id,
        titre: resources.titre,
        description: resources.description,
        contenu: resources.contenu,
        type: resources.type,
        authorId: resources.authorId,
        publishedAt: resources.publishedAt,
        updatedAt: resources.updatedAt,
        author: {
          id: users.id,
          nom: users.nom,
          email: users.email,
        },
      })
      .from(resources)
      .leftJoin(users, eq(resources.authorId, users.id))
      .where(eq(resources.id, id))
      .limit(1);

    if (!resource) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: resource });
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// PUT — Modification d'une ressource
// ---------------------------------------------------------------------------

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload);

    const { id } = await params;

    const [existing] = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (!existing) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    const body = await req.json();
    const parsed = parseBody(updateResourceSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(resources)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();

    const [author] = await db
      .select({ id: users.id, nom: users.nom, email: users.email })
      .from(users)
      .where(eq(users.id, updated.authorId))
      .limit(1);

    return Response.json({
      success: true,
      data: { ...updated, author },
      message: "Ressource mise à jour avec succès.",
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

// ---------------------------------------------------------------------------
// DELETE — Suppression d'une ressource
// ---------------------------------------------------------------------------

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

    const { id } = await params;

    const [existing] = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (!existing) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    await db.delete(resources).where(eq(resources.id, id));

    return Response.json({ success: true, message: "Ressource supprimée avec succès." });
  } catch (error) {
    return handleAuthError(error);
  }
}
