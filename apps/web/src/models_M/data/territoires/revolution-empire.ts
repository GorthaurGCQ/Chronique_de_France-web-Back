import type { TerritoireInfo, CarteEpoqueData } from "./types";

const FRANCE_REP: TerritoireInfo = {
  id: "france-republicaine", nom: "France républicaine",
  couleur: "#1D3461", seigneur: "République française",
  dateDebut: 1789, dateFin: 1815,
  description: "La loi du 22 décembre 1789 divise la France en 83 départements égaux, effaçant provinces et privilèges féodaux. Liberté, Égalité, Fraternité — nouveaux principes fondateurs.",
};

const FRANCE_IMP: TerritoireInfo = {
  id: "france-imperiale", nom: "Départements de l'Empire",
  couleur: "#2A4A80", seigneur: "Napoléon Ier, Empereur",
  dateDebut: 1804, dateFin: 1814,
  description: "L'Empire napoléonien étend la France jusqu'à 130 départements en 1811 (de Hambourg à Rome). Code civil, Légion d'honneur, lycées — héritage administratif durable.",
};

export const CARTE_REVOLUTION_EMPIRE: CarteEpoqueData = {
  "11": FRANCE_REP,   // Île-de-France
  "24": FRANCE_REP,   // Centre-Val de Loire
  "27": FRANCE_IMP,   // Bourgogne-Franche-Comté
  "28": FRANCE_REP,   // Normandie
  "32": FRANCE_REP,   // Hauts-de-France
  "44": FRANCE_IMP,   // Grand Est (Alsace + Lorraine + Champagne)
  "52": FRANCE_REP,   // Pays de la Loire
  "53": FRANCE_REP,   // Bretagne
  "75": FRANCE_REP,   // Nouvelle-Aquitaine
  "76": FRANCE_REP,   // Occitanie
  "84": FRANCE_IMP,   // Auvergne-Rhône-Alpes
  "93": FRANCE_IMP,   // PACA
  "94": FRANCE_REP,   // Corse (île natale de l'Empereur)
};
