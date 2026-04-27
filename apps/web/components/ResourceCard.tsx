import Link from "next/link";
import styles from "./ResourceCard.module.css";

export type ResourceCardData = {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  type: string;
  region: string | null;
  timeline: string | null;
  domaine: string | null;
  thumbnailUrl: string | null;
  publishedAt: string;
  authorName: string | null;
};

const TIMELINE_LABELS: Record<string, string> = {
  ANTIQUITE: "Antiquité",
  MOYEN_AGE: "Moyen-Âge",
  RENAISSANCE: "Renaissance",
  ANCIEN_REGIME: "Ancien Régime",
  REVOLUTION: "Révolution",
  XIXE_SIECLE: "XIXe siècle",
  CONTEMPORAIN: "Contemporain",
};

const TYPE_LABELS: Record<string, string> = {
  CHRONOLOGIE: "Chronologie",
  FICHE_THEMATIQUE: "Fiche thématique",
  DOCUMENT_EDUCATIF: "Document éducatif",
  PUBLICATION: "Publication",
};

// Couleur de fond selon la période historique
const TIMELINE_COLORS: Record<string, string> = {
  ANTIQUITE: "#6b6b2e",
  MOYEN_AGE: "#3a2318",
  RENAISSANCE: "#7a3b1e",
  ANCIEN_REGIME: "#1a3f4a",
  REVOLUTION: "#5a1820",
  XIXE_SIECLE: "#253560",
  CONTEMPORAIN: "#2d2d2d",
};

function estimateReadingTime(contenu: string): number {
  const words = contenu.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function ResourceCard({ resource }: { resource: ResourceCardData }) {
  const bgColor = TIMELINE_COLORS[resource.timeline ?? ""] ?? "#2d2d2d";
  const timelineLabel = TIMELINE_LABELS[resource.timeline ?? ""] ?? resource.timeline ?? "";
  const typeLabel = TYPE_LABELS[resource.type] ?? resource.type;
  const readingTime = estimateReadingTime(resource.contenu);

  return (
    <div className={styles.card}>
      {/* Visuel : miniature ou couleur de la période */}
      <div
        className={styles.visual}
        style={
          resource.thumbnailUrl
            ? { backgroundImage: `url(${resource.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: bgColor }
        }
      >
        {resource.thumbnailUrl && <div className={styles.visualOverlay} aria-hidden="true" />}
        <span className={styles.timelineBadge}>{timelineLabel}</span>
        <button className={styles.bookmarkBtn} aria-label="Marquer comme favori">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Contenu */}
      <div className={styles.body}>
        <span className={styles.typeLabel}>{typeLabel}</span>
        <h3 className={styles.titre}>{resource.titre}</h3>
        <p className={styles.description}>{resource.description}</p>

        <div className={styles.footer}>
          <span className={styles.readingTime}>{readingTime} min de lecture</span>
          <Link href={`/bibliotheque/${resource.id}`} className={styles.arrowBtn} aria-label="Lire la ressource">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
