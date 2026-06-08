// =============================================================================
// CONFIGURATION Drizzle Kit — migrations et introspection BDD
// Commandes : npx drizzle-kit generate | migrate | push | studio
// Variables : DATABASE_URL dans .env.local
// =============================================================================

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Charge les variables d'environnement depuis .env.local (non versionné)
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/models_M/schema.ts",       // Schéma TypeScript des tables
  out: "./src/models_M/migrations",         // Dossier de sortie des migrations SQL
  dialect: "postgresql",                    // Supabase = PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",    // URL de connexion (pooler ou direct)
  },
});
