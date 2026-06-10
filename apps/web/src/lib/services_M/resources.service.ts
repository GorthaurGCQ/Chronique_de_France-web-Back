// =============================================================================
// COUCHE MODÈLE — Logique métier ressources pédagogiques
// Consommé par : /api/resources/*, pages SSR bibliothèque/régions
// =============================================================================

// Module : node_modules/drizzle-orm
import { eq, and, or, ilike, desc, count, SQL } from "drizzle-orm";
// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import { resources, authUser } from "@/models_M/schema";
// Modèle : src/models_M/schema.ts
import type { Region, ResourceType } from "@/models_M/schema";

const listSelectFields = {
  id: resources.id,
  titre: resources.titre,
  description: resources.description,
  contenu: resources.contenu,
  type: resources.type,
  region: resources.region,
  timeline: resources.timeline,
  domaine: resources.domaine,
  thumbnailUrl: resources.thumbnailUrl,
  mediaUrl: resources.mediaUrl,
  bannerUrl: resources.bannerUrl,
  authorId: resources.authorId,
  publishedAt: resources.publishedAt,
  updatedAt: resources.updatedAt,
  authorName: authUser.name,
};

export type ListResourcesParams = {
  page: number;
  limit: number;
  search?: string;
  type?: string;
};

export async function listResources(params: ListResourcesParams) {
  const { page, limit, search, type } = params;
  const skip = (page - 1) * limit;

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

  const [rows, [{ total }]] = await Promise.all([
    // SELECT — resources + authUser (LEFT JOIN) : liste paginée des ressources avec auteur, filtrée par type/recherche, triée par date de publication
    db
      .select(listSelectFields)
      .from(resources)
      .leftJoin(authUser, eq(resources.authorId, authUser.id))
      .where(where)
      .orderBy(desc(resources.publishedAt))
      .limit(limit)
      .offset(skip),
    // SELECT — resources : compte le total de ressources (pagination), avec les mêmes filtres
    db.select({ total: count() }).from(resources).where(where),
  ]);

  return {
    data: rows,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function listRecentResources(limit = 3) {
  // SELECT — resources + authUser : dernières ressources publiées (toutes régions)
  return db
    .select({
      id: resources.id,
      titre: resources.titre,
      description: resources.description,
      contenu: resources.contenu,
      type: resources.type,
      region: resources.region,
      timeline: resources.timeline,
      domaine: resources.domaine,
      thumbnailUrl: resources.thumbnailUrl,
      publishedAt: resources.publishedAt,
      authorName: authUser.name,
    })
    .from(resources)
    .leftJoin(authUser, eq(resources.authorId, authUser.id))
    .orderBy(desc(resources.publishedAt))
    .limit(limit);
}

export async function listNationalResources() {
  // SELECT — resources + authUser : ressources de la région NATIONAL, triées par date de publication décroissante
  return db
    .select({
      id: resources.id,
      titre: resources.titre,
      description: resources.description,
      contenu: resources.contenu,
      type: resources.type,
      region: resources.region,
      timeline: resources.timeline,
      domaine: resources.domaine,
      thumbnailUrl: resources.thumbnailUrl,
      publishedAt: resources.publishedAt,
      authorName: authUser.name,
    })
    .from(resources)
    .leftJoin(authUser, eq(resources.authorId, authUser.id))
    .where(eq(resources.region, "NATIONAL"))
    .orderBy(desc(resources.publishedAt));
}

export async function listResourcesByRegion(region: Region) {
  // SELECT — resources + authUser : ressources filtrées par région donnée
  return db
    .select({
      id: resources.id,
      titre: resources.titre,
      description: resources.description,
      contenu: resources.contenu,
      type: resources.type,
      timeline: resources.timeline,
      domaine: resources.domaine,
      thumbnailUrl: resources.thumbnailUrl,
    })
    .from(resources)
    .leftJoin(authUser, eq(resources.authorId, authUser.id))
    .where(eq(resources.region, region));
}

export async function getResourceById(id: string) {
  // SELECT — resources + authUser : détail complet d'une ressource par ID avec infos auteur
  const [resource] = await db
    .select({
      id: resources.id,
      titre: resources.titre,
      description: resources.description,
      contenu: resources.contenu,
      type: resources.type,
      timeline: resources.timeline,
      region: resources.region,
      domaine: resources.domaine,
      thumbnailUrl: resources.thumbnailUrl,
      mediaUrl: resources.mediaUrl,
      bannerUrl: resources.bannerUrl,
      authorId: resources.authorId,
      publishedAt: resources.publishedAt,
      updatedAt: resources.updatedAt,
      authorName: authUser.name,
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

  return resource ?? null;
}

/** Détail pour la page SSR bibliothèque (sans objet author imbriqué) */
export async function getResourceForPage(id: string) {
  // SELECT — resources + authUser : détail ressource pour page SSR bibliothèque (sans objet author imbriqué)
  const [row] = await db
    .select({
      id: resources.id,
      titre: resources.titre,
      description: resources.description,
      contenu: resources.contenu,
      type: resources.type,
      region: resources.region,
      timeline: resources.timeline,
      domaine: resources.domaine,
      mediaUrl: resources.mediaUrl,
      bannerUrl: resources.bannerUrl,
      publishedAt: resources.publishedAt,
      authorName: authUser.name,
    })
    .from(resources)
    .leftJoin(authUser, eq(resources.authorId, authUser.id))
    .where(eq(resources.id, id))
    .limit(1);

  return row ?? null;
}

export async function resourceExists(id: string) {
  // SELECT — resources : vérifie l'existence d'une ressource (retourne l'ID uniquement)
  const [existing] = await db
    .select({ id: resources.id })
    .from(resources)
    .where(eq(resources.id, id))
    .limit(1);
  return existing ?? null;
}

export async function createResource(
  data: {
    titre: string;
    description: string;
    contenu: string;
    type: ResourceType;
  },
  authorId: string,
) {
  // INSERT — resources : crée une nouvelle ressource avec valeurs par défaut (timeline, région, domaine)
  const [resource] = await db
    .insert(resources)
    .values({
      ...data,
      authorId,
      timeline: "CONTEMPORAIN",
      region: "NATIONAL",
      domaine: "PATRIMOINE_HISTOIRE",
    })
    .returning();

  // SELECT — authUser : récupère l'auteur de la ressource créée
  const [author] = await db
    .select({ id: authUser.id, name: authUser.name, email: authUser.email })
    .from(authUser)
    .where(eq(authUser.id, authorId))
    .limit(1);

  return { ...resource, author };
}

export async function updateResource(
  id: string,
  data: Partial<{
    titre: string;
    description: string;
    contenu: string;
    type: ResourceType;
  }>,
) {
  // UPDATE — resources : met à jour les champs modifiés et updatedAt, WHERE id = ressource ciblée
  const [updated] = await db
    .update(resources)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning();

  // SELECT — authUser : récupère l'auteur de la ressource mise à jour
  const [author] = await db
    .select({ id: authUser.id, nom: authUser.name, email: authUser.email })
    .from(authUser)
    .where(eq(authUser.id, updated.authorId))
    .limit(1);

  return { ...updated, author };
}

export async function deleteResource(id: string) {
  // DELETE — resources : supprime une ressource par son ID
  await db.delete(resources).where(eq(resources.id, id));
}
