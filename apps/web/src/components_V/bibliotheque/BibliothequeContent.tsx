// =============================================================================
// COMPOSANT — Filtrage client des ressources (type, époque, recherche)
// Reçoit les données SSR de bibliotheque/page.tsx
// =============================================================================

"use client";

// Module : node_modules/react
import { useMemo } from "react";
// Composant : src/components_V/ResourceCard.tsx
import type { ResourceCardData } from "@/components_V/ResourceCard";
// Composant : src/components_V/regions/RegionFriseEtCards.tsx
import RegionFriseEtCards from "@/components_V/regions/RegionFriseEtCards";
// Modèle : src/models_M/data/regionsContent.ts
import type { RegionCategorie, RegionCard } from "@/models_M/data/regionsContent";

// ── Correspondances ──────────────────────────────────────────────────────────

const DOMAINES: {
  key: string;
  id: string;
  label: string;
  subtitle: string;
}[] = [
  {
    key: "PATRIMOINE_HISTOIRE",
    id: "patrimoine-histoire",
    label: "Patrimoine & Histoire",
    subtitle: "Monuments, événements et figures qui ont façonné la France",
  },
  {
    key: "CULTURE_TRADITIONS",
    id: "culture-traditions",
    label: "Culture & Traditions",
    subtitle: "Art de vivre, gastronomie et traditions populaires de France",
  },
  {
    key: "ARCHITECTURE",
    id: "architecture",
    label: "Architecture & Patrimoine Bâti",
    subtitle: "Cathédrales, châteaux et villages remarquables de France",
  },
  {
    key: "GEOGRAPHIE",
    id: "geographie",
    label: "Géographie & Territoires",
    subtitle: "Paysages, reliefs et territoires de France",
  },
  {
    key: "FIGURES_HISTORIQUES",
    id: "figures",
    label: "Figures Historiques",
    subtitle: "Personnages marquants de l'histoire de France",
  },
  {
    key: "EVENEMENTS_MARQUANTS",
    id: "evenements",
    label: "Événements Marquants",
    subtitle: "Les grandes dates et tournants décisifs de l'histoire de France",
  },
];

const TIMELINE_TO_EPOQUE: Record<string, string> = {
  ANTIQUITE:     "ANTIQUITÉ",
  MOYEN_AGE:     "MOYEN-ÂGE",
  RENAISSANCE:   "RENAISSANCE",
  ANCIEN_REGIME: "ANCIEN RÉGIME",
  REVOLUTION:    "RÉVOLUTION",
  XIXE_SIECLE:   "XIXe SIÈCLE",
  CONTEMPORAIN:  "CONTEMPORAINE",
};

const EPOQUE_COLORS: Record<string, string> = {
  ANTIQUITE:     "#4A3728",
  MOYEN_AGE:     "#6B4F2A",
  RENAISSANCE:   "#2E5339",
  ANCIEN_REGIME: "#1a3f4a",
  REVOLUTION:    "#5a1820",
  XIXE_SIECLE:   "#253560",
  CONTEMPORAIN:  "#2d2d2d",
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

function estimateReadingTime(contenu: string): number {
  const words = contenu.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function toRegionCard(r: ResourceCardData): RegionCard {
  return {
    id:           r.id,
    titre:        r.titre,
    description:  r.description,
    epoque:       TIMELINE_TO_EPOQUE[r.timeline ?? ""] ?? "CONTEMPORAINE",
    epoqueColor:  EPOQUE_COLORS[r.timeline ?? ""] ?? "#2d2d2d",
    type:         TYPE_LABELS[r.type] ?? r.type,
    gradient:     TIMELINE_GRADIENTS[r.timeline ?? ""] ?? "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)",
    readTime:     `${estimateReadingTime(r.contenu)} min de lecture`,
    thumbnailUrl: r.thumbnailUrl ?? null,
  };
}

// ── Composant ────────────────────────────────────────────────────────────────

export default function BibliothequeContent({
  resources,
}: {
  resources: ResourceCardData[];
}) {
  const categories = useMemo<RegionCategorie[]>(() => {
    return DOMAINES.map((d) => ({
      id:       d.id,
      label:    d.label,
      subtitle: d.subtitle,
      cards:    resources
        .filter((r) => (r.domaine ?? "PATRIMOINE_HISTOIRE") === d.key)
        .map(toRegionCard),
    }));
  }, [resources]);

  return <RegionFriseEtCards categories={categories} />;
}
