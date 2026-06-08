import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Region } from "@/models_M/schema";
import { listResourcesByRegion } from "@/lib/services_M/resources.service";
import { REGIONS_CONTENT } from "@/models_M/data/regionsContent";
import type { RegionCard, RegionContent } from "@/models_M/data/regionsContent";
import RegionPageLayout from "@/components_V/regions/RegionPageLayout";

// Toujours rendu dynamiquement pour refléter les nouvelles ressources publiées
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

// ── Correspondance slug → valeur enum DB ───────────────────────────────────
const SLUG_TO_DB_REGION: Record<string, Region> = {
  "ile-de-france":          "ILE_DE_FRANCE",
  "centre-val-de-loire":    "CENTRE_VAL_DE_LOIRE",
  "bourgogne-franche-comte":"BOURGOGNE_FRANCHE_COMTE",
  normandie:                "NORMANDIE",
  "hauts-de-france":        "HAUTS_DE_FRANCE",
  "grand-est":              "GRAND_EST",
  "pays-de-la-loire":       "PAYS_DE_LA_LOIRE",
  bretagne:                 "BRETAGNE",
  "nouvelle-aquitaine":     "NOUVELLE_AQUITAINE",
  occitanie:                "OCCITANIE",
  "auvergne-rhone-alpes":   "AUVERGNE_RHONE_ALPES",
  paca:                     "PROVENCE_ALPES_COTE_AZUR",
  corse:                    "CORSE",
};

// ── Domaine DB → id de catégorie ────────────────────────────────────────────
const DOMAINE_TO_CAT: Record<string, string> = {
  PATRIMOINE_HISTOIRE:  "patrimoine-histoire",
  CULTURE_TRADITIONS:   "culture-traditions",
  ARCHITECTURE:         "architecture",
  GEOGRAPHIE:           "geographie",
  FIGURES_HISTORIQUES:  "figures",
  EVENEMENTS_MARQUANTS: "evenements",
};

// ── Timeline DB → id d'époque de la frise ──────────────────────────────────
const TIMELINE_TO_EPOQUE: Record<string, string> = {
  ANTIQUITE:    "ANTIQUITÉ",
  MOYEN_AGE:    "MOYEN-ÂGE",
  RENAISSANCE:  "RENAISSANCE",
  ANCIEN_REGIME:"ANCIEN RÉGIME",
  REVOLUTION:   "RÉVOLUTION",
  XIXE_SIECLE:  "XIXe SIÈCLE",
  CONTEMPORAIN: "CONTEMPORAINE",
};

const EPOQUE_COLORS: Record<string, string> = {
  ANTIQUITE:    "#4A3728",
  MOYEN_AGE:    "#6B4F2A",
  RENAISSANCE:  "#2E5339",
  ANCIEN_REGIME:"#1a3f4a",
  REVOLUTION:   "#5a1820",
  XIXE_SIECLE:  "#253560",
  CONTEMPORAIN: "#2d2d2d",
};

const TIMELINE_GRADIENTS: Record<string, string> = {
  ANTIQUITE:    "linear-gradient(135deg, #b08850 0%, #7a5c2e 100%)",
  MOYEN_AGE:    "linear-gradient(135deg, #5c4033 0%, #3e2723 100%)",
  RENAISSANCE:  "linear-gradient(135deg, #8fac6e 0%, #4a7a2a 100%)",
  ANCIEN_REGIME:"linear-gradient(135deg, #2c5f7a 0%, #1a3a55 100%)",
  REVOLUTION:   "linear-gradient(135deg, #7b1f1f 0%, #4a0e0e 100%)",
  XIXE_SIECLE:  "linear-gradient(135deg, #4a6fa5 0%, #2a4070 100%)",
  CONTEMPORAIN: "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
};

const TYPE_LABELS: Record<string, string> = {
  CHRONOLOGIE:      "Chronologie",
  FICHE_THEMATIQUE: "Fiche thématique",
  DOCUMENT_EDUCATIF:"Document éducatif",
  PUBLICATION:      "Publication",
};

function estimateReadingTime(contenu: string): number {
  const words = contenu.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ── Enrichit les catégories avec les ressources venant de la BD ────────────
async function enrichContent(
  content: RegionContent,
  regionSlug: string,
): Promise<RegionContent> {
  const dbRegion = SLUG_TO_DB_REGION[regionSlug];
  if (!dbRegion) return content;

  try {
    const rows = await listResourcesByRegion(dbRegion);

    if (rows.length === 0) return content;

    // Cloner les catégories pour pouvoir les muter sans toucher au module de données
    const enrichedCategories = content.categories.map((cat) => ({
      ...cat,
      cards: [...cat.cards],
    }));

    for (const row of rows) {
      const catId = DOMAINE_TO_CAT[row.domaine ?? ""] ?? "patrimoine-histoire";
      const cat   = enrichedCategories.find((c) => c.id === catId);
      if (!cat) continue;

      const card: RegionCard = {
        id:          row.id,
        titre:       row.titre,
        description: row.description,
        epoque:      TIMELINE_TO_EPOQUE[row.timeline ?? ""] ?? "CONTEMPORAINE",
        epoqueColor: EPOQUE_COLORS[row.timeline ?? ""] ?? "#2d2d2d",
        type:        TYPE_LABELS[row.type ?? ""] ?? row.type ?? "Ressource",
        gradient:     TIMELINE_GRADIENTS[row.timeline ?? ""] ?? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)",
        readTime:     `${estimateReadingTime(row.contenu)} min de lecture`,
        thumbnailUrl: row.thumbnailUrl ?? null,
      };

      cat.cards.push(card);
    }

    return { ...content, categories: enrichedCategories };
  } catch (err) {
    console.error("[enrichContent]", err);
    return content;
  }
}

// ── Handlers Next.js ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const content = REGIONS_CONTENT[id];
  if (!content) return {};
  return {
    title: `${content.nom} | Chroniques de France`,
    description: content.descriptionCourte,
  };
}

export default async function RegionPage({ params }: Props) {
  const { id } = await params;
  const base = REGIONS_CONTENT[id];
  if (!base) notFound();

  const content = await enrichContent(base, id);
  return <RegionPageLayout content={content} />;
}
