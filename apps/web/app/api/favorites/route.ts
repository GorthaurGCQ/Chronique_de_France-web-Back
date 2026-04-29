import { auth } from "@/lib/auth";
import { db } from "@/db";
import { favorites, resources, authUser } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { headers } from "next/headers";

// ── GET : liste des favoris de l'utilisateur connecté ────────────────────────
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const list = await db
      .select({
        id:           favorites.id,
        resourceId:   resources.id,
        titre:        resources.titre,
        description:  resources.description,
        type:         resources.type,
        timeline:     resources.timeline,
        domaine:      resources.domaine,
        thumbnailUrl: resources.thumbnailUrl,
        authorName:   authUser.name,
        note:         favorites.note,
        savedAt:      favorites.createdAt,
      })
      .from(favorites)
      .innerJoin(resources, eq(favorites.resourceId, resources.id))
      .leftJoin(authUser, eq(resources.authorId, authUser.id))
      .where(eq(favorites.userId, session.user.id))
      .orderBy(desc(favorites.createdAt));

    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

// ── POST : ajouter un favori ──────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "resourceId manquant." }, { status: 400 });
    }

    const [fav] = await db
      .insert(favorites)
      .values({ userId: session.user.id, resourceId })
      .onConflictDoNothing()
      .returning({ id: favorites.id });

    return Response.json({ success: true, data: fav ?? null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

// ── PATCH : mettre à jour la note d'un favori ────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { resourceId, note } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "resourceId manquant." }, { status: 400 });
    }

    await db
      .update(favorites)
      .set({ note: note ?? null })
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.resourceId, resourceId)));

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

// ── DELETE : retirer un favori ────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "resourceId manquant." }, { status: 400 });
    }

    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.resourceId, resourceId)));

    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
