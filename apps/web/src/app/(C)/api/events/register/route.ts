// POST /api/events/register — Inscription à un événement { eventId, nom, prenom, email } (public)

import { eventExists, registerForEvent } from "@/lib/services_M/events.service";

export async function POST(req: Request) {
  try {
    const { eventId, nom, prenom, email } = await req.json();

    if (!eventId || !nom?.trim() || !prenom?.trim() || !email?.trim()) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const event = await eventExists(eventId);
    if (!event) {
      return Response.json({ success: false, message: "Événement introuvable." }, { status: 404 });
    }

    await registerForEvent(eventId, nom, prenom, email);

    return Response.json(
      { success: true, message: `Inscription confirmée pour « ${event.titre} ».` },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (String(err).includes("unique") || String(err).includes("duplicate")) {
      return Response.json(
        { success: false, message: "Cette adresse e-mail est déjà inscrite à cet événement." },
        { status: 409 },
      );
    }
    console.error("[POST /api/events/register]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
