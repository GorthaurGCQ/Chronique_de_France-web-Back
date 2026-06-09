// =============================================================================
// SERVICE ADMIN — Lecture du journal d'audit
// Consommé par : GET /api/admin/audit, page /admin/journal
// =============================================================================

// Module : node_modules/drizzle-orm
import { eq, desc } from "drizzle-orm";
// Modèle : src/models_M/db.ts
import { db } from "@/models_M/db";
// Modèle : src/models_M/schema.ts
import { auditLogs } from "@/models_M/schema";

export async function listAuditLogs(category: string | null) {
  if (category) {
    // SELECT — auditLogs : 200 derniers logs filtrés par catégorie, triés du plus récent
    return db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.category, category))
      .orderBy(desc(auditLogs.createdAt))
      .limit(200);
  }

  // SELECT — auditLogs : 200 derniers logs (toutes catégories), triés du plus récent
  return db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(200);
}
