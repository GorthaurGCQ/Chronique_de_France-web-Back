import { db } from "@/db";
import { authUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return Response.json({ success: false, message: "Adresse e-mail requise." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si le compte existe en base
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

    // Appel au handler interne de Better Auth (endpoint réel = /request-password-reset)
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
