import { auth } from "@/lib/auth";
import { db } from "@/db";
import { authUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const users = await db
      .select({
        id:                authUser.id,
        name:              authUser.name,
        email:             authUser.email,
        role:              authUser.role,
        banned:            authUser.banned,
        emailVerified:     authUser.emailVerified,
        customPermissions: authUser.customPermissions,
        createdAt:         authUser.createdAt,
      })
      .from(authUser)
      .orderBy(authUser.createdAt);

    return Response.json({ success: true, data: users });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "admin" && session.user.role !== "founder")) {
      return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action, role, permissions } = body;

    if (!userId) {
      return Response.json({ success: false, message: "userId manquant." }, { status: 400 });
    }
    if (userId === session.user.id) {
      return Response.json({ success: false, message: "Vous ne pouvez pas modifier votre propre compte ici." }, { status: 400 });
    }

    // Vérifier que la cible n'est pas le fondateur
    const [target] = await db.select({ role: authUser.role }).from(authUser).where(eq(authUser.id, userId)).limit(1);
    if (target?.role === "founder") {
      return Response.json({ success: false, message: "Le compte Fondateur est verrouillé et ne peut pas être modifié." }, { status: 403 });
    }

    // ── Mise à jour des droits (rôle + permissions) ───────────────────────
    if (action === "updatePermissions") {
      const [before] = await db.select({ role: authUser.role, name: authUser.name }).from(authUser).where(eq(authUser.id, userId)).limit(1);
      await db
        .update(authUser)
        .set({
          role:              role ?? "user",
          customPermissions: JSON.stringify(permissions ?? []),
          updatedAt:         new Date(),
        })
        .where(eq(authUser.id, userId));
      await logAudit({
        actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined,
        action: "UPDATE_USER_PERMISSIONS", category: "users", severity: "warning",
        target: `Utilisateur : ${before?.name ?? userId}`,
        details: `Rôle : ${before?.role ?? "?"} → ${role ?? "user"} · ${(permissions ?? []).length} droit(s)`,
      });
      return Response.json({ success: true });
    }

    // ── Actions simples ───────────────────────────────────────────────────
    const [targetUser] = await db.select({ name: authUser.name, email: authUser.email }).from(authUser).where(eq(authUser.id, userId)).limit(1);
    const targetLabel = targetUser ? `${targetUser.name} (${targetUser.email})` : userId;

    switch (action) {
      case "makeAdmin":
        await db.update(authUser).set({ role: "admin", updatedAt: new Date() }).where(eq(authUser.id, userId));
        await logAudit({ actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined, action: "MAKE_ADMIN", category: "users", severity: "warning", target: `Utilisateur : ${targetLabel}` });
        break;
      case "makeUser":
        await db.update(authUser).set({ role: "user", updatedAt: new Date() }).where(eq(authUser.id, userId));
        await logAudit({ actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined, action: "MAKE_USER", category: "users", severity: "info", target: `Utilisateur : ${targetLabel}` });
        break;
      case "ban":
        await db.update(authUser).set({ banned: true, updatedAt: new Date() }).where(eq(authUser.id, userId));
        await logAudit({ actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined, action: "BAN_USER", category: "users", severity: "danger", target: `Utilisateur : ${targetLabel}` });
        break;
      case "unban":
        await db.update(authUser).set({ banned: false, updatedAt: new Date() }).where(eq(authUser.id, userId));
        await logAudit({ actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined, action: "UNBAN_USER", category: "users", severity: "info", target: `Utilisateur : ${targetLabel}` });
        break;
      case "delete":
        await db.delete(authUser).where(eq(authUser.id, userId));
        await logAudit({ actorId: session.user.id, actorName: session.user.name, actorRole: session.user.role ?? undefined, action: "DELETE_USER", category: "users", severity: "danger", target: `Utilisateur : ${targetLabel}` });
        break;
      default:
        return Response.json({ success: false, message: "Action inconnue." }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/admin/users]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
