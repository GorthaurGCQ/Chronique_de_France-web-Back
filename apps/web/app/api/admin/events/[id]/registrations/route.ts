import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eventRegistrations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { id } = await params;
    const list = await db
      .select({
        id:        eventRegistrations.id,
        nom:       eventRegistrations.nom,
        prenom:    eventRegistrations.prenom,
        email:     eventRegistrations.email,
        createdAt: eventRegistrations.createdAt,
      })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, id))
      .orderBy(eventRegistrations.createdAt);

    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/events/[id]/registrations]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    await params; // ensure params resolved
    const { registrationId } = await req.json();
    if (!registrationId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    await db.delete(eventRegistrations).where(eq(eventRegistrations.id, registrationId));
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/events/[id]/registrations]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
