import { db } from "@/models_M/db";
import { auditLogs } from "@/models_M/schema";

export type AuditCategory = "resources" | "users" | "events";
export type AuditSeverity = "success" | "info" | "warning" | "danger";

export interface AuditPayload {
  actorId?:   string;
  actorName?: string;
  actorRole?: string;
  action:     string;
  category:   AuditCategory;
  severity:   AuditSeverity;
  target?:    string;
  details?:   string;
}

export async function logAudit(payload: AuditPayload): Promise<void> {
  try {
    // INSERT — auditLogs : enregistre une action admin (création, modification, suppression…)
    await db.insert(auditLogs).values({
      actorId:   payload.actorId   ?? null,
      actorName: payload.actorName ?? "Système",
      actorRole: payload.actorRole ?? null,
      action:    payload.action,
      category:  payload.category,
      severity:  payload.severity,
      target:    payload.target   ?? null,
      details:   payload.details  ?? null,
    });
  } catch (err) {
    // Ne jamais bloquer l'opération principale si l'audit échoue
    console.error("[audit] Échec d'enregistrement :", err);
  }
}
