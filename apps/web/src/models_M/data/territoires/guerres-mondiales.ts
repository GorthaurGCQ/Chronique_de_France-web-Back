import type { TerritoireInfo, CarteEpoqueData } from "./types";

const ZONE_OCCUPEE: TerritoireInfo = {
  id: "zone-occupee", nom: "Zone occupée (Wehrmacht)",
  couleur: "#4A4A2A", seigneur: "Occupation nazie — IIIe Reich",
  dateDebut: 1940, dateFin: 1944,
  description: "Occupation directe par la Wehrmacht après l'armistice du 22 juin 1940. Paris, la côte atlantique, tout le nord industriel sous contrôle allemand. Couvre-feu, rafles, déportations.",
};

const ZONE_LIBRE: TerritoireInfo = {
  id: "zone-libre", nom: "Zone libre — État français (Vichy)",
  couleur: "#6B7B4A", seigneur: "Maréchal Pétain — État français",
  dateDebut: 1940, dateFin: 1942,
  description: "Zone non occupée jusqu'au 11 novembre 1942 (opération Anton). Gouvernée par Vichy, régime autoritaire collaborant avec l'Allemagne nazie. Statut des Juifs, STO, Milice.",
};

const ALSACE_NAZIE: TerritoireInfo = {
  id: "alsace-moselle-nazie", nom: "Alsace-Moselle (annexée de fait)",
  couleur: "#2A2A1A", seigneur: "Gauleiter Robert Wagner / Josef Bürckel",
  dateDebut: 1940, dateFin: 1944,
  description: "Incorporée de fait au Reich nazi dès août 1940. Germanisation forcée, interdiction du français, expulsion des Alsaciens « non germanisables ». Les « Malgré-nous » enrôlés de force dans la Wehrmacht.",
};

const CORSE_ITALIENNE: TerritoireInfo = {
  id: "corse-italienne", nom: "Corse (occupation italienne)",
  couleur: "#5A6070", seigneur: "Italie fasciste de Mussolini",
  dateDebut: 1942, dateFin: 1943,
  description: "Occupée par l'armée italienne de novembre 1942 à septembre 1943. Première région de France métropolitaine libérée (octobre 1943), grâce à la résistance locale et aux FFL.",
};

export const CARTE_GUERRES_MONDIALES: CarteEpoqueData = {
  "11": ZONE_OCCUPEE,    // Île-de-France (Paris occupée)
  "24": ZONE_OCCUPEE,    // Centre-Val de Loire (Ligne de démarcation traverse cette région)
  "27": ZONE_LIBRE,      // Bourgogne-Franche-Comté (zone libre)
  "28": ZONE_OCCUPEE,    // Normandie (débarquement allié 6 juin 1944)
  "32": ZONE_OCCUPEE,    // Hauts-de-France (zone interdite du nord)
  "44": ALSACE_NAZIE,    // Grand Est (Alsace-Moselle annexée)
  "52": ZONE_OCCUPEE,    // Pays de la Loire (côte atlantique occupée)
  "53": ZONE_OCCUPEE,    // Bretagne (côte atlantique, bases sous-marines de Brest/Lorient)
  "75": ZONE_LIBRE,      // Nouvelle-Aquitaine (zone libre au sud, occupée au nord côte)
  "76": ZONE_LIBRE,      // Occitanie (zone libre, Vichy dans l'Allier voisin)
  "84": ZONE_LIBRE,      // Auvergne-Rhône-Alpes (zone libre, Lyon capitale de la Résistance)
  "93": ZONE_LIBRE,      // PACA (zone libre puis occupation italienne nov. 1942)
  "94": CORSE_ITALIENNE, // Corse
};
