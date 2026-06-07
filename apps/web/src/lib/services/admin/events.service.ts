import { eq, desc } from "drizzle-orm";
import { db } from "@/models_M/db";
import {
  events,
  authUser,
  eventRegistrations,
  type Domaine,
  type Region,
  type Timeline,
} from "@/models_M/schema";
import { logAudit } from "@/lib/audit";

export async function listAdminEvents() {
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
};

export async function createAdminEvent(
  data: AdminEventInput,
  organisateurId: string,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
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
  return db
    .select({
      id: eventRegistrations.id,
      nom: eventRegistrations.nom,
      prenom: eventRegistrations.prenom,
      email: eventRegistrations.email,
      createdAt: eventRegistrations.createdAt,
    })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(eventRegistrations.createdAt);
}

export async function deleteEventRegistration(registrationId: string) {
  await db
    .delete(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId));
}
