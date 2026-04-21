"use client";

import { useState } from "react";
import type { Region } from "@/data/regions";
import styles from "./TooltipRegion.module.css";

type Props = {
  region: Region | null;
  x: number;
  y: number;
  visible: boolean;
};

function Initiales({ nom, couleur }: { nom: string; couleur: string }) {
  const parts = nom.split(/[\s-]/);
  const initials = parts
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
  return (
    <div
      className={styles.fallbackIcon}
      style={{ background: couleur }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function TooltipRegion({ region, x, y, visible }: Props) {
  const [imgError, setImgError] = useState(false);

  if (!region) return null;

  // Clamp tooltip position to stay within viewport
  const TOOLTIP_W = 220;
  const TOOLTIP_H = 140;
  const MARGIN = 16;
  const clampedX = Math.min(
    Math.max(x + 16, MARGIN),
    (typeof window !== "undefined" ? window.innerWidth : 1200) - TOOLTIP_W - MARGIN
  );
  const clampedY = Math.min(
    Math.max(y - TOOLTIP_H / 2, MARGIN),
    (typeof window !== "undefined" ? window.innerHeight : 800) - TOOLTIP_H - MARGIN
  );

  return (
    <div
      className={`${styles.tooltip} ${visible ? styles.visible : ""}`}
      style={{
        left: clampedX,
        top: clampedY,
        borderTopColor: region.couleur,
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div className={styles.header}>
        {!imgError ? (
          <img
            src={region.emblemeUrl}
            alt={`Emblème ${region.nom}`}
            width={48}
            height={48}
            className={styles.emblem}
            onError={() => setImgError(true)}
          />
        ) : (
          <Initiales nom={region.nom} couleur={region.couleur} />
        )}
        <div className={styles.meta}>
          <span className={styles.regionName}>{region.nom}</span>
          <span className={styles.chefLieu}>📍 {region.chefLieu}</span>
        </div>
      </div>
      <div className={styles.footer}>
        <span
          className={styles.badge}
          style={{ background: `${region.couleur}33`, color: region.couleur }}
        >
          {region.nbDepartements} département{region.nbDepartements > 1 ? "s" : ""}
        </span>
        <span className={styles.hint}>Cliquez pour en savoir plus</span>
      </div>
    </div>
  );
}
