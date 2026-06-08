import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminRole } from "@/lib/services_M/admin/auth";
import {
  listAdminResources,
  createAdminResource,
  updateAdminResource,
  deleteAdminResource,
} from "@/lib/services_M/admin/resources.service";

export async function GET() {
  try {
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

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

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

export async function PATCH(req: Request) {
  try {
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

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !isAdminRole(session.user.role)) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

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
