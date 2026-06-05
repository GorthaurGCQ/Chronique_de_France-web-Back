// =============================================================================
// ROUTE API BACK — URL : /api/resources/:id
// GET = public | PUT/DELETE = JWT + contrôle de rôle
// =============================================================================

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { resources, authUser } from "@/db/schema";
import { verifyJWT, requireRole, handleAuthError } from "@/lib/jwt";
import { parseBody, updateResourceSchema } from "@/lib/validation";

// Next.js 15 : params est une Promise (id dynamique dans l'URL)
type RouteParams = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET — Détail d'une ressource (accessible sans être connecté)
// ---------------------------------------------------------------------------

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // ex. /api/resources/abc-123 → id = "abc-123"

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
          id: authUser.id,
          nom: authUser.name,
          email: authUser.email,
        },
      })
      .from(resources)
      .leftJoin(authUser, eq(resources.authorId, authUser.id))
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
// PUT — Modification (JWT obligatoire, rôles ADMIN ou SCIENTIFIQUE)
// ---------------------------------------------------------------------------

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req); // lit Authorization: Bearer …
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload); // 403 si mauvais rôle

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
    const parsed = parseBody(updateResourceSchema, body); // validation Zod

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
      .select({ id: authUser.id, nom: authUser.name, email: authUser.email })
      .from(authUser)
      .where(eq(authUser.id, updated.authorId))
      .limit(1);

    return Response.json({
      success: true,
      data: { ...updated, author },
      message: "Ressource mise à jour avec succès.",
    });
  } catch (error) {
    return handleAuthError(error); // 401/403 formatés en JSON
  }
}

// ---------------------------------------------------------------------------
// DELETE — Suppression (JWT + rôle ADMIN uniquement)
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
