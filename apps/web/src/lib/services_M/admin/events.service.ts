// =============================================================================
// SERVICE ADMIN — CRUD événements + inscriptions (avec audit)
// Consommé par : /api/admin/events/*, page /admin/evenements
// =============================================================================

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
import { logAudit } from "@/lib/services_M/audit";
import { cancelEventRegistration } from "@/lib/services_M/events.service";
import {
  type EventStaffInput,
  getEventStaffByEventIds,
  replaceEventStaff,
  resolvePrimaryOrganisateurId,
} from "@/lib/services_M/event-staff.service";

export async function listAdminEvents() {
  const rows = await db
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

  const staffMap = await getEventStaffByEventIds(rows.map((r) => r.id));
  return rows.map((row) => ({
    ...row,
    staff: staffMap.get(row.id) ?? [],
  }));
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
  fallbackOrganisateurId: string,
  staff: EventStaffInput[],
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  const resolvedStaff =
    staff.length > 0
      ? staff
      : [{ userId: fallbackOrganisateurId, role: "ORGANISATEUR" as const }];

  const organisateurId = resolvePrimaryOrganisateurId(resolvedStaff);
  if (!organisateurId) throw new Error("STAFF_ORGANISATEUR_REQUIRED");

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

  await replaceEventStaff(event.id, resolvedStaff);

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
  staff: EventStaffInput[] | undefined,
  audit: { actorId: string; actorName: string; actorRole?: string },
) {
  const patch: Partial<typeof events.$inferInsert> = {
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
  };

  if (staff !== undefined) {
    if (staff.length === 0) throw new Error("STAFF_ORGANISATEUR_REQUIRED");
    const organisateurId = resolvePrimaryOrganisateurId(staff);
    if (!organisateurId) throw new Error("STAFF_ORGANISATEUR_REQUIRED");
    patch.organisateurId = organisateurId;
    await replaceEventStaff(eventId, staff);
  }

  const [updated] = await db
    .update(events)
    .set(patch)
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
      statut: eventRegistrations.statut,
      createdAt: eventRegistrations.createdAt,
    })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(eventRegistrations.createdAt);
}

export async function deleteEventRegistration(registrationId: string) {
  await cancelEventRegistration(registrationId);
}
