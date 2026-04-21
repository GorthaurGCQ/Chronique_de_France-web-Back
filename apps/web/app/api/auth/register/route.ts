// POST /api/auth/register — Création d'un compte utilisateur

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signJWT } from "@/lib/auth";
import { parseBody, registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseBody(registerSchema, body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Données invalides.", errors: parsed.errors },
        { status: 400 },
      );
    }

    const { nom, email, password } = parsed.data;

    // Vérifier si l'email est déjà utilisé
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return Response.json(
        { success: false, message: "Un compte existe déjà avec cette adresse e-mail." },
        { status: 409 },
      );
    }

    // Hasher le mot de passe (coût : 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const [user] = await db
      .insert(users)
      .values({ nom, email, password: hashedPassword })
      .returning({
        id: users.id,
        nom: users.nom,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    // Signer un JWT pour connexion immédiate
    const token = signJWT({ userId: user.id, email: user.email, role: user.role });

    return Response.json(
      { success: true, data: { user, token }, message: "Compte créé avec succès." },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { success: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}
