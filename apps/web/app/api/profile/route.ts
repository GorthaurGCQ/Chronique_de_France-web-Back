import { auth } from "@/lib/auth";
import { db } from "@/db";
import { authUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ success: false, message: "Non authentifié." }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return Response.json({ success: false, message: "Nom invalide (minimum 2 caractères)." }, { status: 400 });
    }

    await db
      .update(authUser)
      .set({ name: name.trim(), updatedAt: new Date() })
      .where(eq(authUser.id, session.user.id));

    return Response.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/profile]", err);
    return Response.json({ success: false, message: "Erreur interne." }, { status: 500 });
  }
}
