// GET  /api/resources — Liste paginée des ressources (public)
// POST /api/resources — Création d'une ressource (ADMIN / SCIENTIFIQUE)

import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth/jwt";
import { parseBody, createResourceSchema, resourceQuerySchema } from "@/models_M/schemas/validation";
import { listResources, createResource } from "@/lib/services/resources.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = resourceQuerySchema.safeParse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
      search: searchParams.get("search") ?? undefined,
      type: searchParams.get("type") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Paramètres de requête invalides." },
        { status: 400 },
      );
    }

    const { data, meta } = await listResources(parsed.data);
    return Response.json({ success: true, data, meta });
  } catch (error) {
    console.error("[GET /api/resources]", error);
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
    const parsed = parseBody(createResourceSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const resource = await createResource(parsed.data, jwtPayload.userId);

    return Response.json(
      { success: true, data: resource, message: "Ressource créée avec succès." },
      { status: 201 },
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
