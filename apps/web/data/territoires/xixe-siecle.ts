import type { TerritoireInfo, CarteEpoqueData } from "./types";

const FRANCE_MET: TerritoireInfo = {
  id: "france-metropolitaine", nom: "France métropolitaine",
  couleur: "#708090", seigneur: "Monarchie constitutionnelle / IIIe République",
  dateDebut: 1815, dateFin: 1914,
  description: "Après Waterloo et le Congrès de Vienne (1815), la France retrouve ses frontières de 1789. Six régimes politiques en 85 ans : Restauration, Monarchie de Juillet, IIe République, Second Empire, IIIe République.",
};

const ALSACE_MOSELLE: TerritoireInfo = {
  id: "alsace-moselle-prussienne", nom: "Alsace-Moselle (Empire allemand)",
  couleur: "#4A4A4A", seigneur: "Empire allemand après 1871",
  dateDebut: 1871, dateFin: 1918,
  description: "Cédée à l'Empire allemand par le traité de Francfort (10 mai 1871) après la défaite contre la Prusse. 47 ans d'annexion douloureuse. Restituée à la France en novembre 1918.",
};

export const CARTE_XIXe_SIECLE: CarteEpoqueData = {
  "11": FRANCE_MET,       // Île-de-France
  "24": FRANCE_MET,       // Centre-Val de Loire
  "27": FRANCE_MET,       // Bourgogne-Franche-Comté
  "28": FRANCE_MET,       // Normandie
  "32": FRANCE_MET,       // Hauts-de-France
  "44": ALSACE_MOSELLE,   // Grand Est (Alsace-Moselle annexée après 1871)
  "52": FRANCE_MET,       // Pays de la Loire
  "53": FRANCE_MET,       // Bretagne
  "75": FRANCE_MET,       // Nouvelle-Aquitaine
  "76": FRANCE_MET,       // Occitanie
  "84": FRANCE_MET,       // Auvergne-Rhône-Alpes
  "93": FRANCE_MET,       // PACA
  "94": FRANCE_MET,       // Corse
};
