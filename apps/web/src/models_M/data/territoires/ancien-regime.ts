import type { TerritoireInfo, CarteEpoqueData } from "./types";

const P_IDF: TerritoireInfo = {
  id: "p-ile-de-france", nom: "Île-de-France",
  couleur: "#1A2744", seigneur: "Province royale",
  dateDebut: 987, dateFin: 1790,
  description: "Cœur du royaume. La cour s'installe à Versailles en 1682 sous Louis XIV. Paris, capitale intellectuelle (Académies, Encyclopédie) et administrative.",
};

const P_NORMANDIE: TerritoireInfo = {
  id: "p-normandie", nom: "Province de Normandie",
  couleur: "#5B9BD5", seigneur: "Province royale",
  dateDebut: 1204, dateFin: 1790,
  description: "Grande province commerçante. Rouen, grand centre de draperie. Le Havre fondé par François Ier (1517). Forte présence protestante, mémoire de la Saint-Barthélemy.",
};

const P_BRETAGNE: TerritoireInfo = {
  id: "p-bretagne", nom: "Province de Bretagne",
  couleur: "#1E7A3C", seigneur: "Province à États",
  dateDebut: 1532, dateFin: 1790,
  description: "Province à États, jalousement attachée à ses privilèges. Les États de Bretagne votent leurs propres impôts. Rébellion du papier timbré (1675) sous Louis XIV.",
};

const P_CENTRE: TerritoireInfo = {
  id: "p-centre", nom: "Orléanais, Berry & Bourbonnais",
  couleur: "#2E4A7A", seigneur: "Province royale",
  dateDebut: 1498, dateFin: 1790,
  description: "Territoires du cœur du royaume. Le Bourbonnais a donné son nom à la dinastia régnante depuis Henri IV (1589). Berry, pays de Jeanne d'Arc et de Jacques Cœur.",
};

const P_CHAMPAGNE: TerritoireInfo = {
  id: "p-champagne", nom: "Province de Champagne",
  couleur: "#7B2FBE", seigneur: "Province royale",
  dateDebut: 1284, dateFin: 1790,
  description: "Patrie du champagne (Dom Pérignon, v. 1693). Reims, ville du sacre. Frontière-est face aux Habsbourg, dotée de places fortes par Vauban.",
};

const P_ALSACE_LORRAINE: TerritoireInfo = {
  id: "p-alsace-lorraine", nom: "Alsace & Lorraine",
  couleur: "#6A4C93", seigneur: "Province royale",
  dateDebut: 1648, dateFin: 1871,
  description: "L'Alsace acquise par les traités de Westphalie (1648), la Lorraine rattachée en 1766 à la mort de Stanislas Leszczyński. Terres de culture franco-germanique.",
};

const P_BOURGOGNE: TerritoireInfo = {
  id: "p-bourgogne", nom: "Bourgogne & Franche-Comté",
  couleur: "#8B0000", seigneur: "Province à États",
  dateDebut: 1477, dateFin: 1790,
  description: "Province à États conservant ses institutions ducales. Dijonnais prospère; Franche-Comté espagnole annexée par Louis XIV en 1678 (traité de Nimègue).",
};

const P_ANJOU_MAINE: TerritoireInfo = {
  id: "p-anjou-maine", nom: "Anjou, Maine & Touraine",
  couleur: "#3A6B9C", seigneur: "Province royale",
  dateDebut: 1480, dateFin: 1790,
  description: "Val de Loire, jardin de la France. Châteaux royaux (Chambord construit sous Louis XIV). Angers, ancienne capitale angevine. Agriculture et horticulture renommées.",
};

const P_POITOU: TerritoireInfo = {
  id: "p-poitou", nom: "Poitou & Saintonge",
  couleur: "#4A8C6F", seigneur: "Province royale",
  dateDebut: 1453, dateFin: 1790,
  description: "Patrie de Richelieu. Commerce du sel de l'Atlantique et des eaux-de-vie (cognac, armagnac). Fort ancrage protestant, dragonnades de Louis XIV.",
};

const P_GUYENNE: TerritoireInfo = {
  id: "p-guyenne", nom: "Guyenne & Gascogne",
  couleur: "#7D5A2E", seigneur: "Province royale",
  dateDebut: 1453, dateFin: 1790,
  description: "Bordeaux, port du vin de Bordeaux. Montesquieu, Montaigne, natifs de Guyenne. La Gascogne, pays des mousquetaires (d'Artagnan de Lupiac).",
};

const P_LANGUEDOC: TerritoireInfo = {
  id: "p-languedoc", nom: "Province de Languedoc",
  couleur: "#C4782A", seigneur: "Province à États",
  dateDebut: 1271, dateFin: 1790,
  description: "Province à États, la plus étendue du royaume. Canal du Midi de Pierre-Paul Riquet (1681), exploit d'ingénierie de Louis XIV. Patrie de la langue d'oc.",
};

const P_DAUPHINÉ: TerritoireInfo = {
  id: "p-dauphine", nom: "Dauphiné & Savoie",
  couleur: "#5A7A2E", seigneur: "Province royale",
  dateDebut: 1349, dateFin: 1790,
  description: "Le Dauphiné, fief de l'héritier du trône. La Savoie, possession des Ducs de Savoie (alliés de la France), ne devient française qu'en 1860.",
};

const P_PROVENCE: TerritoireInfo = {
  id: "p-provence", nom: "Province de Provence",
  couleur: "#C84B00", seigneur: "Province royale",
  dateDebut: 1481, dateFin: 1790,
  description: "Rattachée en 1481. Marseille, premier port de Méditerranée. Nice et le Comté de Nice restent sardes. Mistral et culture provençale distincte.",
};

const P_CORSE: TerritoireInfo = {
  id: "p-corse", nom: "Corse",
  couleur: "#A08060", seigneur: "France depuis 1768",
  dateDebut: 1768, dateFin: 1790,
  description: "Achetée à Gênes en 1768. Napoléon Bonaparte y naît le 15 août 1769, un an après le rattachement. Devient département français en 1790.",
};

export const CARTE_ANCIEN_REGIME: CarteEpoqueData = {
  "11": P_IDF,             // Île-de-France
  "24": P_CENTRE,          // Centre-Val de Loire
  "27": P_BOURGOGNE,       // Bourgogne-Franche-Comté
  "28": P_NORMANDIE,       // Normandie
  "32": P_CHAMPAGNE,       // Hauts-de-France (Flandre + Picardie + Champagne nord)
  "44": P_ALSACE_LORRAINE, // Grand Est (Alsace 1648 + Lorraine 1766)
  "52": P_ANJOU_MAINE,     // Pays de la Loire
  "53": P_BRETAGNE,        // Bretagne
  "75": P_GUYENNE,         // Nouvelle-Aquitaine
  "76": P_LANGUEDOC,       // Occitanie
  "84": P_DAUPHINÉ,        // Auvergne-Rhône-Alpes
  "93": P_PROVENCE,        // PACA
  "94": P_CORSE,           // Corse
};
