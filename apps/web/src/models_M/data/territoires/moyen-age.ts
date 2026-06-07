import type { TerritoireInfo, CarteEpoqueData } from "./types";

const FLANDRE: TerritoireInfo = {
  id: "flandre", nom: "Comté de Flandre",
  couleur: "#DAA520", seigneur: "Baudouin IX de Flandre",
  dateDebut: 862, dateFin: 1477,
  description: "Puissant comté du nord, vassal nominal du roi de France mais allié des Anglais. Grande richesse textile (Bruges, Gand, Ypres) et commerciale.",
};

const CHAMPAGNE: TerritoireInfo = {
  id: "champagne", nom: "Comté de Champagne",
  couleur: "#9370DB", seigneur: "Thibaut III de Champagne",
  dateDebut: 950, dateFin: 1284,
  description: "Comté prospère grâce aux foires de Champagne, carrefour commercial de l'Europe médiévale. Réuni au domaine royal en 1284.",
};

const LORRAINE_EMPIRE: TerritoireInfo = {
  id: "lorraine-empire", nom: "Lorraine & Alsace (Empire)",
  couleur: "#808080", seigneur: "Saint-Empire romain germanique",
  dateDebut: 925, dateFin: 1648,
  description: "Territoires de l'Est relevant du Saint-Empire romain germanique. Hors de la suzeraineté française jusqu'aux traités de Westphalie (1648).",
};

const NORMANDIE: TerritoireInfo = {
  id: "normandie", nom: "Duché de Normandie",
  couleur: "#B8860B", seigneur: "Jean sans Terre (Plantagenêt)",
  dateDebut: 911, dateFin: 1204,
  description: "Fondé par le Viking Rollon (911). Sous les Plantagenêts depuis 1150, conquis par Philippe Auguste en 1204. Berceau de la conquête de l'Angleterre (1066).",
};

const DOMAINE_ROYAL: TerritoireInfo = {
  id: "domaine-royal", nom: "Domaine royal capétien",
  couleur: "#4169E1", seigneur: "Philippe Auguste (1180-1223)",
  dateDebut: 987, dateFin: 1789,
  description: "Territoire sous contrôle direct du roi de France. Très restreint en 1180 (Paris, Orléans, Senlis), il triple sous Philippe Auguste par conquêtes et héritages.",
};

const BOURGOGNE: TerritoireInfo = {
  id: "bourgogne", nom: "Duché de Bourgogne",
  couleur: "#8B0000", seigneur: "Eudes III de Bourgogne",
  dateDebut: 880, dateFin: 1477,
  description: "Grand duché vassal, foyer de l'art roman (Cluny, Vézelay) et cistercien (Cîteaux). Les Ducs de Bourgogne rivalisèrent avec le roi au XVe siècle.",
};

const BRETAGNE: TerritoireInfo = {
  id: "bretagne", nom: "Duché de Bretagne",
  couleur: "#2E8B57", seigneur: "Arthur Ier de Bretagne",
  dateDebut: 939, dateFin: 1532,
  description: "Duché autonome préservant sa langue et ses traditions celtiques. Résiste à l'intégration française. Définitivement uni à la France en 1532.",
};

const ANJOU_PLANTAGENET: TerritoireInfo = {
  id: "anjou-plantagenet", nom: "Anjou, Maine & Touraine",
  couleur: "#DC143C", seigneur: "Plantagenêts (possession anglaise)",
  dateDebut: 1154, dateFin: 1204,
  description: "Terres continentales des rois Plantagenêts d'Angleterre, conquises par Philippe Auguste en 1204-1205. Cœur de l'empire angevin d'Henri II.",
};

const AQUITAINE: TerritoireInfo = {
  id: "aquitaine", nom: "Duché d'Aquitaine",
  couleur: "#CD5C5C", seigneur: "Richard Cœur de Lion",
  dateDebut: 1152, dateFin: 1453,
  description: "Apporté à Henri II par Aliénor d'Aquitaine (1152). Possession anglaise pendant la guerre de Cent Ans, définitivement française après Castillon (1453).",
};

const TOULOUSE: TerritoireInfo = {
  id: "toulouse", nom: "Comté de Toulouse",
  couleur: "#FF8C00", seigneur: "Raymond VII de Toulouse",
  dateDebut: 852, dateFin: 1271,
  description: "Grand comté méridional, centre de la civilisation occitane et du catharisme. Affaibli par la croisade des Albigeois (1209-1229), réuni à la Couronne en 1271.",
};

const PROVENCE: TerritoireInfo = {
  id: "provence", nom: "Comté de Provence",
  couleur: "#FF6347", seigneur: "Maison d'Anjou",
  dateDebut: 879, dateFin: 1481,
  description: "Comté relevant du Saint-Empire, rattaché aux Angevins puis à la France par testament de Charles du Maine (1481). Héritage romain et commerce méditerranéen.",
};

const CORSE_GENES: TerritoireInfo = {
  id: "corse-genes", nom: "Corse (Gênes)",
  couleur: "#708090", seigneur: "République de Gênes",
  dateDebut: 1284, dateFin: 1768,
  description: "Sous domination génoise depuis le XIVe siècle. La résistance corse de Sampiero Corso (1564-1567) échoue. Cédée à la France en 1768.",
};

export const CARTE_MOYEN_AGE: CarteEpoqueData = {
  "11": DOMAINE_ROYAL,       // Île-de-France
  "24": DOMAINE_ROYAL,       // Centre-Val de Loire (Orléanais, Touraine → Plantagenêts mais simplifié ici)
  "27": BOURGOGNE,           // Bourgogne-Franche-Comté
  "28": NORMANDIE,           // Normandie
  "32": FLANDRE,             // Hauts-de-France (Flandre + Artois + Picardie)
  "44": LORRAINE_EMPIRE,     // Grand Est (Lorraine + Alsace + Champagne = CHAMPAGNE pour l'ouest)
  "52": ANJOU_PLANTAGENET,   // Pays de la Loire (Anjou + Maine)
  "53": BRETAGNE,            // Bretagne
  "75": AQUITAINE,           // Nouvelle-Aquitaine
  "76": TOULOUSE,            // Occitanie
  "84": BOURGOGNE,           // Auvergne-Rhône-Alpes (nord = Bourgogne, sud = Provence)
  "93": PROVENCE,            // PACA
  "94": CORSE_GENES,         // Corse
};
