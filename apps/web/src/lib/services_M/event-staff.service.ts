// =============================================================================
// SERVICE — Staff événement (organisateurs / animateurs sur event_staff)
// =============================================================================

import { eq, inArray } from "drizzle-orm";
import { db } from "@/models_M/db";
import {
  authUser,
  eventStaff,
  type EventStaffRole,
} from "@/models_M/schema";

export type EventStaffInput = {
  userId: string;
  role: EventStaffRole;
};

export type EventStaffMember = {
  userId: string;
  role: EventStaffRole;
  name: string;
  email: string;
};

export function resolvePrimaryOrganisateurId(staff: EventStaffInput[]): string | null {
  const organisateur = staff.find((s) => s.role === "ORGANISATEUR");
  return organisateur?.userId ?? staff[0]?.userId ?? null;
}

export function normalizeEventStaffInput(raw: unknown): EventStaffInput[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const result: EventStaffInput[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const userId = (item as { userId?: string }).userId;
    const role = (item as { role?: string }).role;
    if (!userId || (role !== "ANIMATEUR" && role !== "ORGANISATEUR")) continue;
    const key = `${userId}:${role}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ userId, role });
  }

  return result;
}

export async function replaceEventStaff(eventId: string, staff: EventStaffInput[]) {
  await db.delete(eventStaff).where(eq(eventStaff.eventId, eventId));
  if (staff.length === 0) return;

  await db.insert(eventStaff).values(
    staff.map((s) => ({
      eventId,
      userId: s.userId,
      role: s.role,
    })),
  );
}

export async function getEventStaffByEventId(eventId: string): Promise<EventStaffMember[]> {
  return db
    .select({
      userId: eventStaff.userId,
      role: eventStaff.role,
      name: authUser.name,
      email: authUser.email,
    })
    .from(eventStaff)
    .innerJoin(authUser, eq(eventStaff.userId, authUser.id))
    .where(eq(eventStaff.eventId, eventId));
}

export async function getEventStaffByEventIds(
  eventIds: string[],
): Promise<Map<string, EventStaffMember[]>> {
  const map = new Map<string, EventStaffMember[]>();
  if (eventIds.length === 0) return map;

  const rows = await db
    .select({
      eventId: eventStaff.eventId,
      userId: eventStaff.userId,
      role: eventStaff.role,
      name: authUser.name,
      email: authUser.email,
    })
    .from(eventStaff)
    .innerJoin(authUser, eq(eventStaff.userId, authUser.id))
    .where(inArray(eventStaff.eventId, eventIds));

  for (const id of eventIds) map.set(id, []);
  for (const row of rows) {
    map.get(row.eventId)!.push({
      userId: row.userId,
      role: row.role,
      name: row.name,
      email: row.email,
    });
  }

  return map;
}
