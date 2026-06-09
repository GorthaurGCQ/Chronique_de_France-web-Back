// GET    /api/favorites — Liste des favoris (user authentifié)
// POST   /api/favorites — Ajouter un favori { resourceId } (user authentifié)
// PATCH  /api/favorites — Modifier la note { resourceId, note } (user authentifié)
// DELETE /api/favorites — Supprimer un favori { resourceId } (user authentifié)

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/favorites.service.ts
import {
  listFavorites,
  addFavorite,
  updateFavoriteNote,
  removeFavorite,
} from "@/lib/services_M/favorites.service";

/** Handler GET — retourne la liste des favoris de l'utilisateur connecté */
export async function GET() {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    // Récupération des favoris en BDD pour cet utilisateur
    const list = await listFavorites(session.user.id);
    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

/** Handler POST — ajoute une ressource aux favoris de l'utilisateur */
export async function POST(req: Request) {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "resourceId manquant." }, { status: 400 });
    }

    // Insertion du favori en BDD
    const fav = await addFavorite(session.user.id, resourceId);
    return Response.json({ success: true, data: fav ?? null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

/** Handler PATCH — met à jour la note personnelle d'un favori */
export async function PATCH(req: Request) {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { resourceId, note } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "resourceId manquant." }, { status: 400 });
    }

    // Mise à jour de la note en BDD
    await updateFavoriteNote(session.user.id, resourceId, note ?? null);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

/** Handler DELETE — retire une ressource des favoris de l'utilisateur */
export async function DELETE(req: Request) {
  try {
    // Vérification session utilisateur
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "resourceId manquant." }, { status: 400 });
    }

    // Suppression du favori en BDD
    await removeFavorite(session.user.id, resourceId);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
