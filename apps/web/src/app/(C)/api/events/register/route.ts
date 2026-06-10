// POST /api/events/register — Inscription à un événement { eventId, nom, prenom, email } (public)

// Service : src/lib/services_M/events.service.ts
import {
  getEventForRegistration,
  registerForEvent,
  computeCapacityInfo,
  countConfirmedRegistrations,
  countWaitlistRegistrations,
} from "@/lib/services_M/events.service";
// Service : src/lib/services_M/mail.service.ts
import {
  sendEventRegistrationConfirmation,
  sendEventWaitlistConfirmation,
} from "@/lib/services_M/mail.service";

/** Handler POST — inscrit un visiteur (place confirmée ou liste d'attente) */
export async function POST(req: Request) {
  try {
    const { eventId, nom, prenom, email } = await req.json();

    if (!eventId || !nom?.trim() || !prenom?.trim() || !email?.trim()) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const trimmedNom = nom.trim();
    const trimmedPrenom = prenom.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const event = await getEventForRegistration(eventId);
    if (!event) {
      return Response.json({ success: false, message: "Événement introuvable." }, { status: 404 });
    }

    const { statut, listeAttentePosition } = await registerForEvent(
      eventId,
      trimmedNom,
      trimmedPrenom,
      trimmedEmail,
    );

    const eventPayload = {
      titre: event.titre,
      lieu: event.lieu ?? "Lieu à confirmer",
      date: event.date instanceof Date ? event.date : new Date(event.date),
    };

    let emailSent = false;
    if (statut === "CONFIRME") {
      emailSent = await sendEventRegistrationConfirmation({
        to: trimmedEmail,
        prenom: trimmedPrenom,
        nom: trimmedNom,
        event: eventPayload,
      });
    } else {
      emailSent = await sendEventWaitlistConfirmation({
        to: trimmedEmail,
        prenom: trimmedPrenom,
        nom: trimmedNom,
        event: eventPayload,
        position: listeAttentePosition ?? 1,
      });
    }

    const confirmedCount = await countConfirmedRegistrations(eventId);
    const waitlistCount = await countWaitlistRegistrations(eventId);
    const capacity = computeCapacityInfo(event.capaciteMax, confirmedCount, waitlistCount);

    const message =
      statut === "CONFIRME"
        ? emailSent
          ? `Inscription confirmée pour « ${event.titre} ». Un e-mail de confirmation a été envoyé.`
          : `Inscription confirmée pour « ${event.titre} ». L'e-mail de confirmation n'a pas pu être envoyé.`
        : emailSent
          ? `Événement complet. Vous êtes en liste d'attente (position ${listeAttentePosition ?? "?"}) pour « ${event.titre} ».`
          : `Événement complet. Vous êtes en liste d'attente pour « ${event.titre} ». L'e-mail n'a pas pu être envoyé.`;

    return Response.json(
      {
        success: true,
        message,
        emailSent,
        statut,
        listeAttentePosition,
        data: capacity,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const pgCode =
      err && typeof err === "object" && "cause" in err
        ? (err.cause as { code?: string })?.code
        : undefined;
    if (
      pgCode === "23505" ||
      String(err).includes("unique") ||
      String(err).includes("duplicate")
    ) {
      return Response.json(
        { success: false, message: "Cette adresse e-mail est déjà inscrite à cet événement." },
        { status: 409 },
      );
    }
    console.error("[POST /api/events/register]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
