// POST /api/auth/login — Connexion d'un utilisateur

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signJWT } from "@/lib/auth";
import { parseBody, loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseBody(loginSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // Rechercher l'utilisateur
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Message générique pour ne pas révéler si l'email existe
    if (!user) {
      return Response.json(
        { success: false, message: "Identifiants incorrects." },
        { status: 401 },
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { success: false, message: "Identifiants incorrects." },
        { status: 401 },
      );
    }

    // Signer le JWT
    const token = signJWT({ userId: user.id, email: user.email, role: user.role });

    const { password: _, ...safeUser } = user;

    return Response.json(
      { success: true, data: { user: safeUser, token }, message: "Connexion réussie." },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}
