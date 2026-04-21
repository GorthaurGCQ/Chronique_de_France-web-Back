"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Region } from "@/data/regions";
import styles from "./PanneauRegion.module.css";

type Props = {
  region: Region | null;
  onClose: () => void;
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
      className={styles.fallbackEmblem}
      style={{ background: couleur }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function PanneauRegion({ region, onClose }: Props) {
  const [imgError, setImgError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Reset imgError when region changes
  useEffect(() => {
    setImgError(false);
  }, [region?.id]);

  // Animate in/out
  useEffect(() => {
    if (region) {
      // Trigger reflow before adding visible class
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [region]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!region && !isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isVisible && region ? styles.overlayVisible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`${styles.panel} ${isVisible && region ? styles.panelVisible : ""}`}
        aria-label={`Informations sur ${region?.nom ?? ""}`}
        role="complementary"
      >
        {region && (
          <>
            {/* Close button */}
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Fermer le panneau"
            >
              ✕
            </button>

            {/* Colored top bar */}
            <div
              className={styles.colorBar}
              style={{ background: region.couleur }}
            />

            {/* Content */}
            <div className={styles.content}>
              {/* Emblem */}
              <div className={styles.emblemWrapper}>
                {!imgError ? (
                  <img
                    src={region.emblemeUrl}
                    alt={`Emblème ${region.nom}`}
                    width={80}
                    height={80}
                    className={styles.emblem}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <Initiales nom={region.nom} couleur={region.couleur} />
                )}
              </div>

              {/* Region name */}
              <h2
                className={styles.regionName}
                style={{ color: region.couleur }}
              >
                {region.nom}
              </h2>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>📍</span>
                  <div>
                    <span className={styles.statLabel}>Chef-lieu</span>
                    <span className={styles.statValue}>{region.chefLieu}</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>🗂️</span>
                  <div>
                    <span className={styles.statLabel}>Départements</span>
                    <span className={styles.statValue}>
                      {region.nbDepartements}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className={styles.description}>{region.description}</p>

              {/* CTA */}
              <Link
                href={`/regions/${region.id}`}
                className={styles.btnExplore}
                style={{ background: "var(--color-gold, #b8933a)" }}
                onClick={onClose}
              >
                Explorer cette région →
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
