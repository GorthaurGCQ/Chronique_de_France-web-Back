// =============================================================================
// COUCHE DONNÉES (BACK) — Connexion PostgreSQL via Drizzle ORM
// Utilisé par toutes les routes API : import { db } from "@/models_M/db"
// =============================================================================

// Import du constructeur Drizzle pour PostgreSQL
import { drizzle } from "drizzle-orm/postgres-js";
// Driver bas niveau qui parle au serveur PostgreSQL (ici Supabase)
import postgres from "postgres";
// Schéma des tables (auth_user, resources, favorites…) — défini dans ./schema.ts
import * as schema from "./schema";

// Type TypeScript exporté : instance Drizzle typée avec notre schéma
export type Database = ReturnType<typeof drizzle<typeof schema>>;

// En dev Next.js recharge les modules : on garde UNE seule connexion en global
declare global {
  // eslint-disable-next-line no-var
  var _pgConnection: postgres.Sql | undefined;
}

// Fonction interne : crée le client postgres.js à partir des variables d'environnement
function createConnection(): postgres.Sql {
  // URL lue depuis .env (connexion directe ou pooler Supabase)
  const url = process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;
  // Sécurité : pas d'URL = erreur explicite au démarrage
  if (!url) {
    throw new Error("DATABASE_URL est absent des variables d'environnement.");
  }

  // Options du driver
  return postgres(url, {
    // Supabase (PgBouncer) : désactive les requêtes préparées (incompatibles)
    prepare: false,
    // Une connexion max par instance serveur Next (suffisant en serverless/dev)
    max: 1,
  });
}

// Réutilise la connexion globale en dev, sinon en crée une nouvelle
const connection = global._pgConnection ?? createConnection();

// En développement, stocke la connexion pour éviter les fuites à chaque hot reload
if (process.env.NODE_ENV !== "production") {
  global._pgConnection = connection;
}

// Export principal : client Drizzle = point d'entrée vers la BDD pour tout le back
export const db = drizzle({ client: connection, schema });
