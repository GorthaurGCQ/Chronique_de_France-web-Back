// GET  /api/resources — Liste paginée des ressources (public)
// POST /api/resources — Création d'une ressource (ADMIN / SCIENTIFIQUE)

import { eq, and, or, ilike, desc, count, SQL } from "drizzle-orm";
import { db } from "@/db";
import { resources, users } from "@/db/schema";
import type { ResourceType } from "@/db/schema";
import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth";
import { parseBody, createResourceSchema, resourceQuerySchema } from "@/lib/validation";

// ---------------------------------------------------------------------------
// GET — Liste paginée avec recherche et filtrage
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = resourceQuerySchema.safeParse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
      search: searchParams.get("search") ?? undefined,
      type: searchParams.get("type") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Paramètres de requête invalides." },
        { status: 400 },
      );
    }

    const { page, limit, search, type } = parsed.data;
    const skip = (page - 1) * limit;

    // Construction des conditions WHERE
    const conditions: (SQL | undefined)[] = [];
    if (type) conditions.push(eq(resources.type, type as ResourceType));
    if (search) {
      conditions.push(
        or(
          ilike(resources.titre, `%${search}%`),
          ilike(resources.description, `%${search}%`),
        ),
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // Exécution en parallèle : données + comptage
    const [rows, [{ total }]] = await Promise.all([
      db
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
        .where(where)
        .orderBy(desc(resources.publishedAt))
        .limit(limit)
        .offset(skip),

      db.select({ total: count() }).from(resources).where(where),
    ]);

    return Response.json({
      success: true,
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/resources]", error);
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — Création d'une ressource
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload);

    const body = await req.json();
    const parsed = parseBody(createResourceSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const [resource] = await db
      .insert(resources)
      .values({ ...parsed.data, authorId: jwtPayload.userId })
      .returning();

    // Récupérer l'auteur pour la réponse
    const [author] = await db
      .select({ id: users.id, nom: users.nom, email: users.email })
      .from(users)
      .where(eq(users.id, jwtPayload.userId))
      .limit(1);

    return Response.json(
      { success: true, data: { ...resource, author }, message: "Ressource créée avec succès." },
      { status: 201 },
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
