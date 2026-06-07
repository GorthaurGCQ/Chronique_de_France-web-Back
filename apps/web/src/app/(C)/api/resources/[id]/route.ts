// ROUTE API BACK — URL : /api/resources/:id

import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth/jwt";
import { parseBody, updateResourceSchema } from "@/models_M/schemas/validation";
import {
  getResourceById,
  resourceExists,
  updateResource,
  deleteResource,
} from "@/lib/services/resources.service";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const resource = await getResourceById(id);

    if (!resource) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: resource });
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN", "SCIENTIFIQUE"])(jwtPayload);

    const { id } = await params;

    if (!(await resourceExists(id))) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    const body = await req.json();
    const parsed = parseBody(updateResourceSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const updated = await updateResource(id, parsed.data);

    return Response.json({
      success: true,
      data: updated,
      message: "Ressource mise à jour avec succès.",
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

    const { id } = await params;

    if (!(await resourceExists(id))) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    await deleteResource(id);

    return Response.json({ success: true, message: "Ressource supprimée avec succès." });
  } catch (error) {
    return handleAuthError(error);
  }
}
