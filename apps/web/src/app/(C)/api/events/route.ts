// GET  /api/events — Liste paginée ?page&limit&search (public)
// POST /api/events — Création événement, body JSON validé (admin | founder)

import { getAdminSessionOr403 } from "@/lib/auth/require-session";
import { parseBody, createEventSchema, eventQuerySchema } from "@/models_M/schemas/validation";
import { listEvents, createEvent } from "@/lib/services_M/events.service";

/** Handler GET — retourne la liste paginée des événements (accès public) */
export async function GET(req: Request) {
  try {
    // Extraction des query params (?page, ?limit, ?search)
    const { searchParams } = new URL(req.url);

    // Validation Zod des paramètres de pagination/recherche
    const parsed = eventQuerySchema.safeParse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
      search: searchParams.get("search") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Paramètres de requête invalides." },
        { status: 400 },
      );
    }

    // Appel service métier — requête BDD paginée
    const { data, meta } = await listEvents(parsed.data);
    return Response.json({ success: true, data, meta });
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

/** Handler POST — crée un événement (réservé admin | founder) */
export async function POST(req: Request) {
  try {
    // Vérification session + rôle admin | founder
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    // Lecture et validation du body JSON (schéma createEventSchema)
    const body = await req.json();
    const parsed = parseBody(createEventSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    // Insertion en BDD via le service, avec l'ID de l'auteur
    const event = await createEvent(parsed.data, authResult.session.user.id);

    return Response.json(
      {
        success: true,
        data: event,
        message: "Événement créé avec succès.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/events]", error);
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}
