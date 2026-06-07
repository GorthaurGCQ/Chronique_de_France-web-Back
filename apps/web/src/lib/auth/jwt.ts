// =============================================================================
// COUCHE BACK (utilitaires) — Authentification JWT pour certaines routes API
// Alternative à Better Auth session : header Authorization: Bearer <token>
// Utilisé par ex. PUT/DELETE /api/resources/[id]
// =============================================================================

import jwt from "jsonwebtoken";
import type { Role } from "@/models_M/schema";
import type { JwtPayload } from "@/models_M/types";

// Secret partagé serveur ↔ token (variable d'environnement, jamais exposée au front)
const JWT_SECRET = process.env.JWT_SECRET;
// Durée de validité du token signé
const JWT_EXPIRY = "7d";

// ---------------------------------------------------------------------------
// Génération du token (appelé après login réussi dans /api/auth/login)
// ---------------------------------------------------------------------------

export function signJWT(payload: Omit<JwtPayload, "iat" | "exp">): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET est absent des variables d'environnement.");
  }
  // Signe le payload (userId, email, role) avec algorithme HS256
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY, algorithm: "HS256" });
}

// ---------------------------------------------------------------------------
// Vérification du token depuis le header Authorization de la requête HTTP
// ---------------------------------------------------------------------------

export function verifyJWT(req: Request): JwtPayload {
  if (!JWT_SECRET) {
    throw new AuthError("JWT_SECRET est absent des variables d'environnement.", 500);
  }

  // Lit l'en-tête HTTP "Authorization"
  const authHeader = req.headers.get("Authorization");
  // Format attendu : "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Token d'authentification manquant.", 401);
  }

  // Retire le préfixe "Bearer " pour ne garder que le token
  const token = authHeader.slice(7);

  try {
    // Vérifie signature + expiration ; retourne le contenu décodé
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    throw new AuthError("Token invalide ou expiré.", 401);
  }
}

// ---------------------------------------------------------------------------
// Guard de rôle : vérifie que l'utilisateur a un des rôles autorisés
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
// Erreur métier avec code HTTP associé (401, 403, 500…)
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
// Convertit AuthError → Response.json pour les route.ts
// ---------------------------------------------------------------------------

export function handleAuthError(error: unknown): Response {
  if (error instanceof AuthError) {
    return Response.json({ success: false, message: error.message }, { status: error.statusCode });
  }
  return Response.json({ success: false, message: "Erreur interne du serveur." }, { status: 500 });
}
