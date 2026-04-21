// Client Drizzle ORM — Fondation Chroniques de France
// Driver : postgres.js | Base de données : Supabase (PostgreSQL)
// Singleton : évite les connexions multiples en développement (Next.js hot reload)

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Type pour le client Drizzle avec schéma complet
export type Database = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  // eslint-disable-next-line no-var
  var _pgConnection: postgres.Sql | undefined;
}

function createConnection(): postgres.Sql {
  const url = process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL est absent des variables d'environnement.");
  }

  return postgres(url, {
    // Supabase utilise PgBouncer en mode transaction : les requêtes préparées
    // ne sont pas supportées, on les désactive.
    prepare: false,
    max: 1,
  });
}

const connection = global._pgConnection ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  global._pgConnection = connection;
}

export const db = drizzle({ client: connection, schema });
