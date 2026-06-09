"use client";

// Module : node_modules/react
import { useEffect, useState } from "react";
// Module : node_modules/next/image
import Image from "next/image";
// Module : node_modules/next/link
import Link from "next/link";
// Auth : src/lib/auth/auth-client.ts
import { useSession } from "@/lib/auth/auth-client";
// Module : src/lib/permissions.shared.ts
import type { Permission } from "@/lib/permissions.shared";
import { canAccessPage, isPrivilegedRole } from "@/lib/permissions.shared";
// Modèle : src/models_M/data/regions.ts
import type { Region } from "@/models_M/data/regions";
// Composant : src/components_V/icons/AppIcon.tsx
import AppIcon from "@/components_V/icons/AppIcon";
// Style : src/components_V/CarteInteractive/PanneauRegion.module.css
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
  const { data: session } = useSession();
  const [canExploreRegions, setCanExploreRegions] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      setCanExploreRegions(false);
      return;
    }
    if (isPrivilegedRole(session.user.role)) {
      setCanExploreRegions(true);
      return;
    }

    let cancelled = false;
    fetch("/api/profile/access")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const perms: Permission[] = d.success ? (d.data.permissions ?? []) : [];
        setCanExploreRegions(
          canAccessPage(true, session.user.role, perms, "ACCES_REGIONS"),
        );
      })
      .catch(() => {
        if (!cancelled) setCanExploreRegions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, session?.user?.role]);

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
              <AppIcon name="close" size={16} tone="inherit" />
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
                  <AppIcon name="pin" size={18} className={styles.statIcon} />
                  <div>
                    <span className={styles.statLabel}>Chef-lieu</span>
                    <span className={styles.statValue}>{region.chefLieu}</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <AppIcon name="folder" size={18} className={styles.statIcon} />
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
              {!session?.user ? (
                <Link
                  href="/connexion"
                  className={styles.btnExplore}
                  style={{ background: "var(--color-gold, #b8933a)" }}
                  onClick={onClose}
                >
                  Se connecter pour explorer
                  <AppIcon name="arrowRight" size={14} tone="inherit" className={styles.btnExploreIcon} />
                </Link>
              ) : canExploreRegions === false ? (
                <p className={styles.accessHint}>
                  Accès aux régions non autorisé — contactez un administrateur.
                </p>
              ) : (
                <Link
                  href={`/regions/${region.id}`}
                  className={styles.btnExplore}
                  style={{ background: "var(--color-gold, #b8933a)" }}
                  onClick={onClose}
                >
                  Explorer cette région
                  <AppIcon name="arrowRight" size={14} tone="inherit" className={styles.btnExploreIcon} />
                </Link>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
