import { auth } from "@/lib/auth";
import { db } from "@/db";
import { authAccount } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { hashPassword, verifyPassword } from "@better-auth/utils/password";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ success: false, message: "Champs manquants." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return Response.json({ success: false, message: "Le nouveau mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    // Vérifier force du nouveau mot de passe
    const strongEnough =
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[^A-Za-z0-9]/.test(newPassword);
    if (!strongEnough) {
      return Response.json({
        success: false,
        message: "Le nouveau mot de passe doit contenir une majuscule, un chiffre et un symbole.",
      }, { status: 400 });
    }

    // Récupérer le hash actuel depuis authAccount
    const [account] = await db
      .select({ password: authAccount.password })
      .from(authAccount)
      .where(and(
        eq(authAccount.userId, session.user.id),
        eq(authAccount.providerId, "credential"),
      ))
      .limit(1);

    if (!account?.password) {
      return Response.json({ success: false, message: "Aucun mot de passe associé à ce compte." }, { status: 400 });
    }

    // Vérifier l'ancien mot de passe
    const valid = await verifyPassword(account.password, currentPassword);
    if (!valid) {
      return Response.json({ success: false, message: "Mot de passe actuel incorrect." }, { status: 403 });
    }

    // Hacher le nouveau mot de passe avec scrypt (compatible Better Auth)
    const newHash = await hashPassword(newPassword);

    await db
      .update(authAccount)
      .set({ password: newHash, updatedAt: new Date() })
      .where(and(
        eq(authAccount.userId, session.user.id),
        eq(authAccount.providerId, "credential"),
      ));

    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/profile/change-password]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
