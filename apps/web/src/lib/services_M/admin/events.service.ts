// =============================================================================
// SERVICE ADMIN — CRUD événements + inscriptions (avec audit)
// Consommé par : /api/admin/events/*, page /admin/evenements
// =============================================================================

// Module : node_modules/drizzle-orm
import { eq, desc } from "drizzle-orm";
// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import {
  events,
  authUser,
  eventRegistrations,
  type Domaine,
  type Region,
  type Timeline,
} from "@/models_M/schema";
// Service : src/lib/services_M/audit.ts
import { logAudit } from "@/lib/services_M/audit";
// Service : src/lib/services_M/events.service.ts
import { promoteNextFromWaitlist } from "@/lib/services_M/events.service";

export async function listAdminEvents() {
  // SELECT — events + authUser : liste tous les événements pour le panel admin, triés par date décroissante
  return db
    .select({
      id: events.id,
      titre: events.titre,
      description: events.description,
      contenu: events.contenu,
      lieu: events.lieu,
      date: events.date,
      thumbnailUrl: events.thumbnailUrl,
      region: events.region,
      timeline: events.timeline,
      domaine: events.domaine,
      capaciteMax: events.capaciteMax,
      publishedAt: events.createdAt,
      authorName: authUser.name,
    })
    .from(events)
    .leftJoin(authUser, eq(events.organisateurId, authUser.id))
    .orderBy(desc(events.date));
}

export type AdminEventInput = {
  titre: string;
  description: string;
  contenu?: string;
  lieu: string;
  date: string;
  thumbnailUrl?: string | null;
  region: string;
  timeline: string;
  domaine: string;
  capaciteMax?: number | null;
};

export async function createAdminEvent(
  data: AdminEventInput,
  organisateurId: string,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  // INSERT — events : crée un événement depuis le panel admin
  const [event] = await db
    .insert(events)
    .values({
      titre: data.titre,
      description: data.description,
      contenu: data.contenu || "",
      lieu: data.lieu,
      date: new Date(data.date),
      thumbnailUrl: data.thumbnailUrl || null,
      region: data.region as Region,
      timeline: data.timeline as Timeline,
      domaine: data.domaine as Domaine,
      capaciteMax: data.capaciteMax ?? null,
      organisateurId,
    })
    .returning({ id: events.id, titre: events.titre });

  await logAudit({
    actorId: audit.actorId,
    actorName: audit.actorName,
    actorRole: audit.actorRole,
    action: "CREATE_EVENT",
    category: "events",
    severity: "success",
    target: `Événement : ${event.titre}`,
  });

  return event;
}

export async function updateAdminEvent(
  eventId: string,
  data: AdminEventInput,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  // UPDATE — events : met à jour un événement admin, WHERE id = eventId
  const [updated] = await db
    .update(events)
    .set({
      titre: data.titre,
      description: data.description,
      contenu: data.contenu || "",
      lieu: data.lieu,
      date: new Date(data.date),
      thumbnailUrl: data.thumbnailUrl || null,
      region: data.region as Region,
      timeline: data.timeline as Timeline,
      domaine: data.domaine as Domaine,
      capaciteMax: data.capaciteMax ?? null,
      updatedAt: new Date(),
    })
    .where(eq(events.id, eventId))
    .returning({ id: events.id, titre: events.titre });

  await logAudit({
    actorId: audit.actorId,
    actorName: audit.actorName,
    actorRole: audit.actorRole,
    action: "UPDATE_EVENT",
    category: "events",
    severity: "info",
    target: `Événement : ${updated.titre}`,
  });

  return updated;
}

export async function deleteAdminEvent(
  eventId: string,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  // DELETE — events : supprime un événement par son ID
  await db.delete(events).where(eq(events.id, eventId));
  await logAudit({
    actorId: audit.actorId,
    actorName: audit.actorName,
    actorRole: audit.actorRole,
    action: "DELETE_EVENT",
    category: "events",
    severity: "danger",
    target: `Événement ID : ${eventId}`,
  });
}

export async function listEventRegistrations(eventId: string) {
  // SELECT — eventRegistrations : liste les inscriptions d'un événement, triées par date
  return db
    .select({
      id: eventRegistrations.id,
      nom: eventRegistrations.nom,
      prenom: eventRegistrations.prenom,
      email: eventRegistrations.email,
      statut: eventRegistrations.statut,
      createdAt: eventRegistrations.createdAt,
    })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(eventRegistrations.createdAt);
}

export async function deleteEventRegistration(registrationId: string) {
  const [reg] = await db
    .select({
      id: eventRegistrations.id,
      eventId: eventRegistrations.eventId,
      statut: eventRegistrations.statut,
    })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);

  if (!reg) return;

  await db
    .delete(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId));

  if (reg.statut === "CONFIRME") {
    await promoteNextFromWaitlist(reg.eventId);
  }
}
