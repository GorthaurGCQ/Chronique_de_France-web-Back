import { eq, desc } from "drizzle-orm";
import { db } from "@/models_M/db";
import { resources, authUser, type Domaine } from "@/models_M/schema";
import { logAudit } from "@/lib/services_M/audit";

export async function listAdminResources() {
  // SELECT — resources + authUser : liste toutes les ressources pour le panel admin, triées par date de publication
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
      mediaUrl: resources.mediaUrl,
      bannerUrl: resources.bannerUrl,
      thumbnailUrl: resources.thumbnailUrl,
      publishedAt: resources.publishedAt,
      authorName: authUser.name,
    })
    .from(resources)
    .leftJoin(authUser, eq(resources.authorId, authUser.id))
    .orderBy(desc(resources.publishedAt));
}

export type AdminResourceInput = {
  titre: string;
  description: string;
  contenu: string;
  type: string;
  region: string;
  timeline: string;
  domaine: string;
  mediaUrl?: string | null;
  bannerUrl?: string | null;
  thumbnailUrl?: string | null;
};

export async function createAdminResource(
  data: AdminResourceInput,
  authorId: string,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  // INSERT — resources : crée une ressource depuis le panel admin avec tous les champs métier
  const [resource] = await db
    .insert(resources)
    .values({
      titre: data.titre,
      description: data.description,
      contenu: data.contenu,
      type: data.type as typeof resources.type.enumValues[number],
      region: data.region as typeof resources.region.enumValues[number],
      timeline: data.timeline as typeof resources.timeline.enumValues[number],
      domaine: data.domaine as Domaine,
      mediaUrl: data.mediaUrl || null,
      bannerUrl: data.bannerUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      authorId,
    })
    .returning({ id: resources.id, titre: resources.titre });

  await logAudit({
    actorId: audit.actorId,
    actorName: audit.actorName,
    actorRole: audit.actorRole,
    action: "CREATE_RESOURCE",
    category: "resources",
    severity: "success",
    target: `Ressource : ${resource.titre}`,
  });

  return resource;
}

export async function updateAdminResource(
  resourceId: string,
  data: AdminResourceInput,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  // UPDATE — resources : met à jour une ressource admin, WHERE id = resourceId
  const [updated] = await db
    .update(resources)
    .set({
      titre: data.titre,
      description: data.description,
      contenu: data.contenu,
      type: data.type as typeof resources.type.enumValues[number],
      region: data.region as typeof resources.region.enumValues[number],
      timeline: data.timeline as typeof resources.timeline.enumValues[number],
      domaine: data.domaine as Domaine,
      mediaUrl: data.mediaUrl || null,
      bannerUrl: data.bannerUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(resources.id, resourceId))
    .returning({ id: resources.id, titre: resources.titre });

  await logAudit({
    actorId: audit.actorId,
    actorName: audit.actorName,
    actorRole: audit.actorRole,
    action: "UPDATE_RESOURCE",
    category: "resources",
    severity: "info",
    target: `Ressource : ${updated.titre}`,
  });

  return updated;
}

export async function deleteAdminResource(
  resourceId: string,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  // DELETE — resources : supprime une ressource par son ID
  await db.delete(resources).where(eq(resources.id, resourceId));
  await logAudit({
    actorId: audit.actorId,
    actorName: audit.actorName,
    actorRole: audit.actorRole,
    action: "DELETE_RESOURCE",
    category: "resources",
    severity: "danger",
    target: `Ressource ID : ${resourceId}`,
  });
}
