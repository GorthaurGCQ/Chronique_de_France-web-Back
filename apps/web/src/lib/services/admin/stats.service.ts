import { count, gte } from "drizzle-orm";
import { db } from "@/models_M/db";
import { authUser, resources, events } from "@/models_M/schema";

export async function getAdminStats() {
  const [[{ totalUsers }], [{ totalResources }], [{ totalEvents }]] =
    await Promise.all([
      db.select({ totalUsers: count() }).from(authUser),
      db.select({ totalResources: count() }).from(resources),
      db
        .select({ totalEvents: count() })
        .from(events)
        .where(gte(events.date, new Date())),
    ]);

  return { totalUsers, totalResources, totalEvents };
}
