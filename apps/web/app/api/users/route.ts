// GET /api/users — Liste des utilisateurs (ADMIN uniquement)

import { desc, count } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyJWT, requireRole, handleAuthError } from "@/lib/auth";
import { paginationSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const jwtPayload = verifyJWT(req);
    requireRole(["ADMIN"])(jwtPayload);

    const { searchParams } = new URL(req.url);

    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
    });

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Paramètres de requête invalides." },
        { status: 400 },
      );
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const [rows, [{ total }]] = await Promise.all([
      db
        .select({
          id: users.id,
          nom: users.nom,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(skip),

      db.select({ total: count() }).from(users),
    ]);

    return Response.json({
      success: true,
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
