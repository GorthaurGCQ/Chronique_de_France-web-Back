// =============================================================================
// ROUTE API BACK — URL : /api/admin/resources
// CRUD admin ressources | Appelée par app/admin/ressources/page.tsx (fetch)
// Auth : session Better Auth + rôle admin ou founder
// =============================================================================

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { resources, authUser, type Domaine } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { logAudit } from "@/lib/audit"; // journal des actions admin

// ── GET : liste toutes les ressources (admin) ────────────────────────────────
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    // Contrôle d'accès : connecté ET rôle autorisé
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const list = await db
      .select({
        id:          resources.id,
        titre:       resources.titre,
        description: resources.description,
        contenu:     resources.contenu,
        type:        resources.type,
        region:      resources.region,
        timeline:    resources.timeline,
        domaine:     resources.domaine,
        mediaUrl:     resources.mediaUrl,
        bannerUrl:    resources.bannerUrl,
        thumbnailUrl: resources.thumbnailUrl,
        publishedAt:  resources.publishedAt,
        authorName:  authUser.name,
      })
      .from(resources)
      .leftJoin(authUser, eq(resources.authorId, authUser.id))
      .orderBy(desc(resources.publishedAt));

    return Response.json({ success: true, data: list });
  } catch (err) {
    console.error("[GET /api/admin/resources]", err);
    return Response.json({ success: false, message: "Erreur interne du serveur.", error: String(err) }, { status: 500 });
  }
}

// ── POST : créer une ressource ───────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json(); // JSON envoyé par le formulaire admin (front)
    const { titre, description, contenu, type, region, timeline, domaine, mediaUrl, bannerUrl, thumbnailUrl } = body;

    if (!titre || !description || !contenu || !type || !region || !timeline || !domaine) {
      return Response.json({ success: false, message: "Tous les champs sont requis." }, { status: 400 });
    }

    const [resource] = await db
      .insert(resources)
      .values({
        titre,
        description,
        contenu,
        type,
        region,
        timeline,
        domaine: domaine as Domaine,
        mediaUrl:     mediaUrl     || null,
        bannerUrl:    bannerUrl    || null,
        thumbnailUrl: thumbnailUrl || null,
        authorId: session.user.id, // auteur = admin connecté
      })
      .returning({ id: resources.id, titre: resources.titre });

    await logAudit({
      actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined,
      action: "CREATE_RESOURCE", category: "resources", severity: "success",
      target: `Ressource : ${resource.titre}`,
    });
    return Response.json({ success: true, data: resource }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/resources]", err);
    return Response.json({ success: false, message: "Erreur interne du serveur.", error: String(err) }, { status: 500 });
  }
}

// ── PATCH : modifier une ressource existante ─────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
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

    const [updated] = await db
      .update(resources)
      .set({
        titre,
        description,
        contenu,
        type,
        region,
        timeline,
        domaine:   domaine as Domaine,
        mediaUrl:     mediaUrl     || null,
        bannerUrl:    bannerUrl    || null,
        thumbnailUrl: thumbnailUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(resources.id, resourceId))
      .returning({ id: resources.id, titre: resources.titre });

    await logAudit({
      actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined,
      action: "UPDATE_RESOURCE", category: "resources", severity: "info",
      target: `Ressource : ${updated.titre}`,
    });
    return Response.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/admin/resources]", err);
    return Response.json({ success: false, message: "Erreur interne du serveur.", error: String(err) }, { status: 500 });
  }
}

// ── DELETE : supprimer une ressource ─────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return Response.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    await db.delete(resources).where(eq(resources.id, resourceId));
    await logAudit({
      actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined,
      action: "DELETE_RESOURCE", category: "resources", severity: "danger",
      target: `Ressource ID : ${resourceId}`,
    });
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/resources]", err);
    return Response.json({ success: false, message: "Erreur interne du serveur.", error: String(err) }, { status: 500 });
  }
}
