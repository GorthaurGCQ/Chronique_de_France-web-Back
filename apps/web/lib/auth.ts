// Helpers d'authentification JWT — Fondation Chroniques de France

import jwt from "jsonwebtoken";
import type { Role } from "@/db/schema";
import type { JwtPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d";

// ---------------------------------------------------------------------------
// Génération du token
// ---------------------------------------------------------------------------

export function signJWT(payload: Omit<JwtPayload, "iat" | "exp">): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET est absent des variables d'environnement.");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY, algorithm: "HS256" });
}

// ---------------------------------------------------------------------------
// Vérification du token depuis le header Authorization
// ---------------------------------------------------------------------------

export function verifyJWT(req: Request): JwtPayload {
  if (!JWT_SECRET) {
    throw new AuthError("JWT_SECRET est absent des variables d'environnement.", 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Token d'authentification manquant.", 401);
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    throw new AuthError("Token invalide ou expiré.", 401);
  }
}

// ---------------------------------------------------------------------------
// Guard de rôle
// ---------------------------------------------------------------------------

export function requireRole(allowedRoles: Role[]): (user: JwtPayload) => void {
  return (user: JwtPayload) => {
    if (!allowedRoles.includes(user.role)) {
      throw new AuthError(
        `Accès refusé. Rôles autorisés : ${allowedRoles.join(", ")}.`,
        403,
      );
    }
  };
}

// ---------------------------------------------------------------------------
// Classe d'erreur d'authentification personnalisée
// ---------------------------------------------------------------------------

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 401,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ---------------------------------------------------------------------------
// Helper pour construire une réponse d'erreur JSON depuis une AuthError
// ---------------------------------------------------------------------------

export function handleAuthError(error: unknown): Response {
  if (error instanceof AuthError) {
    return Response.json({ success: false, message: error.message }, { status: error.statusCode });
  }
  return Response.json({ success: false, message: "Erreur interne du serveur." }, { status: 500 });
}
