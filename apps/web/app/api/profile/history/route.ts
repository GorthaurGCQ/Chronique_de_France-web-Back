import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resourceViews, resources } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

// ── GET : récupérer les dernières ressources vues ──────────────────────────
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    const rows = await db
      .select({
        resourceId: resourceViews.resourceId,
        viewedAt:   resourceViews.viewedAt,
        titre:        resources.titre,
        description:  resources.description,
        type:         resources.type,
        timeline:     resources.timeline,
        thumbnailUrl: resources.thumbnailUrl,
      })
      .from(resourceViews)
      .innerJoin(resources, eq(resourceViews.resourceId, resources.id))
      .where(eq(resourceViews.userId, session.user.id))
      .orderBy(desc(resourceViews.viewedAt))
      .limit(10);

    return Response.json({ success: true, data: rows });
  } catch (err) {
    console.error("[GET /api/profile/history]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}

// ── POST : enregistrer une vue (upsert) ────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false }, { status: 401 });

    const { resourceId } = await req.json();
    if (!resourceId) return Response.json({ success: false }, { status: 400 });

    // Upsert : met à jour viewedAt si la ligne existe déjà
    await db
      .insert(resourceViews)
      .values({ userId: session.user.id, resourceId, viewedAt: new Date() })
      .onConflictDoUpdate({
        target: [resourceViews.userId, resourceViews.resourceId],
        set: { viewedAt: new Date() },
      });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/profile/history]", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
