// GET    /api/admin/resources — Liste complète des ressources (admin | founder)
// POST   /api/admin/resources — Création ressource, body JSON (admin | founder)
// PATCH  /api/admin/resources — Modification ressource { resourceId, … } (admin | founder)
// DELETE /api/admin/resources — Suppression ressource { resourceId } (admin | founder)

// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Module : node_modules/next/headers
import { headers } from "next/headers";
// Service : src/lib/services_M/admin/auth.ts
import { isAdminRole } from "@/lib/services_M/admin/auth";
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
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

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
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { titre, description, contenu, type, region, timeline, domaine, mediaUrl, bannerUrl, thumbnailUrl } = body;

    // Validation manuelle des champs obligatoires
    if (!titre || !description || !contenu || !type || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Insertion en BDD + journalisation audit
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
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { resourceId, titre, description, contenu, type, region, timeline, domaine, mediaUrl, bannerUrl, thumbnailUrl } = body;

    if (!resourceId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }
    if (!titre || !description || !contenu || !type || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Mise à jour en BDD + journalisation audit
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
    // Vérification session + rôle admin | founder
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    // Suppression en BDD + journalisation audit
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
