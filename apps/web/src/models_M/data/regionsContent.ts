// Données historiques des 13 régions métropolitaines de France
// Descriptifs régionaux — les cards viennent de la BDD (table resources)

export type RegionCard = {
  id: string;
  titre: string;
  description: string;
  epoque: string;
  epoqueColor: string;
  type: string;
  gradient: string;
  readTime: string;
  thumbnailUrl?: string | null;
};

export type RegionCategorie = {
  id: string;
  label: string;
  subtitle: string;
  cards: RegionCard[];
};

export type RegionContent = {
  id: string;
  code: string;
  nom: string;
  chefLieu: string;
  nbDepartements: number;
  couleur: string;
  heroGradient: string;
  superficieKm2: string;
  population: string;
  description: string;
  descriptionCourte: string;
  epoque: string;
  badge: string;
  categories: RegionCategorie[];
};

// Helper : crée les catégories standard pour une région (cards vides → remplies par la BDD)
function makeCategories(regionNom: string): RegionCategorie[] {
  return [
    {
      id: "patrimoine-histoire",
      label: "Patrimoine & Histoire",
      subtitle: `Monuments, événements et figures qui ont façonné ${regionNom}`,
      cards: [],
    },
    {
      id: "culture-traditions",
      label: "Culture & Traditions",
      subtitle: `Art de vivre, gastronomie et traditions populaires de ${regionNom}`,
      cards: [],
    },
    {
      id: "architecture",
      label: "Architecture & Patrimoine Bâti",
      subtitle: `Cathédrales, châteaux et villages remarquables de ${regionNom}`,
      cards: [],
    },
    {
      id: "geographie",
      label: "Géographie & Territoires",
      subtitle: `Paysages, reliefs et territoires de ${regionNom}`,
      cards: [],
    },
    {
      id: "figures",
      label: "Figures Historiques",
      subtitle: `Personnages marquants de l'histoire de ${regionNom}`,
      cards: [],
    },
    {
      id: "evenements",
      label: "Événements Marquants",
      subtitle: `Les grandes dates et tournants décisifs de l'histoire de ${regionNom}`,
      cards: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// REGIONS_CONTENT — dictionnaire complet des 13 régions
// ---------------------------------------------------------------------------
export const REGIONS_CONTENT: Record<string, RegionContent> = {
  "ile-de-france": {
    id: "ile-de-france",
    code: "11",
    nom: "Île-de-France",
    chefLieu: "Paris",
    nbDepartements: 8,
    couleur: "#7B9ED9",
    heroGradient: "linear-gradient(135deg, #7b9ed9 0%, #4a6fa5 40%, #1a3a70 100%)",
    superficieKm2: "12 012",
    population: "12,3 millions",
    description:
      "Cœur politique, économique et culturel de la France depuis le XIe siècle, l'Île-de-France concentre les symboles du pouvoir national. De la cathédrale de Saint-Denis, nécropole royale, au château de Versailles, palais absolu de Louis XIV, en passant par Notre-Dame de Paris et le Louvre, cette région est un condensé de l'histoire de France. C'est ici que les Capétiens forgent l'État royal, que la Révolution éclate en 1789, que la République s'invente et que la modernité rayonne depuis l'Exposition universelle de 1900.",
    descriptionCourte:
      "Cœur politique et culturel de la France, l'Île-de-France abrite Versailles, le Louvre et des siècles d'histoire royale et républicaine.",
    epoque: "Ve République",
    badge: "ÎLE-DE-FRANCE — 11",
    categories: makeCategories("l'Île-de-France"),
  },

  "centre-val-de-loire": {
    id: "centre-val-de-loire",
    code: "24",
    nom: "Centre-Val de Loire",
    chefLieu: "Orléans",
    nbDepartements: 6,
    couleur: "#F7DC6F",
    heroGradient: "linear-gradient(135deg, #d4b840 0%, #a08020 40%, #6a5210 100%)",
    superficieKm2: "39 151",
    population: "2,6 millions",
    description:
      "Surnommé la « Vallée des Rois », le Centre-Val de Loire est le jardin de la France Renaissance. Ses châteaux — Chambord, Chenonceau, Amboise, Blois, Chaumont — furent les résidences préférées des rois de France du XVe au XVIIe siècle. C'est également ici que Jeanne d'Arc lève le siège d'Orléans en 1429, renversant le cours de la Guerre de Cent Ans. La cathédrale gothique de Chartres, inscrite à l'UNESCO, domine les plaines beauceraines depuis le XIIe siècle.",
    descriptionCourte:
      "La Vallée des Rois avec ses châteaux de la Renaissance — Chambord, Chenonceau, Amboise — témoins du faste de la cour de France.",
    epoque: "Ve République",
    badge: "CENTRE-VAL DE LOIRE — 24",
    categories: makeCategories("le Centre-Val de Loire"),
  },

  "bourgogne-franche-comte": {
    id: "bourgogne-franche-comte",
    code: "27",
    nom: "Bourgogne-Franche-Comté",
    chefLieu: "Dijon",
    nbDepartements: 8,
    couleur: "#F1948A",
    heroGradient: "linear-gradient(135deg, #c0605a 0%, #8a3030 40%, #5a1010 100%)",
    superficieKm2: "47 784",
    population: "2,8 millions",
    description:
      "Terre de ducs ambitieux et de vignobles légendaires, la Bourgogne a joué un rôle majeur dans l'histoire médiévale européenne. Le duché de Bourgogne, quasi-État indépendant au XVe siècle, rivalise avec le royaume de France. Ses abbayes cistercienne de Cîteaux et bénédictine de Cluny rayonnent sur la chrétienté. La Franche-Comté, longtemps espagnole, n'est réunie à la France qu'en 1678. Ensemble, elles forment l'une des régions culturellement et gastronomiquement les plus riches de France.",
    descriptionCourte:
      "Terre de ducs puissants et de vignobles légendaires, la Bourgogne a façonné la culture et la gastronomie françaises depuis le Moyen Âge.",
    epoque: "Ve République",
    badge: "BOURGOGNE-FRANCHE-COMTÉ — 27",
    categories: makeCategories("la Bourgogne-Franche-Comté"),
  },

  normandie: {
    id: "normandie",
    code: "28",
    nom: "Normandie",
    chefLieu: "Rouen",
    nbDepartements: 5,
    couleur: "#76D7C4",
    heroGradient: "linear-gradient(135deg, #3aa090 0%, #1a706a 40%, #0a4040 100%)",
    superficieKm2: "29 907",
    population: "3,3 millions",
    description:
      "Des Vikings aux plages du Débarquement, la Normandie porte mille ans d'histoire maritime et militaire. Fondée en 911 par Rollon le Viking, elle produit Guillaume le Conquérant qui s'empare de l'Angleterre en 1066. Ses abbayes romanes, sa cathédrale gothique de Rouen et le mont Saint-Michel témoignent d'une richesse artistique exceptionnelle. Le 6 juin 1944, ses plages deviennent le théâtre de la plus grande opération militaire amphibie de l'histoire, qui scelle la libération de l'Europe.",
    descriptionCourte:
      "Des Vikings aux plages du Débarquement, la Normandie porte mille ans d'histoire maritime et militaire, entre cathédrales gothiques et falaises calcaires.",
    epoque: "Ve République",
    badge: "NORMANDIE — 28",
    categories: makeCategories("la Normandie"),
  },

  "hauts-de-france": {
    id: "hauts-de-france",
    code: "32",
    nom: "Hauts-de-France",
    chefLieu: "Lille",
    nbDepartements: 5,
    couleur: "#85C1E9",
    heroGradient: "linear-gradient(135deg, #5090c0 0%, #2a6090 40%, #0a3060 100%)",
    superficieKm2: "31 813",
    population: "6,0 millions",
    description:
      "Carrefour de l'Europe du Nord et champ de bataille de l'Europe, les Hauts-de-France ont payé un tribut sanglant aux deux guerres mondiales. La bataille de la Somme (1916) et les terribles combats des Flandres font de ce territoire l'un des plus endeuillés de France. Mais c'est aussi une région de fêtes populaires — géants processionnels, carnavals —, de cathédrales gothiques et d'une culture industrielle et minière qui a façonné le mouvement ouvrier français.",
    descriptionCourte:
      "Carrefour de l'Europe du Nord, cette région a été le théâtre de batailles décisives et d'une riche culture textile et industrielle.",
    epoque: "Ve République",
    badge: "HAUTS-DE-FRANCE — 32",
    categories: makeCategories("les Hauts-de-France"),
  },

  "grand-est": {
    id: "grand-est",
    code: "44",
    nom: "Grand Est",
    chefLieu: "Strasbourg",
    nbDepartements: 10,
    couleur: "#BB8FCE",
    heroGradient: "linear-gradient(135deg, #9060b0 0%, #603080 40%, #301040 100%)",
    superficieKm2: "57 433",
    population: "5,5 millions",
    description:
      "L'Alsace, la Champagne et la Lorraine forment un creuset où se mêlent influences françaises et germaniques depuis des siècles. Strasbourg, capital européenne, incarne la réconciliation franco-allemande. Reims, ville du sacre des rois de France, abrite l'une des plus belles cathédrales gothiques. La Lorraine, marquée par deux guerres mondiales et l'histoire de Jeanne d'Arc, et la Champagne, avec ses vignobles et ses cathédrales, composent une région d'une richesse historique exceptionnelle.",
    descriptionCourte:
      "L'Alsace, la Champagne et la Lorraine forment un creuset où se mêlent influences françaises et germaniques depuis des siècles.",
    epoque: "Ve République",
    badge: "GRAND EST — 44",
    categories: makeCategories("le Grand Est"),
  },

  "pays-de-la-loire": {
    id: "pays-de-la-loire",
    code: "52",
    nom: "Pays de la Loire",
    chefLieu: "Nantes",
    nbDepartements: 5,
    couleur: "#82E0AA",
    heroGradient: "linear-gradient(135deg, #50b070 0%, #208050 40%, #0a5030 100%)",
    superficieKm2: "32 082",
    population: "3,8 millions",
    description:
      "Entre Loire royale et Atlantique, les Pays de la Loire concentrent un patrimoine exceptionnel. Nantes, capitale du duché de Bretagne puis premier port négrier français, incarne les contradictions de l'histoire. La Guerre de Vendée (1793) y laisse des cicatrices profondes. Le château des Ducs de Bretagne, l'édit de Nantes signé en 1598 et la naissance de Jules Verne font de cette ville un carrefour d'histoires majeures. Les châteaux ligériens rayonnent sur toute la région.",
    descriptionCourte:
      "Entre Loire royale et Atlantique, cette région abrite un patrimoine Renaissance exceptionnel et une tradition maritime ancestrale.",
    epoque: "Ve République",
    badge: "PAYS DE LA LOIRE — 52",
    categories: makeCategories("les Pays de la Loire"),
  },

  bretagne: {
    id: "bretagne",
    code: "53",
    nom: "Bretagne",
    chefLieu: "Rennes",
    nbDepartements: 4,
    couleur: "#85929E",
    heroGradient: "linear-gradient(135deg, #556070 0%, #304050 40%, #101a20 100%)",
    superficieKm2: "27 208",
    population: "3,4 millions",
    description:
      "Terre celtique aux menhirs millénaires et aux pardons colorés, la Bretagne conserve une identité culturelle et linguistique unique en France. Ses alignements mégalithiques de Carnac, les plus importants au monde, témoignent de cinq millénaires de présence humaine. Les corsaires de Saint-Malo, Anne de Bretagne et les résistants de la Seconde Guerre mondiale incarnent son caractère indépendant et combatif. La langue bretonne, dernier idiome celtique continental, forge une identité vivace.",
    descriptionCourte:
      "Terre celtique aux menhirs millénaires et aux pardons colorés, la Bretagne conserve une identité culturelle et linguistique unique en France.",
    epoque: "Ve République",
    badge: "BRETAGNE — 53",
    categories: makeCategories("la Bretagne"),
  },

  "nouvelle-aquitaine": {
    id: "nouvelle-aquitaine",
    code: "75",
    nom: "Nouvelle-Aquitaine",
    chefLieu: "Bordeaux",
    nbDepartements: 12,
    couleur: "#7EC8A0",
    heroGradient: "linear-gradient(135deg, #4a9870 0%, #1a6840 40%, #0a3820 100%)",
    superficieKm2: "84 061",
    population: "6,1 millions",
    description:
      "La plus grande région de France s'étend des vignes de Bordeaux aux falaises du Pays basque, en passant par la Dordogne préhistorique et les landes de Gascogne. Lascaux révèle l'art pariétal le plus sophistiqué du Paléolithique. Aliénor d'Aquitaine y règne avant de devenir reine de France puis d'Angleterre. Bordeaux, enrichie par le commerce du vin et la traite esclavagiste, est aujourd'hui inscrite au patrimoine mondial de l'UNESCO.",
    descriptionCourte:
      "La plus grande région de France, des vignes de Bordeaux aux falaises du Pays basque, riche d'une préhistoire exceptionnelle à Lascaux.",
    epoque: "Ve République",
    badge: "NOUVELLE-AQUITAINE — 75",
    categories: makeCategories("la Nouvelle-Aquitaine"),
  },

  occitanie: {
    id: "occitanie",
    code: "76",
    nom: "Occitanie",
    chefLieu: "Toulouse",
    nbDepartements: 13,
    couleur: "#C8A07E",
    heroGradient: "linear-gradient(135deg, #c8a07e 0%, #8b6340 40%, #5c3d1e 100%)",
    superficieKm2: "72 724",
    population: "6 millions",
    description:
      "Berceau de la langue d'oc et des troubadours, l'Occitanie est bien plus qu'une simple région administrative : c'est une civilisation à part entière. Des cathares du Languedoc aux chevaliers des Pyrénées, en passant par les arènes romaines de Nîmes et l'abbaye de Gellone, ce territoire concentre une densité historique exceptionnelle. Baignée par la Méditerranée à l'est et adossée aux Pyrénées au sud, elle a été le théâtre de la croisade albigeoise, des hérésies médiévales, de la Renaissance toulousaine et des guerres de Religion.",
    descriptionCourte:
      "Langue d'oc, cathares, troubadours — l'Occitanie est une civilisation à part entière, marquée par ses châteaux médiévaux et la mer Méditerranée.",
    epoque: "Ve République",
    badge: "OCCITANIE — 76",
    categories: makeCategories("l'Occitanie"),
  },

  "auvergne-rhone-alpes": {
    id: "auvergne-rhone-alpes",
    code: "84",
    nom: "Auvergne-Rhône-Alpes",
    chefLieu: "Lyon",
    nbDepartements: 12,
    couleur: "#F4A460",
    heroGradient: "linear-gradient(135deg, #d08040 0%, #a05010 40%, #602000 100%)",
    superficieKm2: "69 711",
    population: "8,1 millions",
    description:
      "Des volcans éteints d'Auvergne aux sommets des Alpes, cette région unit une nature grandiose à une histoire millénaire. Lyon, fondée en 43 avant J.-C. comme Lugdunum, capitale des Gaules romaines, reste la deuxième ville de France. Elle abrite les chefs-d'œuvre de la soierie, l'invention du cinéma par les frères Lumière et fut la capitale de la Résistance française durant l'Occupation. La chaîne des Puys, classée UNESCO, offre un panorama volcanique unique en Europe.",
    descriptionCourte:
      "Des volcans d'Auvergne aux Alpes majestueuses, cette région unit nature grandiose et cités antiques comme Lyon, ancienne capitale des Gaules.",
    epoque: "Ve République",
    badge: "AUVERGNE-RHÔNE-ALPES — 84",
    categories: makeCategories("l'Auvergne-Rhône-Alpes"),
  },

  paca: {
    id: "paca",
    code: "93",
    nom: "Provence-Alpes-Côte d'Azur",
    chefLieu: "Marseille",
    nbDepartements: 6,
    couleur: "#D4AC72",
    heroGradient: "linear-gradient(135deg, #c09040 0%, #906010 40%, #503000 100%)",
    superficieKm2: "31 400",
    population: "5,1 millions",
    description:
      "Lumière méditerranéenne, lavandes de Haute-Provence, cités romaines — la Provence a inspiré peintres, poètes et philosophes depuis l'Antiquité. Marseille, fondée par des Grecs en 600 avant J.-C., est la plus ancienne ville de France. Avignon accueille la papauté au XIVe siècle et reste un centre culturel européen. La Côte d'Azur, inventée au XIXe siècle par les aristocrates britanniques, attire aujourd'hui artistes et milliardaires du monde entier.",
    descriptionCourte:
      "Lumière méditerranéenne, lavandes de Haute-Provence, cités romaines — la Provence a inspiré peintres, poètes et philosophes depuis l'Antiquité.",
    epoque: "Ve République",
    badge: "PROVENCE-ALPES-CÔTE D'AZUR — 93",
    categories: makeCategories("la Provence-Alpes-Côte d'Azur"),
  },

  corse: {
    id: "corse",
    code: "94",
    nom: "Corse",
    chefLieu: "Ajaccio",
    nbDepartements: 2,
    couleur: "#F1948A",
    heroGradient: "linear-gradient(135deg, #c06060 0%, #803030 40%, #401010 100%)",
    superficieKm2: "8 680",
    population: "340 000",
    description:
      "Île de Beauté, berceau de Napoléon Bonaparte, la Corse offre un patrimoine naturel et culturel unique entre maquis odorant et citadelles génoises. Son histoire est marquée par des siècles de domination étrangère — pisane, génoise, française — contre lesquels les Corses ont farouchement résisté. Pascal Paoli, père fondateur de la première constitution démocratique moderne (1755), incarne cet esprit d'indépendance. Premier département français libéré en 1943, la Corse tient une place particulière dans l'histoire de la Résistance.",
    descriptionCourte:
      "Île de Beauté, berceau de Napoléon Bonaparte, la Corse offre un patrimoine naturel et culturel unique entre maquis odorant et citadelles génoises.",
    epoque: "Ve République",
    badge: "CORSE — 94",
    categories: makeCategories("la Corse"),
  },
};
