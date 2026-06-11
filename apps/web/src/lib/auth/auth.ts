// =============================================================================
// COUCHE BACK — Configuration serveur Better Auth (sessions, BDD, emails)
// Utilisé par : app/api/auth/[...all]/route.ts et les route.ts qui appellent
// auth.api.getSession()
// =============================================================================

// Module : node_modules/better-auth
import { betterAuth } from "better-auth";
// Module : node_modules/better-auth/adapters/drizzle
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// Module : node_modules/better-auth/plugins
import { admin } from "better-auth/plugins";
// Module : node_modules/better-auth/plugins/jwt
// Module : node_modules/better-auth/plugins/bearer
import { bearer } from "better-auth/plugins/bearer";
// Module : node_modules/better-auth/plugins/admin/access
import { adminAc, userAc } from "better-auth/plugins/admin/access";
// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import * as schema from "@/models_M/schema";
// Service : src/lib/services_M/mail.service.ts
import { sendResetPasswordEmail } from "@/lib/services_M/mail.service";

// Instance principale Better Auth — cœur de l'authentification côté serveur
export const auth = betterAuth({
  // Branche Better Auth sur PostgreSQL via Drizzle (mêmes tables que le reste de l'app)
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.authUser,
      session: schema.authSession,
      account: schema.authAccount,
      verification: schema.authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Callback appelé quand l'utilisateur demande un reset : envoie l'e-mail
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        name: user.name,
        url,
      });
    },
  },
  user: {
    deleteUser: {
      enabled: true, // permet la suppression de compte
    },
  },
  plugins: [
    bearer(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin", "founder"],
      roles: {
        user:         userAc,
        organisateur: userAc, // badge métier — mêmes droits BA qu'un membre
        admin:        adminAc,
        founder:      adminAc,
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET, // clé de signature des sessions
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:8081",  // Expo Web
    "http://localhost:19006", // Expo Web (port alternatif)
    "http://127.0.0.1:8081",
    "http://127.0.0.1:19006",
  ],
});

// Type TypeScript de la session (utilisable dans les route.ts)
export type Session = typeof auth.$Infer.Session;
