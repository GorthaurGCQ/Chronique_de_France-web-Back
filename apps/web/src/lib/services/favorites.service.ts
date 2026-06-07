// COUCHE MODÈLE — favoris utilisateur

import { eq, and, desc } from "drizzle-orm";
import { db } from "@/models_M/db";
import { favorites, resources, authUser } from "@/models_M/schema";

export async function listFavorites(userId: string) {
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

export async function addFavorite(userId: string, resourceId: string) {
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
  await db
    .update(favorites)
    .set({ note })
    .where(and(eq(favorites.userId, userId), eq(favorites.resourceId, resourceId)));
}

export async function removeFavorite(userId: string, resourceId: string) {
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.resourceId, resourceId)));
}
