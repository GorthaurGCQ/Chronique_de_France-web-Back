// =============================================================================
// VUE ADMIN — Tableau de bord (statistiques via GET /api/admin/stats)
// =============================================================================

"use client";

// Module : node_modules/react
import { useEffect, useState } from "react";
// Module : node_modules/next/link
import Link from "next/link";
// Style : src/app/(V)/admin/admin.module.css
import styles from "./admin.module.css";

type Stats = {
  totalUsers: number;
  totalResources: number;
  totalEvents: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tableau de bord</h1>
        <p className={styles.pageSubtitle}>Vue d'ensemble de la plateforme</p>
      </div>

      {/* Cartes statistiques */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className={styles.statValue}>
            {loading ? "…" : stats?.totalUsers ?? 0}
          </span>
          <span className={styles.statLabel}>Membres inscrits</span>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <span className={styles.statValue}>
            {loading ? "…" : stats?.totalResources ?? 0}
          </span>
          <span className={styles.statLabel}>Ressources publiées</span>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className={styles.statValue}>
            {loading ? "…" : stats?.totalEvents ?? 0}
          </span>
          <span className={styles.statLabel}>Événements à venir</span>
        </div>
      </div>

      {/* Accès rapides */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Accès rapides</h2>
        </div>
        <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link href="/admin/utilisateurs" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "10px", border: "1px solid #e5e7eb", textDecoration: "none", color: "#374151", fontSize: "0.9rem", fontWeight: 500, transition: "background 0.15s" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Gérer les utilisateurs
          </Link>
          <Link href="/admin/ressources" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "10px", border: "1px solid #e5e7eb", textDecoration: "none", color: "#374151", fontSize: "0.9rem", fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Gérer les ressources
          </Link>
        </div>
      </div>
    </>
  );
}
