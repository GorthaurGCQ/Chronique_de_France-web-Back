// GET    /api/favorites — Liste des favoris (user authentifié)
// POST   /api/favorites — Ajouter un favori { resourceId } (user authentifié)
// PATCH  /api/favorites — Modifier la note { resourceId, note } (user authentifié)
// DELETE /api/favorites — Supprimer un favori { resourceId } (user authentifié)

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import {
  listFavorites,
  addFavorite,
  updateFavoriteNote,
  removeFavorite,
} from "@/lib/services_M/favorites.service";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const list = await listFavorites(session.user.id);
    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

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

    const fav = await addFavorite(session.user.id, resourceId);
    return Response.json({ success: true, data: fav ?? null }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

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

    await updateFavoriteNote(session.user.id, resourceId, note ?? null);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

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

    await removeFavorite(session.user.id, resourceId);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/favorites]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
