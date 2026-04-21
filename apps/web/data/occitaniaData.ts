// Données statiques de la région Occitanie
// Modifier cet objet pour mettre à jour le contenu de la page /regions/occitanie

export const OCCITANIE_INFO = {
  id: "occitanie",
  code: "76",
  nom: "Occitanie",
  chefLieu: "Toulouse",
  nbDepartements: 13,
  couleur: "#C8A07E",
  superficieKm2: "72 724",
  population: "6 millions",
  description:
    "Berceau de la langue d'oc et des troubadours, l'Occitanie est bien plus qu'une simple région administrative : c'est une civilisation à part entière. Des cathares du Languedoc aux chevaliers des Pyrénées, en passant par les arènes romaines de Nîmes et l'abbaye de Gellone, ce territoire concentre une densité historique exceptionnelle. Baignée par la Méditerranée à l'est et adossée aux Pyrénées au sud, elle a été le théâtre de la croisade albigeoise, des hérésies médiévales, de la Renaissance toulousaine et des guerres de Religion. Aujourd'hui, Toulouse — la Ville Rose — en est le cœur scientifique et culturel, tandis que Montpellier rayonne sur toute la façade méditerranéenne.",
  descriptionCourte:
    "Langue d'oc, cathares, troubadours — l'Occitanie est une civilisation à part entière, marquée par ses châteaux médiévaux et la mer Méditerranée.",
  epoque: "Ve République",
  badge: "OCCITANIE — 76",
};

export type OccitanieCard = {
  id: string;
  titre: string;
  description: string;
  epoque: string;
  epoqueColor: string;
  type: string;
  gradient: string;
  readTime: string;
};

export const OCCITANIE_CARDS: OccitanieCard[] = [
  {
    id: "cite-carcassonne",
    titre: "La Cité de Carcassonne",
    description:
      "Forteresse médiévale classée UNESCO, Carcassonne est l'une des mieux conservées d'Europe. Ses remparts doubles et ses 52 tours témoignent de la puissance des comtes de Barcelone.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #5c4033 0%, #3e2723 100%)",
    readTime: "12 min de lecture",
  },
  {
    id: "croisade-albigeoise",
    titre: "La Croisade Albigeoise",
    description:
      "Déclenchée en 1209 par Innocent III contre les cathares, cette croisade marqua profondément le Languedoc. Le massacre de Béziers reste l'un des épisodes les plus sombres du Moyen Âge.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #7b1f1f 0%, #4a0e0e 100%)",
    readTime: "18 min de lecture",
  },
  {
    id: "pont-du-gard",
    titre: "Le Pont du Gard",
    description:
      "Chef-d'œuvre de l'ingénierie romaine, ce pont-aqueduc du Ier siècle enjambe le Gardon sur trois niveaux d'arcades. Il alimentait Nîmes en eau sur près de 50 kilomètres.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Monument",
    gradient: "linear-gradient(135deg, #b08850 0%, #7a5c2e 100%)",
    readTime: "10 min de lecture",
  },
  {
    id: "troubadours",
    titre: "Les Troubadours et la Langue d'Oc",
    description:
      "Au XIIe siècle, l'Occitanie donna naissance aux troubadours, poètes-musiciens inventeurs de l'amour courtois. Leur art influença toute la poésie européenne médiévale.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #8d6e52 0%, #5d4037 100%)",
    readTime: "15 min de lecture",
  },
  {
    id: "capitole-toulouse",
    titre: "Le Capitole de Toulouse",
    description:
      "Symbole de la Ville Rose, le Capitole est à la fois l'hôtel de ville et l'opéra de Toulouse. Sa façade néoclassique rose et sa place emblématique dominent le cœur de la cité.",
    epoque: "RENAISSANCE",
    epoqueColor: "#2E5339",
    type: "Monument",
    gradient: "linear-gradient(135deg, #c0785a 0%, #8b4513 100%)",
    readTime: "8 min de lecture",
  },
  {
    id: "canal-du-midi",
    titre: "Le Canal du Midi",
    description:
      "Creusé entre 1666 et 1681 sous Louis XIV, le Canal du Midi relie Toulouse à la Méditerranée sur 240 km. Classé UNESCO, il représente le chef-d'œuvre du génie civil français du XVIIe siècle.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1A3A5C",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #2c6e8a 0%, #1a4a60 100%)",
    readTime: "14 min de lecture",
  },
];

/* ── Catégories de la page Occitanie ── */
export type Categorie = {
  id: string;
  label: string;
  subtitle: string;
  cards: OccitanieCard[];
};

export const OCCITANIE_CATEGORIES: Categorie[] = [
  {
    id: "patrimoine-histoire",
    label: "Patrimoine & Histoire",
    subtitle: "Monuments, événements et figures qui ont façonné l'Occitanie",
    cards: OCCITANIE_CARDS,
  },
  {
    id: "culture-traditions",
    label: "Culture & Traditions",
    subtitle: "Langue d'oc, troubadours et patrimoine immatériel de l'Occitanie",
    cards: [],
  },
  {
    id: "architecture",
    label: "Architecture & Patrimoine Bâti",
    subtitle: "Cathédrales, châteaux cathares et villages médiévaux d'Occitanie",
    cards: [],
  },
  {
    id: "geographie",
    label: "Géographie & Territoires",
    subtitle: "Pyrénées, Méditerranée, Garonne — les paysages et territoires de l'Occitanie",
    cards: [],
  },
  {
    id: "figures",
    label: "Figures Historiques",
    subtitle: "Rois, chevaliers, poètes et personnages marquants de l'histoire occitane",
    cards: [],
  },
  {
    id: "evenements",
    label: "Événements Marquants",
    subtitle: "Les tournants décisifs et grandes dates de l'histoire de l'Occitanie",
    cards: [],
  },
];
