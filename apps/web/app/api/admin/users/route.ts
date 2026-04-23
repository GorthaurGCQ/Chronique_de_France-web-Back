import { auth } from "@/lib/auth";
import { db } from "@/db";
import { authUser } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
  }

  const users = await db
    .select({
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      banned: authUser.banned,
      emailVerified: authUser.emailVerified,
      createdAt: authUser.createdAt,
    })
    .from(authUser)
    .orderBy(authUser.createdAt);

  return Response.json({ success: true, data: users });
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return Response.json({ success: false, message: "Accès refusé." }, { status: 403 });
  }

  const { userId, action } = await req.json();

  if (!userId || !action) {
    return Response.json({ success: false, message: "Paramètres manquants." }, { status: 400 });
  }

  if (userId === session.user.id) {
    return Response.json({ success: false, message: "Vous ne pouvez pas modifier votre propre compte ici." }, { status: 400 });
  }

  switch (action) {
    case "makeAdmin":
      await db.update(authUser).set({ role: "admin" }).where(eq(authUser.id, userId));
      break;
    case "makeUser":
      await db.update(authUser).set({ role: "user" }).where(eq(authUser.id, userId));
      break;
    case "ban":
      await db.update(authUser).set({ banned: true }).where(eq(authUser.id, userId));
      break;
    case "unban":
      await db.update(authUser).set({ banned: false }).where(eq(authUser.id, userId));
      break;
    case "delete":
      await db.delete(authUser).where(eq(authUser.id, userId));
      break;
    default:
      return Response.json({ success: false, message: "Action inconnue." }, { status: 400 });
  }

  return Response.json({ success: true });
}
