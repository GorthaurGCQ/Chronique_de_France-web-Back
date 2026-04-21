"use client";

import type { TerritoireInfo } from "@/data/territoires/types";
import styles from "./TooltipTerritoire.module.css";

type Props = {
  territoire: TerritoireInfo | null;
  regionNom?: string;
  x: number;
  y: number;
  visible: boolean;
};

function Initiales({ nom, couleur }: { nom: string; couleur: string }) {
  const parts = nom.split(/[\s\-&,\/]/);
  const initials = parts
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
  return (
    <div
      className={styles.fallback}
      style={{ background: couleur }}
      aria-hidden="true"
    >
      {initials || nom[0].toUpperCase()}
    </div>
  );
}

export default function TooltipTerritoire({ territoire, regionNom, x, y, visible }: Props) {
  if (!territoire) return null;

  const TOOLTIP_W = 248;
  const TOOLTIP_H = 170;
  const MARGIN = 12;
  const clampedX = Math.min(
    Math.max(x + 14, MARGIN),
    (typeof window !== "undefined" ? window.innerWidth : 1400) - TOOLTIP_W - MARGIN
  );
  const clampedY = Math.min(
    Math.max(y - TOOLTIP_H / 2, MARGIN),
    (typeof window !== "undefined" ? window.innerHeight : 900) - TOOLTIP_H - MARGIN
  );

  const dateRange =
    territoire.dateDebut !== undefined && territoire.dateFin !== undefined
      ? `${territoire.dateDebut < 0 ? Math.abs(territoire.dateDebut) + " av. J.-C." : territoire.dateDebut} – ${territoire.dateFin}`
      : null;

  return (
    <div
      className={`${styles.tooltip} ${visible ? styles.visible : ""}`}
      style={{ left: clampedX, top: clampedY, borderTopColor: territoire.couleur }}
      role="tooltip"
      aria-live="polite"
    >
      <div className={styles.header}>
        <Initiales nom={territoire.nom} couleur={territoire.couleur} />
        <div className={styles.meta}>
          <span className={styles.nom}>{territoire.nom}</span>
          {territoire.seigneur && (
            <span className={styles.seigneur}>👑 {territoire.seigneur}</span>
          )}
        </div>
      </div>

      {/* Modern region name shown as "corresponds to" */}
      {regionNom && (
        <div className={styles.modernRegion}>
          <span className={styles.modernLabel}>Région actuelle :</span>
          <span className={styles.modernNom}>{regionNom}</span>
        </div>
      )}

      {dateRange && (
        <div className={styles.dates}>
          <span
            className={styles.badge}
            style={{ background: `${territoire.couleur}22`, color: territoire.couleur }}
          >
            {dateRange}
          </span>
        </div>
      )}
      <p className={styles.desc}>{territoire.description.slice(0, 100)}…</p>
    </div>
  );
}
