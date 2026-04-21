import { REGIONS } from "@/data/regions";
import type { TerritoireInfo, CarteEpoqueData } from "./types";

// For the contemporary era, we reuse the REGIONS data (colors + descriptions)
// The region code in france-svg-paths.ts uses INSEE numeric codes
// We need to map: REGIONS use code like "IDF", "BRE" etc.
// france-svg-paths uses "11", "53" etc.
// This mapping translates INSEE numeric → region code in REGIONS

const INSEE_TO_REGION_ID: Record<string, string> = {
  "11": "ile-de-france",
  "24": "centre-val-de-loire",
  "27": "bourgogne-franche-comte",
  "28": "normandie",
  "32": "hauts-de-france",
  "44": "grand-est",
  "52": "pays-de-la-loire",
  "53": "bretagne",
  "75": "nouvelle-aquitaine",
  "76": "occitanie",
  "84": "auvergne-rhone-alpes",
  "93": "paca",
  "94": "corse",
};

function buildContemporaineData(): CarteEpoqueData {
  const data: CarteEpoqueData = {};
  for (const [inseeCode, regionId] of Object.entries(INSEE_TO_REGION_ID)) {
    const region = REGIONS.find(r => r.id === regionId);
    if (region) {
      const info: TerritoireInfo = {
        id: region.id,
        nom: region.nom,
        couleur: region.couleur,
        seigneur: "République française — Ve République",
        dateDebut: 2016,
        description: region.description,
      };
      data[inseeCode] = info;
    }
  }
  return data;
}

export const CARTE_CONTEMPORAINE: CarteEpoqueData = buildContemporaineData();
