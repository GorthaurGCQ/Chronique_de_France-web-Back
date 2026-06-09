// Module : node_modules/next/link
import Link from "next/link";
// Modèle : src/models_M/data/france-svg-paths.ts
import { FRANCE_SVG_PATHS } from "@/models_M/data/france-svg-paths";
// Modèle : src/models_M/data/regionsContent.ts
import type { RegionContent } from "@/models_M/data/regionsContent";
// Composant : src/components_V/regions/RegionFriseEtCards.tsx
import RegionFriseEtCards from "./RegionFriseEtCards";
// Style : src/components_V/regions/region.module.css
import styles from "./region.module.css";

function MiniCarte({ content }: { content: RegionContent }) {
  return (
    <div className={styles.miniMap}>
      <div className={styles.miniMapLabel}>
        Localisation — {content.nom}
      </div>
      <svg
        viewBox="0 0 600 680"
        className={styles.miniMapSvg}
        aria-label={`Carte de France avec ${content.nom} mise en surbrillance`}
        role="img"
      >
        {FRANCE_SVG_PATHS.map(({ code, nom, d }) => {
          const isActive = code === content.code;
          return (
            <path
              key={code}
              d={d}
              fill={isActive ? content.couleur : "rgba(255,255,255,0.12)"}
              stroke={isActive ? "#fff" : "rgba(255,255,255,0.2)"}
              strokeWidth={isActive ? 2 : 0.8}
              opacity={isActive ? 1 : 0.5}
              aria-label={nom}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function RegionPageLayout({
  content,
}: {
  content: RegionContent;
}) {
  return (
    <main className={styles.page}>

      {/* ── 1. HERO ── */}
      <section className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ background: content.heroGradient }}
          aria-hidden="true"
        />
        <div className={styles.heroContent}>
          <Link href="/" className={styles.backLink}>
            ← Retour à l&apos;accueil
          </Link>
          <span className={styles.heroBadge}>{content.badge}</span>
          <h1 className={styles.heroTitle}>{content.nom}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroEpoqueBadge}>{content.epoque}</span>
            <span className={styles.heroMetaSep} aria-hidden="true">·</span>
            <span className={styles.heroMetaText}>
              Chef-lieu&nbsp;: {content.chefLieu}
            </span>
            <span className={styles.heroMetaSep} aria-hidden="true">·</span>
            <span className={styles.heroMetaText}>
              {content.nbDepartements} département
              {content.nbDepartements > 1 ? "s" : ""}
            </span>
          </div>
          <p className={styles.heroSubtitle}>{content.descriptionCourte}</p>
        </div>
      </section>

      {/* ── 2. DOUBLE COLONNE ── */}
      <section className={styles.about}>
        <div className={styles.aboutGrid}>

          {/* Colonne gauche */}
          <div className={styles.aboutLeft}>
            <h2 className={styles.aboutTitle}>
              À propos de {content.nom}
            </h2>
            <span className={styles.aboutDivider} aria-hidden="true" />
            <p className={styles.aboutText}>{content.description}</p>

            {/* Stats */}
            <div className={styles.statsBox}>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {content.superficieKm2}&nbsp;km²
                </span>
                <span className={styles.statLabel}>Superficie</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{content.population}</span>
                <span className={styles.statLabel}>Population</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {content.nbDepartements}
                </span>
                <span className={styles.statLabel}>
                  Département{content.nbDepartements > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Colonne droite — mini-carte */}
          <MiniCarte content={content} />
        </div>
      </section>

      {/* ── 3. CATÉGORIES + FRISE + CARDS ── */}
      <section className={styles.cards}>
        <div className={styles.cardsInner}>
          <RegionFriseEtCards categories={content.categories} />
        </div>
      </section>

    </main>
  );
}
