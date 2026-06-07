// COUCHE MODÈLE — logique métier ressources (partagée API + pages SSR)

import { eq, and, or, ilike, desc, count, SQL } from "drizzle-orm";
import { db } from "@/models_M/db";
import { resources, authUser } from "@/models_M/schema";
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
    db
      .select(listSelectFields)
      .from(resources)
      .leftJoin(authUser, eq(resources.authorId, authUser.id))
      .where(where)
      .orderBy(desc(resources.publishedAt))
      .limit(limit)
      .offset(skip),
    db.select({ total: count() }).from(resources).where(where),
  ]);

  return {
    data: rows,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function listNationalResources() {
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
  const [updated] = await db
    .update(resources)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning();

  const [author] = await db
    .select({ id: authUser.id, nom: authUser.name, email: authUser.email })
    .from(authUser)
    .where(eq(authUser.id, updated.authorId))
    .limit(1);

  return { ...updated, author };
}

export async function deleteResource(id: string) {
  await db.delete(resources).where(eq(resources.id, id));
}
