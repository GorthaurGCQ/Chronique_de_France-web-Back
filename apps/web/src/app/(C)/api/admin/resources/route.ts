// GET    /api/admin/resources — Liste complète des ressources
// POST   /api/admin/resources — Création ressource, body JSON
// PATCH  /api/admin/resources — Modification ressource { resourceId, … }
// DELETE /api/admin/resources — Suppression ressource { resourceId }

// Module : src/lib/permissions.shared.ts
import { RESSOURCES_SECTION_PERMISSIONS } from "@/lib/permissions.shared";
// Service : src/lib/services_M/admin/auth.ts
import { getAdminSessionOr403 } from "@/lib/services_M/admin/auth";
// Service : src/lib/services_M/admin/resources.service.ts
import {
  listAdminResources,
  createAdminResource,
  updateAdminResource,
  deleteAdminResource,
} from "@/lib/services_M/admin/resources.service";

/** Handler GET — retourne toutes les ressources pour le panel admin */
export async function GET() {
  try {
    const authResult = await getAdminSessionOr403(RESSOURCES_SECTION_PERMISSIONS);
    if (!authResult.ok) return authResult.response;

    const list = await listAdminResources();
    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/resources]", err);
    return Response.json(
      { success: false, message: "Erreur interne du serveur.", error: String(err) },
      { status: 500 },
    );
  }
}

/** Handler POST — crée une ressource depuis le panel admin (avec audit) */
export async function POST(req: Request) {
  try {
    const authResult = await getAdminSessionOr403([
      "GERER_RESSOURCES_ADMIN",
      "CREER_RESSOURCES",
    ]);
    if (!authResult.ok) return authResult.response;
    const session = authResult.session;

    const body = await req.json();
    const { titre, description, contenu, type, region, timeline, domaine, mediaUrl, bannerUrl, thumbnailUrl } = body;

    if (!titre || !description || !contenu || !type || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const resource = await createAdminResource(
      { titre, description, contenu, type, region, timeline, domaine, mediaUrl, bannerUrl, thumbnailUrl },
      session.user.id,
      { actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined },
    );

    return Response.json({ success: true, data: resource }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/resources]", err);
    return Response.json(
      { success: false, message: "Erreur interne du serveur.", error: String(err) },
      { status: 500 },
    );
  }
}

/** Handler PATCH — modifie une ressource depuis le panel admin (avec audit) */
export async function PATCH(req: Request) {
  try {
    const authResult = await getAdminSessionOr403([
      "GERER_RESSOURCES_ADMIN",
      "MODIFIER_RESSOURCES",
    ]);
    if (!authResult.ok) return authResult.response;
    const session = authResult.session;

    const body = await req.json();
    const { resourceId, titre, description, contenu, type, region, timeline, domaine, mediaUrl, bannerUrl, thumbnailUrl } = body;

    if (!resourceId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }
    if (!titre || !description || !contenu || !type || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const updated = await updateAdminResource(
      resourceId,
      { titre, description, contenu, type, region, timeline, domaine, mediaUrl, bannerUrl, thumbnailUrl },
      { actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined },
    );

    return Response.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/admin/resources]", err);
    return Response.json(
      { success: false, message: "Erreur interne du serveur.", error: String(err) },
      { status: 500 },
    );
  }
}

/** Handler DELETE — supprime une ressource depuis le panel admin (avec audit) */
export async function DELETE(req: Request) {
  try {
    const authResult = await getAdminSessionOr403([
      "GERER_RESSOURCES_ADMIN",
      "SUPPRIMER_RESSOURCES",
    ]);
    if (!authResult.ok) return authResult.response;
    const session = authResult.session;

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    await deleteAdminResource(resourceId, {
      actorId: session.user.id,
      actorName: session.user.name,
      actorRole: session.user.role ?? undefined,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/resources]", err);
    return Response.json(
      { success: false, message: "Erreur interne du serveur.", error: String(err) },
      { status: 500 },
    );
  }
}
