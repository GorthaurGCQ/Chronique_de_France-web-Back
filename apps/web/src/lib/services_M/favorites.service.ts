// =============================================================================
// COUCHE MODÈLE — Favoris utilisateur (lien user ↔ ressource)
// Consommé par : /api/favorites, dashboard utilisateur
// =============================================================================

import { eq, and, desc } from "drizzle-orm";
import { db } from "@/models_M/db";
import { favorites, resources, authUser } from "@/models_M/schema";

/** Retourne les favoris d'un utilisateur avec détails ressource */
export async function listFavorites(userId: string) {
  // SELECT — favorites + resources + authUser : favoris d'un utilisateur avec détails ressource et auteur, triés du plus récent
  return db
    .select({
      id: favorites.id,
      resourceId: resources.id,
      titre: resources.titre,
      description: resources.description,
      type: resources.type,
      timeline: resources.timeline,
      domaine: resources.domaine,
      thumbnailUrl: resources.thumbnailUrl,
      authorName: authUser.name,
      note: favorites.note,
      savedAt: favorites.createdAt,
    })
    .from(favorites)
    .innerJoin(resources, eq(favorites.resourceId, resources.id))
    .leftJoin(authUser, eq(resources.authorId, authUser.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));
}

/** Ajoute un favori (ignore si déjà existant — contrainte unique BDD) */
export async function addFavorite(userId: string, resourceId: string) {
  // INSERT — favorites : ajoute un favori (ignore silencieusement si déjà existant)
  const [fav] = await db
    .insert(favorites)
    .values({ userId, resourceId })
    .onConflictDoNothing()
    .returning({ id: favorites.id });

  return fav ?? null;
}

export async function updateFavoriteNote(
  userId: string,
  resourceId: string,
  note: string | null,
) {
  // UPDATE — favorites : modifie la note personnelle d'un favori, WHERE userId + resourceId
  await db
    .update(favorites)
    .set({ note })
    .where(and(eq(favorites.userId, userId), eq(favorites.resourceId, resourceId)));
}

export async function removeFavorite(userId: string, resourceId: string) {
  // DELETE — favorites : supprime un favori, WHERE userId + resourceId
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.resourceId, resourceId)));
}
