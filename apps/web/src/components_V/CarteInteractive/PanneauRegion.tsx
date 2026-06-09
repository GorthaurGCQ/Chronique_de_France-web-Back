"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Region } from "@/models_M/data/regions";
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

/** Emblème régional — remonté via key={region.id} pour réinitialiser l'état d'erreur */
function RegionEmblem({ region }: { region: Region }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <Image
        src={region.emblemeUrl}
        alt={`Emblème ${region.nom}`}
        width={80}
        height={80}
        className={styles.emblem}
        unoptimized
        onError={() => setImgError(true)}
      />
    );
  }

  return <Initiales nom={region.nom} couleur={region.couleur} />;
}

export default function PanneauRegion({ region, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation d'entrée/sortie — setState dans setTimeout (évite le warning ESLint)
  useEffect(() => {
    const timer = setTimeout(
      () => setIsVisible(region !== null),
      region ? 10 : 0,
    );
    return () => clearTimeout(timer);
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
                <RegionEmblem key={region.id} region={region} />
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
