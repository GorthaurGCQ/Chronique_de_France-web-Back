import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resources, authUser } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
  }

  const list = await db
    .select({
      id: resources.id,
      titre: resources.titre,
      description: resources.description,
      type: resources.type,
      region: resources.region,
      timeline: resources.timeline,
      publishedAt: resources.publishedAt,
      authorName: authUser.name,
    })
    .from(resources)
    .leftJoin(authUser, eq(resources.authorId, authUser.id))
    .orderBy(desc(resources.publishedAt));

  return Response.json({ success: true, data: list });
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { titre, description, contenu, type, region, timeline } = body;

    if (!titre || !description || !contenu || !type || !region || !timeline) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const [resource] = await db
      .insert(resources)
      .values({
        titre,
        description,
        contenu,
        type,
        region,
        timeline,
        authorId: session.user.id,
      })
      .returning({ id: resources.id, titre: resources.titre });

    return Response.json({ success: true, data: resource }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/resources]", err);
    return Response.json({ success: false, message: "Erreur interne du serveur.", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    await db.delete(resources).where(eq(resources.id, resourceId));
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/resources]", err);
    return Response.json({ success: false, message: "Erreur interne du serveur.", error: String(err) }, { status: 500 });
  }
}
