// POST /api/events/register — Inscription à un événement { eventId, nom, prenom, email } (public)

import { eventExists, registerForEvent } from "@/lib/services_M/events.service";

/** Handler POST — inscrit un visiteur à un événement (accès public, sans session) */
export async function POST(req: Request) {
  try {
    // Lecture des champs du formulaire d'inscription
    const { eventId, nom, prenom, email } = await req.json();

    // Validation : tous les champs sont obligatoires
    if (!eventId || !nom?.trim() || !prenom?.trim() || !email?.trim()) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Vérifie que l'événement ciblé existe en BDD
    const event = await eventExists(eventId);
    if (!event) {
      return Response.json({ success: false, message: "Événement introuvable." }, { status: 404 });
    }

    // Enregistrement de l'inscription en BDD
    await registerForEvent(eventId, nom, prenom, email);

    return Response.json(
      { success: true, message: `Inscription confirmée pour « ${event.titre} ».` },
      { status: 201 },
    );
  } catch (err: unknown) {
    // Gestion du doublon email/événement (contrainte unique BDD)
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
