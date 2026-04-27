import { db } from "@/db";
import { eventRegistrations, events } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { eventId, nom, prenom, email } = await req.json();

    if (!eventId || !nom?.trim() || !prenom?.trim() || !email?.trim()) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Vérifier que l'événement existe
    const [event] = await db.select({ id: events.id, titre: events.titre })
      .from(events).where(eq(events.id, eventId)).limit(1);
    if (!event) {
      return Response.json({ success: false, message: "Événement introuvable." }, { status: 404 });
    }

    await db.insert(eventRegistrations).values({
      eventId,
      nom:    nom.trim(),
      prenom: prenom.trim(),
      email:  email.trim().toLowerCase(),
    });

    return Response.json({ success: true, message: `Inscription confirmée pour « ${event.titre} ».` }, { status: 201 });
  } catch (err: unknown) {
    // Doublon email+event → unique constraint
    if (String(err).includes("unique") || String(err).includes("duplicate")) {
      return Response.json({ success: false, message: "Cette adresse e-mail est déjà inscrite à cet événement." }, { status: 409 });
    }
    console.error("[POST /api/events/register]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
