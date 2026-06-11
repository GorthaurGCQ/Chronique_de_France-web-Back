// =============================================================================
// VUE ADMIN — Journal d'audit (filtre par catégorie)
// Appel : GET /api/admin/audit?category=
// =============================================================================

"use client";

// Module : node_modules/react
import { useEffect, useState, useCallback } from "react";
// Style : src/app/(V)/admin/admin.module.css
import styles from "../admin.module.css";
// Style : src/app/(V)/admin/journal/journal.module.css
import journalStyles from "./journal.module.css";
// Composant : src/components_V/icons/AppIcon.tsx
import AppIcon from "@/components_V/icons/AppIcon";
import RoleBadge from "@/components_V/RoleBadge";
import type { IconName } from "@/components_V/icons/types";

type AuditLog = {
  id: string;
  actorName: string | null;
  actorRole: string | null;
  action: string;
  category: string;
  severity: string;
  target: string | null;
  details: string | null;
  createdAt: string;
};

// ── Labels et icônes des actions ─────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  CREATE_RESOURCE:        "Création de ressource",
  UPDATE_RESOURCE:        "Modification de ressource",
  DELETE_RESOURCE:        "Suppression de ressource",
  CREATE_EVENT:           "Création d'événement",
  UPDATE_EVENT:           "Modification d'événement",
  DELETE_EVENT:           "Suppression d'événement",
  UPDATE_USER_PERMISSIONS:"Modification des permissions",
  BAN_USER:               "Bannissement d'utilisateur",
  UNBAN_USER:             "Débannissement d'utilisateur",
  DELETE_USER:            "Suppression d'utilisateur",
  MAKE_ADMIN:             "Promotion administrateur",
  MAKE_USER:              "Rétrogradation membre",
};

const ACTION_ICONS: Record<string, IconName> = {
  CREATE_RESOURCE: "plus",
  UPDATE_RESOURCE: "pencil",
  DELETE_RESOURCE: "trash",
  CREATE_EVENT: "calendar",
  UPDATE_EVENT: "pencil",
  DELETE_EVENT: "trash",
  UPDATE_USER_PERMISSIONS: "key",
  BAN_USER: "ban",
  UNBAN_USER: "check",
  DELETE_USER: "trash",
  MAKE_ADMIN: "shield",
  MAKE_USER: "user",
};

const TABS: { key: string; label: string; icon: IconName }[] = [
  { key: "",          label: "Tout",        icon: "clipboard" },
  { key: "resources", label: "Ressources",  icon: "file" },
  { key: "users",     label: "Comptes",     icon: "users" },
  { key: "events",    label: "Événements",  icon: "calendar" },
];

const SEVERITY_CONFIG: Record<string, { label: string; dot: string; row: string; badge: string }> = {
  success: { label: "Création",     dot: journalStyles.dotSuccess, row: journalStyles.rowSuccess, badge: journalStyles.badgeSuccess },
  info:    { label: "Modification", dot: journalStyles.dotInfo,    row: journalStyles.rowInfo,    badge: journalStyles.badgeInfo    },
  warning: { label: "Permission",   dot: journalStyles.dotWarning, row: journalStyles.rowWarning, badge: journalStyles.badgeWarning },
  danger:  { label: "Suppression",  dot: journalStyles.dotDanger,  row: journalStyles.rowDanger,  badge: journalStyles.badgeDanger  },
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function AdminJournal() {
  const [activeTab, setActiveTab]   = useState("");
  const [logs, setLogs]             = useState<AuditLog[]>([]);
  const [loading, setLoading]       = useState(true);
  const [counts, setCounts]         = useState<Record<string, number>>({});

  const fetchLogs = useCallback(async (category: string) => {
    setLoading(true);
    const url = "/api/admin/audit" + (category ? `?category=${category}` : "");
    const res  = await fetch(url);
    const data = await res.json();
    if (data.success) setLogs(data.data);
    setLoading(false);
  }, []);

  // Chargement initial + comptages
  useEffect(() => {
    fetchLogs(activeTab);
  }, [activeTab, fetchLogs]);

  useEffect(() => {
    async function fetchCounts() {
      const categories = ["resources", "users", "events"];
      const results = await Promise.all(
        categories.map((c) =>
          fetch(`/api/admin/audit?category=${c}`).then((r) => r.json())
        )
      );
      const c: Record<string, number> = {};
      categories.forEach((cat, i) => { c[cat] = results[i]?.data?.length ?? 0; });
      setCounts(c);
    }
    fetchCounts();
  }, [logs]);

  const bySeverity = {
    success: logs.filter((l) => l.severity === "success").length,
    info:    logs.filter((l) => l.severity === "info").length,
    warning: logs.filter((l) => l.severity === "warning").length,
    danger:  logs.filter((l) => l.severity === "danger").length,
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Journal d&apos;audit</h1>
        <p className={styles.pageSubtitle}>Historique complet des actions effectuées sur la plateforme</p>
      </div>

      {/* ── Résumé visuel ── */}
      <div className={journalStyles.metricGrid}>
        <div className={`${journalStyles.metricCard} ${journalStyles.metricSuccess}`}>
          <span className={journalStyles.metricIcon}><AppIcon name="plus" size={22} tone="inherit" /></span>
          <div>
            <p className={journalStyles.metricValue}>{bySeverity.success}</p>
            <p className={journalStyles.metricLabel}>Créations</p>
          </div>
        </div>
        <div className={`${journalStyles.metricCard} ${journalStyles.metricInfo}`}>
          <span className={journalStyles.metricIcon}><AppIcon name="pencil" size={22} tone="inherit" /></span>
          <div>
            <p className={journalStyles.metricValue}>{bySeverity.info}</p>
            <p className={journalStyles.metricLabel}>Modifications</p>
          </div>
        </div>
        <div className={`${journalStyles.metricCard} ${journalStyles.metricWarning}`}>
          <span className={journalStyles.metricIcon}><AppIcon name="key" size={22} tone="inherit" /></span>
          <div>
            <p className={journalStyles.metricValue}>{bySeverity.warning}</p>
            <p className={journalStyles.metricLabel}>Permissions</p>
          </div>
        </div>
        <div className={`${journalStyles.metricCard} ${journalStyles.metricDanger}`}>
          <span className={journalStyles.metricIcon}><AppIcon name="trash" size={22} tone="inherit" /></span>
          <div>
            <p className={journalStyles.metricValue}>{bySeverity.danger}</p>
            <p className={journalStyles.metricLabel}>Suppressions</p>
          </div>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div className={journalStyles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${journalStyles.tab} ${activeTab === tab.key ? journalStyles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <AppIcon name={tab.icon} size={16} className={journalStyles.tabIcon} />
            {tab.label}
            {tab.key && counts[tab.key] !== undefined && (
              <span className={`${journalStyles.tabCount} ${activeTab === tab.key ? journalStyles.tabActiveCount : ""}`}>
                {counts[tab.key]}
              </span>
            )}
            {!tab.key && (
              <span className={`${journalStyles.tabCount} ${activeTab === tab.key ? journalStyles.tabActiveCount : ""}`}>
                {logs.length}
              </span>
            )}
          </button>
        ))}
        <button
          className={journalStyles.refreshBtn}
          onClick={() => fetchLogs(activeTab)}
          title="Rafraîchir"
        >
          ↻ Actualiser
        </button>
      </div>

      {/* ── Légende couleurs ── */}
      <div className={journalStyles.legend}>
        {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
          <span key={key} className={journalStyles.legendItem}>
            <span className={`${journalStyles.legendDot} ${cfg.dot}`} />
            {cfg.label}
          </span>
        ))}
      </div>

      {/* ── Liste des logs ── */}
      <div className={styles.tableCard} style={{ marginTop: "0.75rem" }}>
        {loading ? (
          <p style={{ padding: "2rem", color: "#9ca3af", textAlign: "center" }}>Chargement…</p>
        ) : logs.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
            <AppIcon name="clipboard" size={40} className={journalStyles.emptyIcon} />
            <p>Aucune entrée dans le journal pour cette catégorie.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table} style={{ fontSize: "0.855rem" }}>
              <thead>
                <tr>
                  <th style={{ width: "16px" }} />
                  <th>Date</th>
                  <th>Action</th>
                  <th>Cible</th>
                  <th>Auteur</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const sev = SEVERITY_CONFIG[log.severity] ?? SEVERITY_CONFIG.info;
                  return (
                    <tr key={log.id} className={sev.row}>
                      <td style={{ padding: "0 0 0 1rem" }}>
                        <span className={`${journalStyles.dot} ${sev.dot}`} />
                      </td>
                      <td style={{ color: "#6b7280", whiteSpace: "nowrap", fontSize: "0.78rem" }}>
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td>
                        <span className={`${journalStyles.actionBadge} ${sev.badge}`}>
                          <AppIcon name={ACTION_ICONS[log.action] ?? "document"} size={14} className={journalStyles.actionBadgeIcon} />
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                      </td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>
                        {log.target ?? <span style={{ color: "#d1d5db" }}>—</span>}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "#1a1a2e" }}>{log.actorName ?? "Système"}</span>
                        <RoleBadge role={log.actorRole} className={journalStyles.actorRoleBadge} />
                      </td>
                      <td style={{ color: "#9ca3af", fontSize: "0.78rem", maxWidth: "260px" }}>
                        {log.details ?? <span style={{ color: "#e5e7eb" }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
