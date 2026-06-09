// POST /api/auth/forgot-password — Demande de réinitialisation { email } (public)

// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import { authUser } from "@/models_M/schema";
// Module : node_modules/drizzle-orm
import { eq } from "drizzle-orm";
// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";

/** Handler POST — déclenche l'envoi d'un email de réinitialisation de mot de passe */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validation : email obligatoire
    if (!email?.trim()) {
      return Response.json({ success: false, message: "Adresse e-mail requise." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Vérifie que le compte existe en BDD avant d'envoyer l'email
    const [user] = await db
      .select({ id: authUser.id })
      .from(authUser)
      .where(eq(authUser.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return Response.json(
        { success: false, message: "Aucun compte n'est associé à cette adresse e-mail." },
        { status: 404 }
      );
    }

    // Délégation à Better Auth pour générer le token et envoyer l'email
    const baseUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const internalReq = new Request(`${baseUrl}/api/auth/request-password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, redirectTo: "/reset-password" }),
    });

    const baRes = await auth.handler(internalReq);

    if (!baRes.ok) {
      const text = await baRes.text();
      console.error("[request-password-reset] Better Auth handler error:", baRes.status, text);
      return Response.json({ success: false, message: "Erreur lors de l'envoi. Réessayez." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[POST /api/auth/forgot-password]", err);
    return Response.json({ success: false, message: "Erreur interne. Réessayez." }, { status: 500 });
  }
}
