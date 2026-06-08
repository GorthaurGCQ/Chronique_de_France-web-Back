// COUCHE MODÈLE — événements

import { eq, or, ilike, and, asc, desc, gte, lt, count, SQL } from "drizzle-orm";
import { db } from "@/models_M/db";
import { events, authUser, eventRegistrations } from "@/models_M/schema";

export type ListEventsParams = {
  page: number;
  limit: number;
  search?: string;
};

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
    // SELECT — events + authUser (LEFT JOIN) : liste paginée des événements avec organisateur, filtrée par recherche, triée par date croissante
    db
      .select({
        id: events.id,
        titre: events.titre,
        description: events.description,
        lieu: events.lieu,
        date: events.date,
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
    // SELECT — events : compte le total d'événements (pagination), avec les mêmes filtres de recherche
    db.select({ total: count() }).from(events).where(where),
  ]);

  return {
    data: rows,
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
  authorName: authUser.name,
};

export async function listUpcomingAndPastEvents() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    // SELECT — events + authUser : événements à venir (date >= maintenant), triés par date
    db
      .select(pageEventFields)
      .from(events)
      .leftJoin(authUser, eq(events.organisateurId, authUser.id))
      .where(gte(events.date, now))
      .orderBy(events.date),
    // SELECT — events + authUser : 6 derniers événements passés (date < maintenant), du plus récent au plus ancien
    db
      .select(pageEventFields)
      .from(events)
      .leftJoin(authUser, eq(events.organisateurId, authUser.id))
      .where(lt(events.date, now))
      .orderBy(desc(events.date))
      .limit(6),
  ]);
  return { upcoming, past };
}

export async function getEventById(id: string) {
  // SELECT — events + authUser : détail d'un événement par ID avec infos de l'organisateur
  const [event] = await db
    .select({
      id: events.id,
      titre: events.titre,
      description: events.description,
      lieu: events.lieu,
      date: events.date,
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

  return event ?? null;
}

export async function eventExists(id: string) {
  // SELECT — events : vérifie l'existence d'un événement (retourne id et titre uniquement)
  const [event] = await db
    .select({ id: events.id, titre: events.titre })
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  return event ?? null;
}

export async function createEvent(
  data: { titre: string; description: string; lieu: string; date: Date },
  organisateurId: string,
) {
  // INSERT — events : crée un nouvel événement lié à un organisateur
  const [event] = await db
    .insert(events)
    .values({ ...data, organisateurId })
    .returning();

  // SELECT — authUser : récupère les infos de l'organisateur après création
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
  // UPDATE — events : met à jour les champs modifiés et updatedAt, WHERE id = événement ciblé
  const [updated] = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();

  // SELECT — authUser : récupère l'organisateur de l'événement mis à jour
  const [organisateur] = await db
    .select({ id: authUser.id, nom: authUser.name, email: authUser.email })
    .from(authUser)
    .where(eq(authUser.id, updated.organisateurId))
    .limit(1);

  return { ...updated, organisateur };
}

export async function deleteEvent(id: string) {
  // DELETE — events : supprime un événement par son ID
  await db.delete(events).where(eq(events.id, id));
}

export async function registerForEvent(
  eventId: string,
  nom: string,
  prenom: string,
  email: string,
) {
  // INSERT — eventRegistrations : enregistre une inscription (nom, prénom, email) à un événement
  await db.insert(eventRegistrations).values({
    eventId,
    nom: nom.trim(),
    prenom: prenom.trim(),
    email: email.trim().toLowerCase(),
  });
}
