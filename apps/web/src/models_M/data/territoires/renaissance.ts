import type { TerritoireInfo, CarteEpoqueData } from "./types";

const G_IDF: TerritoireInfo = {
  id: "g-ile-de-france", nom: "Gouvernement d'Île-de-France",
  couleur: "#1E3A6E", seigneur: "Gouverneur royal",
  dateDebut: 1461, dateFin: 1790,
  description: "Cœur du domaine royal. Paris et sa région concentrent la cour, l'administration et les grandes institutions du royaume (Parlement, université).",
};

const G_NORMANDIE: TerritoireInfo = {
  id: "g-normandie", nom: "Gouvernement de Normandie",
  couleur: "#5F9EA0", seigneur: "Gouverneur royal",
  dateDebut: 1468, dateFin: 1790,
  description: "Province royale depuis Philippe Auguste (1204). Importante pour le commerce maritime (Rouen, Dieppe) et la production textile (dentelles, draps).",
};

const G_BRETAGNE: TerritoireInfo = {
  id: "g-bretagne", nom: "Gouvernement de Bretagne",
  couleur: "#2E8B57", seigneur: "Gouverneur royal",
  dateDebut: 1532, dateFin: 1790,
  description: "Unie à la France par le traité d'union de 1532. La Bretagne conserve ses États provinciaux, ses coutumes et ses libertés jusqu'à la Révolution.",
};

const G_PICARDIE: TerritoireInfo = {
  id: "g-picardie", nom: "Gouvernement de Picardie",
  couleur: "#4682B4", seigneur: "Gouverneur royal",
  dateDebut: 1477, dateFin: 1790,
  description: "Frontière stratégique face aux Habsbourg (Pays-Bas espagnols). Artois et Boulonnais définitivement français après les guerres contre Charles Quint.",
};

const G_CHAMPAGNE: TerritoireInfo = {
  id: "g-champagne", nom: "Gouvernement de Champagne",
  couleur: "#7B2FBE", seigneur: "Gouverneur royal",
  dateDebut: 1284, dateFin: 1790,
  description: "Province royale depuis 1284. Reims, ville du sacre des rois de France. La Lorraine et l'Alsace voisines restent hors du royaume (réunies progressivement XVIIe s.).",
};

const G_LORRAINE_EMPIRE: TerritoireInfo = {
  id: "g-lorraine-empire", nom: "Lorraine & Alsace (Empire / indépendantes)",
  couleur: "#696969", seigneur: "Duché de Lorraine / Saint-Empire",
  dateDebut: 925, dateFin: 1766,
  description: "La Lorraine est un duché indépendant; l'Alsace un territoire du Saint-Empire. Ils rejoindront progressivement la France : Alsace en 1648, Lorraine en 1766.",
};

const G_BOURGOGNE: TerritoireInfo = {
  id: "g-bourgogne", nom: "Gouvernement de Bourgogne",
  couleur: "#9B2335", seigneur: "Gouverneur royal",
  dateDebut: 1477, dateFin: 1790,
  description: "Revenue à la Couronne à la mort de Charles le Téméraire (1477). Grande richesse agricole et viticole. La Franche-Comté voisine reste espagnole jusqu'en 1678.",
};

const G_CENTRE: TerritoireInfo = {
  id: "g-centre", nom: "Gouvernement d'Orléanais & Berry",
  couleur: "#3A6B9C", seigneur: "Gouverneur royal",
  dateDebut: 1498, dateFin: 1790,
  description: "Châteaux de la Loire, résidence favorite des rois Renaissance (Chambord, Chenonceau, Amboise). Berry, ancien domaine des ducs de Berry.",
};

const G_ANJOU_MAINE: TerritoireInfo = {
  id: "g-anjou-maine", nom: "Gouvernement d'Anjou & Maine",
  couleur: "#C05A78", seigneur: "Gouverneur royal",
  dateDebut: 1480, dateFin: 1790,
  description: "Revenus à la Couronne sous Louis XI et Charles VIII. L'Anjou, dernier apanage royal avant la réunion définitive au domaine (1480).",
};

const G_GUYENNE: TerritoireInfo = {
  id: "g-guyenne", nom: "Gouvernement de Guyenne & Gascogne",
  couleur: "#8B6914", seigneur: "Gouverneur royal",
  dateDebut: 1453, dateFin: 1790,
  description: "Définitivement réunis à la France après Castillon (1453). Bordeaux, grand port d'exportation du vin vers l'Angleterre malgré la fin de la domination anglaise.",
};

const G_LANGUEDOC: TerritoireInfo = {
  id: "g-languedoc", nom: "Gouvernement de Languedoc",
  couleur: "#C87A1E", seigneur: "Gouverneur royal",
  dateDebut: 1271, dateFin: 1790,
  description: "Province méridionale à droit écrit (droit romain). Montpellier, grande université de médecine. Résistance protestante (Huguenots) pendant les guerres de Religion.",
};

const G_AUVERGNE: TerritoireInfo = {
  id: "g-auvergne", nom: "Gouvernement d'Auvergne & Lyon",
  couleur: "#4A7A3A", seigneur: "Gouverneur royal",
  dateDebut: 1527, dateFin: 1790,
  description: "Lyon, deuxième ville du royaume, centre de la soierie et de la banque italienne (foires de Lyon). L'Auvergne réunie définitivement en 1527.",
};

const G_DAUPHINÉ: TerritoireInfo = {
  id: "g-dauphine", nom: "Gouvernement du Dauphiné",
  couleur: "#C84B00", seigneur: "Gouverneur royal",
  dateDebut: 1349, dateFin: 1790,
  description: "Cédé à la France en 1349. Titre du Dauphin donné à l'héritier du trône depuis 1350. Grenoble, capitale du Parlement dauphinois.",
};

const G_PROVENCE: TerritoireInfo = {
  id: "g-provence", nom: "Gouvernement de Provence",
  couleur: "#D2691E", seigneur: "Gouverneur royal",
  dateDebut: 1481, dateFin: 1790,
  description: "Rattachée en 1481. Marseille, premier port méditerranéen français. Présence turque en Méditerranée oblige à renforcer les défenses côtières.",
};

const G_CORSE_GENES: TerritoireInfo = {
  id: "g-corse-genes", nom: "Corse (Gênes)",
  couleur: "#708090", seigneur: "République de Gênes",
  dateDebut: 1347, dateFin: 1768,
  description: "Toujours sous administration génoise. La résistance de Sampiero Corso contre Gênes (1564-1567) bénéficie du soutien de Catherine de Médicis sans succès durable.",
};

export const CARTE_RENAISSANCE: CarteEpoqueData = {
  "11": G_IDF,             // Île-de-France
  "24": G_CENTRE,          // Centre-Val de Loire
  "27": G_BOURGOGNE,       // Bourgogne-Franche-Comté
  "28": G_NORMANDIE,       // Normandie
  "32": G_PICARDIE,        // Hauts-de-France
  "44": G_LORRAINE_EMPIRE, // Grand Est (Champagne + Lorraine hors France)
  "52": G_ANJOU_MAINE,     // Pays de la Loire
  "53": G_BRETAGNE,        // Bretagne
  "75": G_GUYENNE,         // Nouvelle-Aquitaine
  "76": G_LANGUEDOC,       // Occitanie
  "84": G_AUVERGNE,        // Auvergne-Rhône-Alpes
  "93": G_PROVENCE,        // PACA + Dauphiné
  "94": G_CORSE_GENES,     // Corse
};
