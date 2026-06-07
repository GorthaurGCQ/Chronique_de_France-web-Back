// GET  /api/events — Liste paginée des événements (public)
// POST /api/events — Création d'un événement (ADMIN / SCIENTIFIQUE)

import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth/jwt";
import { parseBody, createEventSchema, eventQuerySchema } from "@/models_M/schemas/validation";
import { listEvents, createEvent } from "@/lib/services/events.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

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

    const { data, meta } = await listEvents(parsed.data);
    return Response.json({ success: true, data, meta });
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload);

    const body = await req.json();
    const parsed = parseBody(createEventSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const event = await createEvent(parsed.data, jwtPayload.userId);

    return Response.json(
      {
        success: true,
        data: event,
        message: "Événement créé avec succès.",
      },
      { status: 201 },
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
