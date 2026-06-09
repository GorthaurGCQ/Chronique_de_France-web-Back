// =============================================================================
// PROXY CORS — Autorise les requêtes API depuis Expo (app mobile / web)
// CORS /api/* pour Expo (Next.js 16 — convention proxy.ts, pas middleware.ts)
// Cible : toutes les routes /api/* (matcher ci-dessous)
// =============================================================================

// Module : node_modules/next/server
import { NextResponse } from "next/server";
// Module : node_modules/next/server
import type { NextRequest } from "next/server";

// Origines autorisées en développement (Next.js + Expo)
const ALLOWED_ORIGINS = [
  "http://localhost:3000",   // Next.js web
  "http://localhost:8081",   // Expo Web
  "http://localhost:19006",  // Expo Web (port alternatif)
  "http://127.0.0.1:8081",
  "http://127.0.0.1:19006",
];

/** Vérifie si l'origine de la requête est autorisée (localhost ou réseau local Expo) */
function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Expo sur appareil physique / émulateur : IP LAN (192.168.x.x ou 10.x.x.x)
  return /^http:\/\/(192\.168|10)\.\d{1,3}\.\d{1,3}\.\d{1,3}:(8081|19006|3000)$/.test(origin);
}

/** Construit les en-têtes CORS pour la réponse */
function corsHeaders(origin: string | null) {
  const allowed =
    origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
    "Access-Control-Allow-Credentials": "true",       // Envoie les cookies de session
    "Access-Control-Expose-Headers": "set-auth-token", // Token bearer pour Expo
  };
}

/** Intercepte les requêtes /api/* et ajoute les en-têtes CORS */
export function proxy(request: NextRequest) {
  // Hors /api → pas de traitement CORS
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = request.headers.get("origin");

  // Préflight OPTIONS : répond immédiatement avec les en-têtes CORS
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
  }

  // Requête normale : ajoute CORS à la réponse Next.js
  const response = NextResponse.next();
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: "/api/:path*", // S'applique uniquement aux routes API
};
