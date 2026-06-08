import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MediaPlayer from "@/components_V/bibliotheque/MediaPlayer";
import ViewTracker from "@/components_V/bibliotheque/ViewTracker";
import { getResourceForPage } from "@/lib/services_M/resources.service";
import styles from "./ressource.module.css";

type Props = { params: Promise<{ id: string }> };

// ── Labels ──────────────────────────────────────────────────────────────────

const TIMELINE_LABELS: Record<string, string> = {
  ANTIQUITE:     "Antiquité",
  MOYEN_AGE:     "Moyen-Âge",
  RENAISSANCE:   "Renaissance",
  ANCIEN_REGIME: "Ancien Régime",
  REVOLUTION:    "Révolution",
  XIXE_SIECLE:   "XIXe siècle",
  CONTEMPORAIN:  "Contemporain",
};

const TIMELINE_GRADIENTS: Record<string, string> = {
  ANTIQUITE:     "linear-gradient(135deg, #b08850 0%, #7a5c2e 100%)",
  MOYEN_AGE:     "linear-gradient(135deg, #5c4033 0%, #3e2723 100%)",
  RENAISSANCE:   "linear-gradient(135deg, #8fac6e 0%, #4a7a2a 100%)",
  ANCIEN_REGIME: "linear-gradient(135deg, #2c5f7a 0%, #1a3a55 100%)",
  REVOLUTION:    "linear-gradient(135deg, #7b1f1f 0%, #4a0e0e 100%)",
  XIXE_SIECLE:   "linear-gradient(135deg, #4a6fa5 0%, #2a4070 100%)",
  CONTEMPORAIN:  "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
};

const TYPE_LABELS: Record<string, string> = {
  CHRONOLOGIE:       "Chronologie",
  FICHE_THEMATIQUE:  "Fiche thématique",
  DOCUMENT_EDUCATIF: "Document éducatif",
  PUBLICATION:       "Publication",
};

const REGION_LABELS: Record<string, string> = {
  NATIONAL:                  "France entière",
  ILE_DE_FRANCE:             "Île-de-France",
  CENTRE_VAL_DE_LOIRE:       "Centre-Val de Loire",
  BOURGOGNE_FRANCHE_COMTE:   "Bourgogne-Franche-Comté",
  NORMANDIE:                 "Normandie",
  HAUTS_DE_FRANCE:           "Hauts-de-France",
  GRAND_EST:                 "Grand Est",
  PAYS_DE_LA_LOIRE:          "Pays de la Loire",
  BRETAGNE:                  "Bretagne",
  NOUVELLE_AQUITAINE:        "Nouvelle-Aquitaine",
  OCCITANIE:                 "Occitanie",
  AUVERGNE_RHONE_ALPES:      "Auvergne-Rhône-Alpes",
  PROVENCE_ALPES_COTE_AZUR:  "Provence-Alpes-Côte d'Azur",
  CORSE:                     "Corse",
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function estimateReadingTime(contenu: string): number {
  const words = contenu.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getResource(id: string) {
  try {
    return await getResourceForPage(id);
  } catch {
    return null;
  }
}

// ── Metadata dynamique ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) return {};
  return {
    title: `${resource.titre} | Chroniques de France`,
    description: resource.description,
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function RessourcePage({ params }: Props) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) notFound();

  const gradient = TIMELINE_GRADIENTS[resource.timeline ?? ""] ?? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)";
  const timelineLabel = TIMELINE_LABELS[resource.timeline ?? ""] ?? resource.timeline ?? "";
  const typeLabel = TYPE_LABELS[resource.type] ?? resource.type;
  const regionLabel = REGION_LABELS[resource.region ?? ""] ?? resource.region ?? "";
  const readingTime = estimateReadingTime(resource.contenu);

  const isHtml = resource.contenu.trimStart().startsWith("<");
  const paragraphs = isHtml
    ? null
    : resource.contenu.split(/\n{1,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <main className={styles.page}>
      <ViewTracker resourceId={resource.id} />

      {/* ── 1. HERO ── */}
      <section className={styles.hero}>
        <div
          className={styles.heroBg}
          style={
            resource.bannerUrl
              ? { backgroundImage: `url(${resource.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: gradient }
          }
          aria-hidden="true"
        />
        {resource.bannerUrl && (
          <div className={styles.heroBgOverlay} aria-hidden="true" />
        )}
        <div className={styles.heroContent}>
          <Link href="/bibliotheque" className={styles.backLink}>
            ← Retour à la bibliothèque
          </Link>

          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeType}`}>
              {typeLabel}
            </span>
            {timelineLabel && (
              <span className={`${styles.badge} ${styles.badgeEpoque}`}>
                {timelineLabel}
              </span>
            )}
            {regionLabel && (
              <span className={`${styles.badge} ${styles.badgeRegion}`}>
                {regionLabel}
              </span>
            )}
          </div>

          <h1 className={styles.heroTitle}>{resource.titre}</h1>

          <div className={styles.heroMeta}>
            {resource.authorName && (
              <>
                <span>Par {resource.authorName}</span>
                <span className={styles.heroMetaSep} aria-hidden="true">·</span>
              </>
            )}
            <span>{formatDate(resource.publishedAt)}</span>
            <span className={styles.heroMetaSep} aria-hidden="true">·</span>
            <span>{readingTime} min de lecture</span>
          </div>
        </div>
      </section>

      {/* ── 2. CORPS ── */}
      <div className={styles.body}>
        {/* Résumé en citation */}
        <p className={styles.description}>{resource.description}</p>
        <span className={styles.divider} aria-hidden="true" />

        {/* Contenu complet */}
        <div className={styles.contenu}>
          {isHtml ? (
            <div
              className={styles.richContent}
              dangerouslySetInnerHTML={{ __html: resource.contenu }}
            />
          ) : (
            paragraphs!.map((para, i) => <p key={i}>{para}</p>)
          )}
        </div>

        {/* Lecteur média intégré */}
        {resource.mediaUrl && <MediaPlayer url={resource.mediaUrl} />}

        {/* Pied de page */}
        <div className={styles.footer}>
          <div className={styles.footerMeta}>
            {resource.authorName && (
              <span>Rédigé par <strong>{resource.authorName}</strong></span>
            )}
            <span>Publié le {formatDate(resource.publishedAt)}</span>
          </div>
          <Link href="/bibliotheque" className={styles.footerBack}>
            ← Retour à la bibliothèque
          </Link>
        </div>
      </div>

    </main>
  );
}
