import type { TerritoireInfo, CarteEpoqueData } from "./types";

const BELGICA: TerritoireInfo = {
  id: "gallia-belgica",
  nom: "Gallia Belgica",
  couleur: "#D4845A",
  seigneur: "Empire romain",
  dateDebut: -27, dateFin: 400,
  description: "Province septentrionale de la Gaule romaine couvrant le nord-est de la France, la Belgique et le Luxembourg. Chef-lieu : Reims (Durocortorum).",
};

const LUGDUNENSIS: TerritoireInfo = {
  id: "gallia-lugdunensis",
  nom: "Gallia Lugdunensis",
  couleur: "#C4956A",
  seigneur: "Empire romain",
  dateDebut: -27, dateFin: 400,
  description: "Province centrale et occidentale de la Gaule. Lyon (Lugdunum) en est la capitale et le carrefour commercial de tout l'Empire en Occident.",
};

const AQUITANIA: TerritoireInfo = {
  id: "gallia-aquitania",
  nom: "Gallia Aquitania",
  couleur: "#A05A30",
  seigneur: "Empire romain",
  dateDebut: -27, dateFin: 400,
  description: "Province méridionale et atlantique, des Pyrénées à la Loire. Chef-lieu : Bordeaux (Burdigala). Riche en vignes et en commerce maritime.",
};

const NARBONENSIS: TerritoireInfo = {
  id: "gallia-narbonensis",
  nom: "Gallia Narbonensis",
  couleur: "#8B3A1A",
  seigneur: "Empire romain",
  dateDebut: -120, dateFin: 400,
  description: "La plus ancienne province romaine de Gaule (« Nostra Provincia »). Méditerranée et couloir rhodanien. Chef-lieu : Narbonne (Narbo Martius), puis Arles.",
};

const CORSICA: TerritoireInfo = {
  id: "corsica",
  nom: "Corsica",
  couleur: "#6B2A0A",
  seigneur: "Empire romain",
  dateDebut: -238, dateFin: 400,
  description: "Île conquise par Rome en 238 av. J.-C. Administrée conjointement avec la Sardaigne. Patrie de Sénèque qui y fut exilé.",
};

export const CARTE_ANTIQUITE: CarteEpoqueData = {
  "11": LUGDUNENSIS,   // Île-de-France (Lutetia Parisiorum)
  "24": LUGDUNENSIS,   // Centre-Val de Loire (Genabum = Orléans)
  "27": LUGDUNENSIS,   // Bourgogne-Franche-Comté (Augustodunum = Autun)
  "28": LUGDUNENSIS,   // Normandie (Rotomagus = Rouen)
  "32": BELGICA,       // Hauts-de-France (Samarobriva = Amiens, Durocortorum = Reims)
  "44": BELGICA,       // Grand Est (Divodurum = Metz, Argentoratum = Strasbourg)
  "52": LUGDUNENSIS,   // Pays de la Loire (Juliomagus = Angers)
  "53": LUGDUNENSIS,   // Bretagne (Armorica — Vorgium = Carhaix)
  "75": AQUITANIA,     // Nouvelle-Aquitaine (Burdigala = Bordeaux)
  "76": NARBONENSIS,   // Occitanie (Tolosa = Toulouse, Narbo Martius = Narbonne)
  "84": LUGDUNENSIS,   // Auvergne-Rhône-Alpes (Lugdunum = Lyon, capitale)
  "93": NARBONENSIS,   // PACA (Arelate = Arles, Massilia = Marseille)
  "94": CORSICA,       // Corse
};
