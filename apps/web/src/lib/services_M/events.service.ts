// =============================================================================
// COUCHE MODÈLE — Logique métier événements (requêtes BDD)
// Consommé par : /api/events/*, pages SSR événements, admin/events
// =============================================================================

// Module : node_modules/drizzle-orm
import { eq, or, ilike, and, asc, desc, gte, lt, count, inArray, SQL } from "drizzle-orm";
// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import {
  events,
  authUser,
  eventRegistrations,
  type RegistrationStatus,
} from "@/models_M/schema";
// Service : src/lib/services_M/mail.service.ts
import { sendEventRegistrationConfirmation } from "@/lib/services_M/mail.service";

export type ListEventsParams = {
  page: number;
  limit: number;
  search?: string;
};

export type EventCapacityInfo = {
  capaciteMax: number | null;
  inscriptionsConfirmees: number;
  listeAttenteCount: number;
  placesRestantes: number | null;
  complet: boolean;
};

export type RegisterForEventResult = {
  statut: RegistrationStatus;
  listeAttentePosition: number | null;
};

export function computeCapacityInfo(
  capaciteMax: number | null,
  inscriptionsConfirmees: number,
  listeAttenteCount: number,
): EventCapacityInfo {
  return {
    capaciteMax,
    inscriptionsConfirmees,
    listeAttenteCount,
    placesRestantes:
      capaciteMax == null ? null : Math.max(0, capaciteMax - inscriptionsConfirmees),
    complet: capaciteMax != null && inscriptionsConfirmees >= capaciteMax,
  };
}

async function getRegistrationCountsByEvent(eventIds: string[]) {
  const map = new Map<string, { confirme: number; listeAttente: number }>();
  if (eventIds.length === 0) return map;

  const rows = await db
    .select({
      eventId: eventRegistrations.eventId,
      statut: eventRegistrations.statut,
      total: count(),
    })
    .from(eventRegistrations)
    .where(inArray(eventRegistrations.eventId, eventIds))
    .groupBy(eventRegistrations.eventId, eventRegistrations.statut);

  for (const id of eventIds) {
    map.set(id, { confirme: 0, listeAttente: 0 });
  }
  for (const row of rows) {
    const entry = map.get(row.eventId)!;
    if (row.statut === "CONFIRME") entry.confirme = row.total;
    else entry.listeAttente = row.total;
  }
  return map;
}

async function enrichWithCapacity<
  T extends { id: string; capaciteMax: number | null },
>(items: T[]) {
  const counts = await getRegistrationCountsByEvent(items.map((i) => i.id));
  return items.map((item) => {
    const c = counts.get(item.id) ?? { confirme: 0, listeAttente: 0 };
    return {
      ...item,
      ...computeCapacityInfo(item.capaciteMax, c.confirme, c.listeAttente),
    };
  });
}

/** Liste paginée des événements avec recherche optionnelle */
export async function listEvents(params: ListEventsParams) {
  const { page, limit, search } = params;
  const skip = (page - 1) * limit;

  const conditions: (SQL | undefined)[] = [];
  if (search) {
    conditions.push(
      or(
        ilike(events.titre, `%${search}%`),
        ilike(events.description, `%${search}%`),
        ilike(events.lieu, `%${search}%`),
      ),
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: events.id,
        titre: events.titre,
        description: events.description,
        lieu: events.lieu,
        date: events.date,
        thumbnailUrl: events.thumbnailUrl,
        region: events.region,
        domaine: events.domaine,
        capaciteMax: events.capaciteMax,
        organisateurId: events.organisateurId,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        organisateur: {
          id: authUser.id,
          nom: authUser.name,
          email: authUser.email,
        },
      })
      .from(events)
      .leftJoin(authUser, eq(events.organisateurId, authUser.id))
      .where(where)
      .orderBy(asc(events.date))
      .limit(limit)
      .offset(skip),
    db.select({ total: count() }).from(events).where(where),
  ]);

  const data = await enrichWithCapacity(rows);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

const pageEventFields = {
  id: events.id,
  titre: events.titre,
  description: events.description,
  lieu: events.lieu,
  date: events.date,
  thumbnailUrl: events.thumbnailUrl,
  region: events.region,
  domaine: events.domaine,
  capaciteMax: events.capaciteMax,
  authorName: authUser.name,
};

/** Événements à venir + 6 derniers passés (page publique /evenement) */
export async function listUpcomingAndPastEvents() {
  const now = new Date();
  const [upcomingRows, pastRows] = await Promise.all([
    db
      .select(pageEventFields)
      .from(events)
      .leftJoin(authUser, eq(events.organisateurId, authUser.id))
      .where(gte(events.date, now))
      .orderBy(events.date),
    db
      .select(pageEventFields)
      .from(events)
      .leftJoin(authUser, eq(events.organisateurId, authUser.id))
      .where(lt(events.date, now))
      .orderBy(desc(events.date))
      .limit(6),
  ]);

  const [upcoming, past] = await Promise.all([
    enrichWithCapacity(upcomingRows),
    enrichWithCapacity(pastRows),
  ]);

  return { upcoming, past };
}

export async function getEventById(id: string) {
  const [event] = await db
    .select({
      id: events.id,
      titre: events.titre,
      description: events.description,
      lieu: events.lieu,
      date: events.date,
      capaciteMax: events.capaciteMax,
      organisateurId: events.organisateurId,
      createdAt: events.createdAt,
      updatedAt: events.updatedAt,
      organisateur: {
        id: authUser.id,
        nom: authUser.name,
        email: authUser.email,
      },
    })
    .from(events)
    .leftJoin(authUser, eq(events.organisateurId, authUser.id))
    .where(eq(events.id, id))
    .limit(1);

  if (!event) return null;
  const [enriched] = await enrichWithCapacity([event]);
  return enriched;
}

export async function eventExists(id: string) {
  const [event] = await db
    .select({ id: events.id, titre: events.titre })
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  return event ?? null;
}

/** Données événement pour confirmation e-mail d'inscription. */
export async function getEventForRegistration(id: string) {
  const [event] = await db
    .select({
      id: events.id,
      titre: events.titre,
      lieu: events.lieu,
      date: events.date,
      capaciteMax: events.capaciteMax,
    })
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  return event ?? null;
}

export async function countConfirmedRegistrations(eventId: string) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(eventRegistrations)
    .where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.statut, "CONFIRME"),
      ),
    );
  return total;
}

export async function countWaitlistRegistrations(eventId: string) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(eventRegistrations)
    .where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.statut, "LISTE_ATTENTE"),
      ),
    );
  return total;
}

export async function createEvent(
  data: { titre: string; description: string; lieu: string; date: Date },
  organisateurId: string,
) {
  const [event] = await db
    .insert(events)
    .values({ ...data, organisateurId })
    .returning();

  const [organisateur] = await db
    .select({ id: authUser.id, nom: authUser.name, email: authUser.email })
    .from(authUser)
    .where(eq(authUser.id, organisateurId))
    .limit(1);

  return { ...event, organisateur };
}

export async function updateEvent(
  id: string,
  data: Partial<{ titre: string; description: string; lieu: string; date: Date }>,
) {
  const [updated] = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();

  const [organisateur] = await db
    .select({ id: authUser.id, nom: authUser.name, email: authUser.email })
    .from(authUser)
    .where(eq(authUser.id, updated.organisateurId))
    .limit(1);

  return { ...updated, organisateur };
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id));
}

/** Inscription : place confirmée ou liste d'attente selon capaciteMax. */
export async function registerForEvent(
  eventId: string,
  nom: string,
  prenom: string,
  email: string,
): Promise<RegisterForEventResult> {
  const event = await getEventForRegistration(eventId);
  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  const confirmedCount = await countConfirmedRegistrations(eventId);
  const statut: RegistrationStatus =
    event.capaciteMax != null && confirmedCount >= event.capaciteMax
      ? "LISTE_ATTENTE"
      : "CONFIRME";

  await db.insert(eventRegistrations).values({
    eventId,
    nom: nom.trim(),
    prenom: prenom.trim(),
    email: email.trim().toLowerCase(),
    statut,
  });

  let listeAttentePosition: number | null = null;
  if (statut === "LISTE_ATTENTE") {
    const [{ total }] = await db
      .select({ total: count() })
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.statut, "LISTE_ATTENTE"),
        ),
      );
    listeAttentePosition = total;
  }

  return { statut, listeAttentePosition };
}

/** Promeut le premier de la liste d'attente après une désinscription. */
export async function promoteNextFromWaitlist(eventId: string): Promise<boolean> {
  const [event] = await db
    .select({
      id: events.id,
      titre: events.titre,
      lieu: events.lieu,
      date: events.date,
      capaciteMax: events.capaciteMax,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event?.capaciteMax) return false;

  const confirmedCount = await countConfirmedRegistrations(eventId);
  if (confirmedCount >= event.capaciteMax) return false;

  const [next] = await db
    .select({
      id: eventRegistrations.id,
      email: eventRegistrations.email,
      nom: eventRegistrations.nom,
      prenom: eventRegistrations.prenom,
    })
    .from(eventRegistrations)
    .where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.statut, "LISTE_ATTENTE"),
      ),
    )
    .orderBy(asc(eventRegistrations.createdAt))
    .limit(1);

  if (!next) return false;

  await db
    .update(eventRegistrations)
    .set({ statut: "CONFIRME" })
    .where(eq(eventRegistrations.id, next.id));

  await sendEventRegistrationConfirmation({
    to: next.email,
    prenom: next.prenom,
    nom: next.nom,
    event: {
      titre: event.titre,
      lieu: event.lieu ?? "Lieu à confirmer",
      date: event.date instanceof Date ? event.date : new Date(event.date),
    },
  });

  return true;
}
