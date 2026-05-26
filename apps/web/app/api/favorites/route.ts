// =============================================================================
// ROUTE API BACK — URL : /api/favorites
// Appelée par le front (ex. BookmarkButton.tsx) via fetch()
// Auth : session Better Auth (cookies), pas JWT
// =============================================================================

import { auth } from "@/lib/auth"; // config serveur Better Auth
import { db } from "@/db"; // client Drizzle → PostgreSQL
import { favorites, resources, authUser } from "@/db/schema"; // tables SQL
import { eq, and, desc } from "drizzle-orm"; // opérateurs de requête
import { headers } from "next/headers"; // en-têtes HTTP de la requête entrante (cookies session)

// ── GET : liste des favoris de l'utilisateur connecté ────────────────────────
export async function GET() {
  try {
    // Récupère la session à partir des cookies envoyés par le navigateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      // 401 = non authentifié
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    // Requête SQL : jointure favorites + resources + auteur
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
      .where(eq(favorites.userId, session.user.id)) // uniquement les favoris de l'utilisateur courant
      .orderBy(desc(favorites.createdAt));

    // Réponse JSON standard du projet : { success, data }
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

    const { resourceId } = await req.json(); // corps JSON envoyé par le front
    if (!resourceId) {
      return Response.json({ success: false, message: "resourceId manquant." }, { status: 400 });
    }

    const [fav] = await db
      .insert(favorites)
      .values({ userId: session.user.id, resourceId })
      .onConflictDoNothing() // évite doublon si déjà en favori
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
