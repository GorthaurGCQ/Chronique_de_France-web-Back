import { auth } from "@/lib/auth";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // resources | users | events | null = all

    const query = db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(200);

    const list = category
      ? await db.select().from(auditLogs)
          .where(eq(auditLogs.category, category))
          .orderBy(desc(auditLogs.createdAt))
          .limit(200)
      : await query;

    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/audit]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
