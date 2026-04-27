import { auth } from "@/lib/auth";
import { db } from "@/db";
import { authUser } from "@/db/schema";
import { resources } from "@/db/schema";
import { events } from "@/db/schema";
import { count, gte } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
    return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
  }

  const [[{ totalUsers }], [{ totalResources }], [{ totalEvents }]] = await Promise.all([
    db.select({ totalUsers: count() }).from(authUser),
    db.select({ totalResources: count() }).from(resources),
    db.select({ totalEvents: count() }).from(events).where(gte(events.date, new Date())),
  ]);

  return Response.json({
    success: true,
    data: { totalUsers, totalResources, totalEvents },
  });
}
