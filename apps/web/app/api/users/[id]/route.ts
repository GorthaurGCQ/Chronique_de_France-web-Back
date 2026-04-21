// GET    /api/users/[id] — Profil d'un utilisateur (ADMIN)
// PUT    /api/users/[id] — Mise à jour du rôle ou des infos (ADMIN)
// DELETE /api/users/[id] — Suppression d'un compte (ADMIN)

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth";
import { parseBody, updateUserSchema } from "@/lib/validation";

type RouteParams = { params: Promise<{ id: string }> };

const userColumns = {
  id: users.id,
  nom: users.nom,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

// ---------------------------------------------------------------------------
// GET — Profil d'un utilisateur
// ---------------------------------------------------------------------------

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

    const { id } = await params;

    const [user] = await db
      .select(userColumns)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return Response.json(
        { success: false, message: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    return handleAuthError(error);
  }
}

// ---------------------------------------------------------------------------
// PUT — Mise à jour des infos ou du rôle
// ---------------------------------------------------------------------------

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

    const { id } = await params;

    const [existing] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existing) {
      return Response.json(
        { success: false, message: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    const body = await req.json();
    const parsed = parseBody(updateUserSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    // Vérifier l'unicité de l'email si modifié
    if (parsed.data.email && parsed.data.email !== existing.email) {
      const [emailTaken] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, parsed.data.email))
        .limit(1);

      if (emailTaken) {
        return Response.json(
          { success: false, message: "Cette adresse e-mail est déjà utilisée." },
          { status: 409 },
        );
      }
    }

    const [updated] = await db
      .update(users)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning(userColumns);

    return Response.json({
      success: true,
      data: updated,
      message: "Utilisateur mis à jour avec succès.",
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

// ---------------------------------------------------------------------------
// DELETE — Suppression d'un compte
// ---------------------------------------------------------------------------

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

    const { id } = await params;

    // Empêcher un admin de se supprimer lui-même
    if (jwtPayload.userId === id) {
      return Response.json(
        { success: false, message: "Vous ne pouvez pas supprimer votre propre compte." },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existing) {
      return Response.json(
        { success: false, message: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    await db.delete(users).where(eq(users.id, id));

    return Response.json({ success: true, message: "Compte supprimé avec succès." });
  } catch (error) {
    return handleAuthError(error);
  }
}
