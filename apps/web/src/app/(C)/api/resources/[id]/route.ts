// ROUTE API BACK — URL : /api/resources/:id

import { getAdminSessionOr403 } from "@/lib/auth/require-session";
import { parseBody, updateResourceSchema } from "@/models_M/schemas/validation";
import {
  getResourceById,
  resourceExists,
  updateResource,
  deleteResource,
} from "@/lib/services_M/resources.service";

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
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

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
    console.error("[PUT /api/resources/[id]]", error);
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

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
    console.error("[DELETE /api/resources/[id]]", error);
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}
