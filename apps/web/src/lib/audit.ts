// Réexport rétrocompatibilité — préférer @/lib/services_M/audit (couche Modèle)
export {
  logAudit,
  type AuditCategory,
  type AuditSeverity,
  type AuditPayload,
} from "@/lib/services_M/audit";
