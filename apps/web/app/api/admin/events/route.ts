import { auth } from "@/lib/auth";
import { db } from "@/db";
import { events, authUser, type Domaine, type Region, type Timeline } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { logAudit } from "@/lib/audit";

function isAdmin(role: string | null | undefined) {
  return role === "admin" || role === "founder";
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdmin(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const list = await db
      .select({
        id:           events.id,
        titre:        events.titre,
        description:  events.description,
        contenu:      events.contenu,
        lieu:         events.lieu,
        date:         events.date,
        thumbnailUrl: events.thumbnailUrl,
        region:       events.region,
        timeline:     events.timeline,
        domaine:      events.domaine,
        publishedAt:  events.createdAt,
        authorName:   authUser.name,
      })
      .from(events)
      .leftJoin(authUser, eq(events.organisateurId, authUser.id))
      .orderBy(desc(events.date));

    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/events]", err);
    return Response.json({ success: false, message: "Erreur interne.", error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdmin(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine } = body;

    if (!titre || !description || !lieu || !date || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const [event] = await db
      .insert(events)
      .values({
        titre,
        description,
        contenu: contenu || "",
        lieu,
        date: new Date(date),
        thumbnailUrl: thumbnailUrl || null,
        region:   region   as Region,
        timeline: timeline as Timeline,
        domaine:  domaine  as Domaine,
        organisateurId: session.user.id,
      })
      .returning({ id: events.id, titre: events.titre });

    await logAudit({
      actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined,
      action: "CREATE_EVENT", category: "events", severity: "success",
      target: `Événement : ${event.titre}`,
    });
    return Response.json({ success: true, data: event }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/events]", err);
    return Response.json({ success: false, message: "Erreur interne.", error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdmin(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { eventId, titre, description, contenu, lieu, date, thumbnailUrl, region, timeline, domaine } = body;

    if (!eventId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }
    if (!titre || !description || !lieu || !date || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const [updated] = await db
      .update(events)
      .set({
        titre,
        description,
        contenu: contenu || "",
        lieu,
        date: new Date(date),
        thumbnailUrl: thumbnailUrl || null,
        region:   region   as Region,
        timeline: timeline as Timeline,
        domaine:  domaine  as Domaine,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning({ id: events.id, titre: events.titre });

    await logAudit({
      actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined,
      action: "UPDATE_EVENT", category: "events", severity: "info",
      target: `Événement : ${updated.titre}`,
    });
    return Response.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/admin/events]", err);
    return Response.json({ success: false, message: "Erreur interne.", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdmin(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { eventId } = await req.json();
    if (!eventId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    await db.delete(events).where(eq(events.id, eventId));
    await logAudit({
      actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined,
      action: "DELETE_EVENT", category: "events", severity: "danger",
      target: `Événement ID : ${eventId}`,
    });
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/events]", err);
    return Response.json({ success: false, message: "Erreur interne.", error: String(err) }, { status: 500 });
  }
}
