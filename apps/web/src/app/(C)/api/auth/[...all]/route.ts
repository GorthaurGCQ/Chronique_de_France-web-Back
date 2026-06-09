// =============================================================================
// CONTRÔLEUR — /api/auth/* (Better Auth)
// GET|POST — login, logout, session, register, reset password… (selon endpoint)
// Rôles : gérés par Better Auth (user | admin | founder)
// =============================================================================

// Configuration serveur Better Auth (BDD, emails, rôles)
// Auth : src/lib/auth/auth.ts
import { auth } from "@/lib/auth/auth";
// Adaptateur Next.js : transforme l'objet auth en handlers GET/POST Next
// Module : node_modules/better-auth/next-js
import { toNextJsHandler } from "better-auth/next-js";

const { GET, POST: basePOST } = toNextJsHandler(auth);

export { GET };

/**
 * Better Auth parse le corps JSON même sur /sign-out (sans champs requis).
 * Un POST avec Content-Type: application/json et corps vide provoque :
 * SyntaxError: Unexpected end of JSON input → HTTP 500
 * @see https://github.com/better-auth/better-auth/issues/9295
 */
export async function POST(req: Request) {
  const { pathname } = new URL(req.url);
  if (pathname.endsWith("/sign-out")) {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const text = await req.text();
      if (!text.trim()) {
        return basePOST(
          new Request(req.url, { method: "POST", headers: req.headers, body: "{}" }),
        );
      }
      return basePOST(
        new Request(req.url, { method: "POST", headers: req.headers, body: text }),
      );
    }
  }
  return basePOST(req);
}
