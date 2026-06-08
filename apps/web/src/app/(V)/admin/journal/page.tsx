"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../admin.module.css";
import journalStyles from "./journal.module.css";

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

const ACTION_ICONS: Record<string, string> = {
  CREATE_RESOURCE: "➕", UPDATE_RESOURCE: "✏️", DELETE_RESOURCE: "🗑️",
  CREATE_EVENT: "📅", UPDATE_EVENT: "✏️", DELETE_EVENT: "🗑️",
  UPDATE_USER_PERMISSIONS: "🔑", BAN_USER: "🚫", UNBAN_USER: "✅",
  DELETE_USER: "🗑️", MAKE_ADMIN: "🛡️", MAKE_USER: "👤",
};

const SEVERITY_CONFIG: Record<string, { label: string; dot: string; row: string; badge: string }> = {
  success: { label: "Création",     dot: journalStyles.dotSuccess, row: journalStyles.rowSuccess, badge: journalStyles.badgeSuccess },
  info:    { label: "Modification", dot: journalStyles.dotInfo,    row: journalStyles.rowInfo,    badge: journalStyles.badgeInfo    },
  warning: { label: "Permission",   dot: journalStyles.dotWarning, row: journalStyles.rowWarning, badge: journalStyles.badgeWarning },
  danger:  { label: "Suppression",  dot: journalStyles.dotDanger,  row: journalStyles.rowDanger,  badge: journalStyles.badgeDanger  },
};

const TABS = [
  { key: "",          label: "Tout",        icon: "📋" },
  { key: "resources", label: "Ressources",  icon: "📄" },
  { key: "users",     label: "Comptes",     icon: "👥" },
  { key: "events",    label: "Événements",  icon: "📅" },
];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return null;
  const color = role === "founder" ? "#b8933a" : role === "admin" ? "#1d4ed8" : "#6b7280";
  const bg    = role === "founder" ? "#fef3c7" : role === "admin" ? "#eff6ff" : "#f3f4f6";
  return (
    <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.1rem 0.5rem", borderRadius: "20px", background: bg, color, marginLeft: "0.4rem" }}>
      {role === "founder" ? "👑" : ""}{role}
    </span>
  );
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
          <span className={journalStyles.metricIcon}>➕</span>
          <div>
            <p className={journalStyles.metricValue}>{bySeverity.success}</p>
            <p className={journalStyles.metricLabel}>Créations</p>
          </div>
        </div>
        <div className={`${journalStyles.metricCard} ${journalStyles.metricInfo}`}>
          <span className={journalStyles.metricIcon}>✏️</span>
          <div>
            <p className={journalStyles.metricValue}>{bySeverity.info}</p>
            <p className={journalStyles.metricLabel}>Modifications</p>
          </div>
        </div>
        <div className={`${journalStyles.metricCard} ${journalStyles.metricWarning}`}>
          <span className={journalStyles.metricIcon}>🔑</span>
          <div>
            <p className={journalStyles.metricValue}>{bySeverity.warning}</p>
            <p className={journalStyles.metricLabel}>Permissions</p>
          </div>
        </div>
        <div className={`${journalStyles.metricCard} ${journalStyles.metricDanger}`}>
          <span className={journalStyles.metricIcon}>🗑️</span>
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
            {tab.icon} {tab.label}
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
            <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📋</p>
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
                          {ACTION_ICONS[log.action] ?? "•"} {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                      </td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>
                        {log.target ?? <span style={{ color: "#d1d5db" }}>—</span>}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "#1a1a2e" }}>{log.actorName ?? "Système"}</span>
                        <RoleBadge role={log.actorRole} />
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
