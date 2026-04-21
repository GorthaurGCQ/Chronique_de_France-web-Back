import type { Metadata } from "next";
import Link from "next/link";
import { FRANCE_SVG_PATHS } from "@/data/france-svg-paths";
import { OCCITANIE_INFO } from "@/data/occitaniaData";
import FriseEtCards from "./FriseEtCards";
import styles from "./occitanie.module.css";

export const metadata: Metadata = {
  title: "Occitanie | Chroniques de France",
  description:
    "Langue d'oc, cathares, troubadours — explorez l'histoire et le patrimoine de l'Occitanie, de l'Antiquité à nos jours.",
};

function MiniCarteOccitanie() {
  const OCCITANIE_CODE = "76";
  return (
    <div className={styles.miniMap}>
      <div className={styles.miniMapLabel}>Localisation — Occitanie</div>
      <svg
        viewBox="0 0 600 680"
        className={styles.miniMapSvg}
        aria-label="Carte de France avec l'Occitanie mise en surbrillance"
        role="img"
      >
        {FRANCE_SVG_PATHS.map(({ code, nom, d }) => {
          const isOccitanie = code === OCCITANIE_CODE;
          return (
            <path
              key={code}
              d={d}
              fill={isOccitanie ? OCCITANIE_INFO.couleur : "rgba(255,255,255,0.12)"}
              stroke={isOccitanie ? "#fff" : "rgba(255,255,255,0.2)"}
              strokeWidth={isOccitanie ? 2 : 0.8}
              opacity={isOccitanie ? 1 : 0.5}
              aria-label={nom}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function OccitaniePage() {
  return (
    <main className={styles.page}>

      {/* ── 1. HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <Link href="/" className={styles.backLink}>← Retour à l&apos;accueil</Link>
          <span className={styles.heroBadge}>{OCCITANIE_INFO.badge}</span>
          <h1 className={styles.heroTitle}>{OCCITANIE_INFO.nom}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroEpoqueBadge}>{OCCITANIE_INFO.epoque}</span>
            <span className={styles.heroMetaSep} aria-hidden="true">·</span>
            <span className={styles.heroMetaText}>Chef-lieu : {OCCITANIE_INFO.chefLieu}</span>
            <span className={styles.heroMetaSep} aria-hidden="true">·</span>
            <span className={styles.heroMetaText}>{OCCITANIE_INFO.nbDepartements} départements</span>
          </div>
          <p className={styles.heroSubtitle}>{OCCITANIE_INFO.descriptionCourte}</p>
        </div>
      </section>

      {/* ── 2. DOUBLE COLONNE ── */}
      <section className={styles.about}>
        <div className={styles.aboutGrid}>

          {/* Colonne gauche */}
          <div className={styles.aboutLeft}>
            <h2 className={styles.aboutTitle}>À propos de l&apos;Occitanie</h2>
            <span className={styles.aboutDivider} aria-hidden="true" />
            <p className={styles.aboutText}>{OCCITANIE_INFO.description}</p>

            {/* Stats */}
            <div className={styles.statsBox}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{OCCITANIE_INFO.superficieKm2} km²</span>
                <span className={styles.statLabel}>Superficie</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{OCCITANIE_INFO.population}</span>
                <span className={styles.statLabel}>Population</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{OCCITANIE_INFO.nbDepartements}</span>
                <span className={styles.statLabel}>Départements</span>
              </div>
            </div>
          </div>

          {/* Colonne droite — mini-carte */}
          <MiniCarteOccitanie />
        </div>
      </section>

      {/* ── 3. CATÉGORIES + FRISE + CARDS ── */}
      <section className={styles.cards}>
        <div className={styles.cardsInner}>
          <FriseEtCards />
        </div>
      </section>

    </main>
  );
}
