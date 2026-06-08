import { count, gte } from "drizzle-orm";
import { db } from "@/models_M/db";
import { authUser, resources, events } from "@/models_M/schema";

export async function getAdminStats() {
  const [[{ totalUsers }], [{ totalResources }], [{ totalEvents }]] =
    await Promise.all([
      // SELECT — authUser : compte le nombre total d'utilisateurs
      db.select({ totalUsers: count() }).from(authUser),
      // SELECT — resources : compte le nombre total de ressources
      db.select({ totalResources: count() }).from(resources),
      // SELECT — events : compte les événements à venir (date >= aujourd'hui)
      db
        .select({ totalEvents: count() })
        .from(events)
        .where(gte(events.date, new Date())),
    ]);

  return { totalUsers, totalResources, totalEvents };
}
