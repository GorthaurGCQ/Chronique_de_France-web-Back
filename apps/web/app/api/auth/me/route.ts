// GET /api/auth/me — Profil de l'utilisateur connecté (token requis)

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyJWT, handleAuthError } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const jwtPayload = verifyJWT(req);

    const [user] = await db
      .select({
        id: users.id,
        nom: users.nom,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, jwtPayload.userId))
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
