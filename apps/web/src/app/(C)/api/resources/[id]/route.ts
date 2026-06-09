// GET    /api/resources/[id] — Détail d'une ressource (public)
// PUT    /api/resources/[id] — Modification, body JSON validé (admin | founder)
// DELETE /api/resources/[id] — Suppression (admin | founder)

// Auth : src/lib/auth/require-session.ts
import { getAdminSessionOr403 } from "@/lib/auth/require-session";
// Modèle : src/models_M/schemas/validation.ts
import { parseBody, updateResourceSchema } from "@/models_M/schemas/validation";
// Service : src/lib/services_M/resources.service.ts
import {
  getResourceById,
  resourceExists,
  updateResource,
  deleteResource,
} from "@/lib/services_M/resources.service";

type RouteParams = { params: Promise<{ id: string }> };

/** Handler GET — retourne le détail d'une ressource par son ID (accès public) */
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Recherche de la ressource en BDD
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

/** Handler PUT — modifie une ressource existante (réservé admin | founder) */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    // Vérification session + rôle admin | founder
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    const { id } = await params;

    // Vérifie que la ressource existe avant modification
    if (!(await resourceExists(id))) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    // Lecture et validation du body JSON (schéma updateResourceSchema)
    const body = await req.json();
    const parsed = parseBody(updateResourceSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    // Mise à jour en BDD via le service
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

/** Handler DELETE — supprime une ressource (réservé admin | founder) */
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    // Vérification session + rôle admin | founder
    const authResult = await getAdminSessionOr403();
    if (!authResult.ok) return authResult.response;

    const { id } = await params;

    // Vérifie que la ressource existe avant suppression
    if (!(await resourceExists(id))) {
      return Response.json(
        { success: false, message: "Ressource introuvable." },
        { status: 404 },
      );
    }

    // Suppression en BDD via le service
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
