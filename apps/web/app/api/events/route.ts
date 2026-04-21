// GET  /api/events — Liste paginée des événements (public)
// POST /api/events — Création d'un événement (ADMIN / SCIENTIFIQUE)

import { eq, or, ilike, and, asc, count, SQL } from "drizzle-orm";
import { db } from "@/db";
import { events, users } from "@/db/schema";
import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth";
import { parseBody, createEventSchema, eventQuerySchema } from "@/lib/validation";

// ---------------------------------------------------------------------------
// GET — Liste paginée avec recherche
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = eventQuerySchema.safeParse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
      search: searchParams.get("search") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Paramètres de requête invalides." },
        { status: 400 },
      );
    }

    const { page, limit, search } = parsed.data;
    const skip = (page - 1) * limit;

    const conditions: (SQL | undefined)[] = [];
    if (search) {
      conditions.push(
        or(
          ilike(events.titre, `%${search}%`),
          ilike(events.description, `%${search}%`),
          ilike(events.lieu, `%${search}%`),
        ),
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      db
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
        .where(where)
        .orderBy(asc(events.date))
        .limit(limit)
        .offset(skip),

      db.select({ total: count() }).from(events).where(where),
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
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — Création d'un événement
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload);

    const body = await req.json();
    const parsed = parseBody(createEventSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const [event] = await db
      .insert(events)
      .values({ ...parsed.data, organisateurId: jwtPayload.userId })
      .returning();

    const [organisateur] = await db
      .select({ id: users.id, nom: users.nom, email: users.email })
      .from(users)
      .where(eq(users.id, jwtPayload.userId))
      .limit(1);

    return Response.json(
      {
        success: true,
        data: { ...event, organisateur },
        message: "Événement créé avec succès.",
      },
      { status: 201 },
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
