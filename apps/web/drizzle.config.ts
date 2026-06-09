// =============================================================================
// CONFIGURATION Drizzle Kit — migrations et introspection BDD
// Commandes : npx drizzle-kit generate | migrate | push | studio
// Variables : DATABASE_URL dans .env.local
// =============================================================================

// Module : node_modules/drizzle-kit
import { defineConfig } from "drizzle-kit";
// Module : node_modules/dotenv
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
