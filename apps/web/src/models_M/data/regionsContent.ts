// Données historiques des 13 régions métropolitaines de France
// Chaque région contient : INFO + CARDS (4-6) + CATEGORIES

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

// ---------------------------------------------------------------------------
// Île-de-France
// ---------------------------------------------------------------------------
const IDF_CARDS: RegionCard[] = [
  {
    id: "versailles",
    titre: "Le Château de Versailles",
    description:
      "Symbole absolu de la monarchie absolue, Versailles fut bâti sous Louis XIV pour centraliser la cour et incarner la grandeur du Roi-Soleil. Sa galerie des Glaces et ses jardins à la française en font le chef-d'œuvre de l'Ancien Régime.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Monument",
    gradient: "linear-gradient(135deg, #2c5f7a 0%, #1a3a55 100%)",
    readTime: "14 min de lecture",
  },
  {
    id: "notre-dame",
    titre: "Notre-Dame de Paris",
    description:
      "Joyau du gothique français, Notre-Dame fut érigée entre 1163 et 1345. Lieu de couronnement, de funérailles royales et de cérémonies nationales, elle incarne dix siècles d'histoire française avant l'incendie de 2019.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #5c4033 0%, #3e2723 100%)",
    readTime: "12 min de lecture",
  },
  {
    id: "commune-paris",
    titre: "La Commune de Paris (1871)",
    description:
      "Après la défaite face à la Prusse, Paris se soulève en mars 1871. Pendant 72 jours, la Commune instaure une gouvernance ouvrière révolutionnaire avant d'être écrasée lors de la Semaine sanglante.",
    epoque: "XIXe SIÈCLE",
    epoqueColor: "#253560",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #4a1942 0%, #2d0f28 100%)",
    readTime: "16 min de lecture",
  },
  {
    id: "capetiens",
    titre: "Les Capétiens, dynasty royale",
    description:
      "Fondée en 987 par Hugues Capet, la dynastie capétienne règne sur la France pendant plus de 800 ans. Depuis l'Île-de-France, ces rois bâtissent l'État français, unifient le territoire et fondent Paris comme capitale.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #8d6e52 0%, #5d4037 100%)",
    readTime: "18 min de lecture",
  },
  {
    id: "prise-bastille",
    titre: "La Prise de la Bastille",
    description:
      "Le 14 juillet 1789, le peuple parisien prend d'assaut la forteresse royale de la Bastille, symbole de l'arbitraire royal. Cet événement fondateur marque le début de la Révolution française et reste la fête nationale.",
    epoque: "RÉVOLUTION",
    epoqueColor: "#5a1820",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #7b1f1f 0%, #4a0e0e 100%)",
    readTime: "10 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Centre-Val de Loire
// ---------------------------------------------------------------------------
const CVL_CARDS: RegionCard[] = [
  {
    id: "chambord",
    titre: "Le Château de Chambord",
    description:
      "Chef-d'œuvre de la Renaissance française, Chambord fut commandé par François Ier en 1519. Son escalier à double révolution, attribué à Léonard de Vinci, et ses 440 pièces en font l'un des châteaux les plus grandioses d'Europe.",
    epoque: "RENAISSANCE",
    epoqueColor: "#2E5339",
    type: "Monument",
    gradient: "linear-gradient(135deg, #c0785a 0%, #8b4513 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "jeanne-arc-orleans",
    titre: "Jeanne d'Arc et le siège d'Orléans",
    description:
      "En 1429, une jeune paysanne lorraine de 17 ans lève le siège d'Orléans et renverse le cours de la Guerre de Cent Ans. Jeanne d'Arc devient la figure nationale par excellence, brûlée à Rouen en 1431.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #d4a843 0%, #8b6914 100%)",
    readTime: "15 min de lecture",
  },
  {
    id: "chenonceau",
    titre: "Chenonceau, le château des Dames",
    description:
      "Surnommé le château des Dames, Chenonceau fut successivement propriété de Diane de Poitiers et de Catherine de Médicis. Son arche enjambant le Cher en fait l'un des monuments les plus visités de France.",
    epoque: "RENAISSANCE",
    epoqueColor: "#2E5339",
    type: "Monument",
    gradient: "linear-gradient(135deg, #8fac6e 0%, #4a7a2a 100%)",
    readTime: "9 min de lecture",
  },
  {
    id: "guerres-religion-touraine",
    titre: "Les Guerres de Religion en Touraine",
    description:
      "La Touraine fut au cœur des guerres de Religion (1562-1598) qui déchirèrent la France. Amboise, où le complot huguenot de 1560 fut réprimé dans le sang, symbolise la violence confessionnelle de cette époque.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #2c6e8a 0%, #1a4a60 100%)",
    readTime: "13 min de lecture",
  },
  {
    id: "cathedrale-chartres",
    titre: "La Cathédrale de Chartres",
    description:
      "Classée au patrimoine mondial de l'UNESCO, la cathédrale Notre-Dame de Chartres est l'un des exemples les plus aboutis de l'art gothique. Ses deux clochers dissemblables et ses célèbres vitraux bleus datent du XIIe siècle.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #4a6fa5 0%, #2a4070 100%)",
    readTime: "10 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Bourgogne-Franche-Comté
// ---------------------------------------------------------------------------
const BFC_CARDS: RegionCard[] = [
  {
    id: "alesia",
    titre: "Vercingétorix à Alésia (52 av. J.-C.)",
    description:
      "En 52 avant J.-C., le chef gaulois Vercingétorix défie César lors du siège d'Alésia. Malgré une résistance acharnée, la capitulation marque la fin de la Gaule indépendante et l'intégration durable au monde romain.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #b08850 0%, #7a5c2e 100%)",
    readTime: "14 min de lecture",
  },
  {
    id: "ducs-bourgogne",
    titre: "Les Grands Ducs de Bourgogne",
    description:
      "Du XIVe au XVe siècle, les ducs Valois de Bourgogne — Philippe le Hardi, Jean sans Peur, Philippe le Bon, Charles le Téméraire — construisent un état puissant qui rivalise avec le royaume de France lui-même.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #8d2c2c 0%, #5a1a1a 100%)",
    readTime: "17 min de lecture",
  },
  {
    id: "abbaye-cluny",
    titre: "L'Abbaye de Cluny",
    description:
      "Fondée en 910, l'abbaye de Cluny fut le centre de la réforme monastique bénédictine et le plus grand complexe religieux de la chrétienté médiévale. Son abbatiale, détruite à la Révolution, était plus grande que Saint-Pierre de Rome.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #5c4033 0%, #3e2723 100%)",
    readTime: "12 min de lecture",
  },
  {
    id: "route-grands-crus",
    titre: "La Route des Grands Crus de Bourgogne",
    description:
      "Inscrite au patrimoine mondial de l'UNESCO, la Route des Grands Crus traverse les célèbres côtes de Nuits et de Beaune. Ce vignoble millénaire, façonné dès l'Antiquité par les Romains, produit certains des vins les plus renommés au monde.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #6b1a2a 0%, #4a0e14 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "citadelle-besancon",
    titre: "La Citadelle de Besançon",
    description:
      "Chef-d'œuvre de Vauban classé UNESCO, la citadelle de Besançon domine la boucle du Doubs depuis le XVIIe siècle. Elle symbolise l'art fortifié français et la politique de défense des frontières de Louis XIV.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Monument",
    gradient: "linear-gradient(135deg, #4a5a6a 0%, #2a3a4a 100%)",
    readTime: "9 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Normandie
// ---------------------------------------------------------------------------
const NORMANDIE_CARDS: RegionCard[] = [
  {
    id: "guillaume-conquerant",
    titre: "Guillaume le Conquérant (1066)",
    description:
      "Duc de Normandie, Guillaume s'empare de l'Angleterre lors de la bataille de Hastings en 1066, fondant une monarchie franco-normande qui relie les deux rives de la Manche pendant des siècles.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #4a5a3a 0%, #2a3a1a 100%)",
    readTime: "13 min de lecture",
  },
  {
    id: "debarquement-1944",
    titre: "Le Débarquement de Normandie (1944)",
    description:
      "Le 6 juin 1944, Operation Overlord débarque 156 000 soldats alliés sur les plages normandes. Cette opération, la plus grande de l'histoire militaire, marque le tournant de la Seconde Guerre mondiale en Europe occidentale.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
    readTime: "20 min de lecture",
  },
  {
    id: "tapisserie-bayeux",
    titre: "La Tapisserie de Bayeux",
    description:
      "Cette broderie du XIe siècle, longue de 70 mètres, raconte la conquête de l'Angleterre par Guillaume. Document historique exceptionnel, elle est l'une des plus anciennes représentations narratives de l'histoire médiévale.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #8d6e52 0%, #5d4037 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "monet-giverny",
    titre: "Claude Monet à Giverny",
    description:
      "C'est à Giverny, dans l'Eure, que Claude Monet crée son célèbre jardin et peint ses Nymphéas entre 1883 et 1926. Ce lieu inspire l'impressionnisme tardif et attire aujourd'hui des milliers de visiteurs du monde entier.",
    epoque: "XIXe SIÈCLE",
    epoqueColor: "#253560",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #2e7d52 0%, #1a5535 100%)",
    readTime: "8 min de lecture",
  },
  {
    id: "mont-saint-michel",
    titre: "Le Mont-Saint-Michel",
    description:
      "Édifié dès le VIIIe siècle sur un îlot rocheux, le Mont-Saint-Michel est l'un des sites les plus emblématiques de France. Son abbaye bénédictine gothique et ses grèves aux marées spectaculaires en font un symbole universel.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #4a6fa5 0%, #2a4070 100%)",
    readTime: "12 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Hauts-de-France
// ---------------------------------------------------------------------------
const HDF_CARDS: RegionCard[] = [
  {
    id: "bataille-somme",
    titre: "La Bataille de la Somme (1916)",
    description:
      "Du 1er juillet au 18 novembre 1916, la bataille de la Somme fait plus d'un million de victimes. Elle symbolise l'horreur industrielle de la Première Guerre mondiale et a profondément marqué la mémoire collective britannique, canadienne et française.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
    readTime: "18 min de lecture",
  },
  {
    id: "azincourt",
    titre: "La Bataille d'Azincourt (1415)",
    description:
      "Le 25 octobre 1415, les archers anglais de Henri V écrasent la chevalerie française lors d'une des batailles les plus meurtrières de la Guerre de Cent Ans. Cette défaite précipite la crise dynastique et l'intervention de Jeanne d'Arc.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #5c4033 0%, #3e2723 100%)",
    readTime: "14 min de lecture",
  },
  {
    id: "mines-nord",
    titre: "Les Mines du Nord-Pas-de-Calais",
    description:
      "Pendant deux siècles, le bassin minier du Nord alimente la révolution industrielle française. Classé UNESCO en 2012, ce patrimoine industriel unique témoigne des conditions de vie des mineurs et de la naissance du mouvement ouvrier.",
    epoque: "XIXe SIÈCLE",
    epoqueColor: "#253560",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)",
    readTime: "15 min de lecture",
  },
  {
    id: "geants-carnaval",
    titre: "Les Géants et les Carnavals du Nord",
    description:
      "Les géants processionnels — Gayant de Douai, Reuze de Cassel — sont inscrits au patrimoine immatériel de l'UNESCO. Ces personnages mythiques, portés dans les rues lors des fêtes traditionnelles, incarnent l'identité culturelle des Hauts-de-France.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #c0785a 0%, #8b4513 100%)",
    readTime: "9 min de lecture",
  },
  {
    id: "cathedrale-amiens",
    titre: "La Cathédrale d'Amiens",
    description:
      "Plus grande cathédrale gothique de France par son volume, Notre-Dame d'Amiens est classée UNESCO. Construite au XIIIe siècle, elle est un chef-d'œuvre du gothique rayonnant, avec sa façade ornée de plus de 4 000 statues.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #4a6fa5 0%, #2a4070 100%)",
    readTime: "10 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Grand Est
// ---------------------------------------------------------------------------
const GE_CARDS: RegionCard[] = [
  {
    id: "strasbourg-europe",
    titre: "Strasbourg, capitale de l'Europe",
    description:
      "Capitale du Conseil de l'Europe et siège du Parlement européen, Strasbourg symbolise la réconciliation franco-allemande après trois guerres en 70 ans. Sa Grande-Île classée UNESCO réunit harmonieusement les patrimoines français et alsacien.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #2c5f7a 0%, #1a3a55 100%)",
    readTime: "12 min de lecture",
  },
  {
    id: "ligne-maginot",
    titre: "La Ligne Maginot",
    description:
      "Construite entre 1929 et 1936, la ligne Maginot est un complexe de fortifications s'étendant sur 400 km le long de la frontière franco-allemande. Contournée en 1940 par les Ardennes, elle reste le symbole d'une stratégie défensive dépassée.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)",
    readTime: "16 min de lecture",
  },
  {
    id: "cathedrale-reims",
    titre: "La Cathédrale de Reims, le sacre des rois",
    description:
      "Lieu du sacre de 33 rois de France depuis le Ve siècle, la cathédrale de Reims est au cœur de la légitimité monarchique française. Sa façade sculptée, avec 2 300 statues, est le summum de l'art gothique du XIIIe siècle.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #c0c0a0 0%, #8a8a60 100%)",
    readTime: "13 min de lecture",
  },
  {
    id: "alsace-allemande",
    titre: "L'Alsace entre France et Allemagne",
    description:
      "Annexée par l'Empire allemand en 1871 après la guerre franco-prussienne, puis restituée en 1918, l'Alsace connaît une double appartenance culturelle unique. Strasbourg et Metz changent trois fois de nationalité en moins d'un siècle.",
    epoque: "XIXe SIÈCLE",
    epoqueColor: "#253560",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #5a3a2a 0%, #3a1a0a 100%)",
    readTime: "15 min de lecture",
  },
  {
    id: "lorraine-jeanne",
    titre: "La Lorraine de Jeanne d'Arc",
    description:
      "Née à Domrémy en 1412, Jeanne d'Arc grandit dans cette région frontalière déchirée par la Guerre de Cent Ans. La Lorraine, marquée par des siècles de conflits franco-germains, a forgé l'une des figures les plus mythiques de l'histoire de France.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #d4a843 0%, #8b6914 100%)",
    readTime: "11 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Pays de la Loire
// ---------------------------------------------------------------------------
const PDL_CARDS: RegionCard[] = [
  {
    id: "chateau-ducs-bretagne",
    titre: "Le Château des Ducs de Bretagne",
    description:
      "Forteresse médiévale au cœur de Nantes, le château des Ducs de Bretagne fut la résidence des derniers ducs bretons avant l'union avec la France. C'est ici qu'Anne de Bretagne naquit et que l'Édit de Nantes fut signé en 1598.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #4a5a6a 0%, #2a3a4a 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "guerre-vendee",
    titre: "La Guerre de Vendée (1793-1796)",
    description:
      "Contre-révolution paysanne et catholique, la Guerre de Vendée oppose les « Blancs » à l'armée républicaine. Les colonnes infernales de Turreau et les massacres qui s'ensuivent font l'objet d'un débat historiographique encore vif aujourd'hui.",
    epoque: "RÉVOLUTION",
    epoqueColor: "#5a1820",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #7b1f1f 0%, #4a0e0e 100%)",
    readTime: "19 min de lecture",
  },
  {
    id: "jules-verne-nantes",
    titre: "Jules Verne, l'enfant de Nantes",
    description:
      "Né à Nantes en 1828, Jules Verne invente avec ses Voyages extraordinaires la science-fiction moderne. Son imaginaire, nourri par les quais de la Loire et les grandes découvertes scientifiques de son siècle, fascine encore des générations de lecteurs.",
    epoque: "XIXe SIÈCLE",
    epoqueColor: "#253560",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #2c6e8a 0%, #1a4a60 100%)",
    readTime: "10 min de lecture",
  },
  {
    id: "commerce-triangulaire-nantes",
    titre: "Nantes et le Commerce Triangulaire",
    description:
      "Premier port négrier français au XVIIIe siècle, Nantes finança 43 % de la traite française. La ville, enrichie par ce commerce inhumain, présente aujourd'hui un mémorial exceptionnel qui confronte lucidement son passé esclavagiste.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #4a3a1a 0%, #2a1a0a 100%)",
    readTime: "17 min de lecture",
  },
  {
    id: "edit-nantes",
    titre: "L'Édit de Nantes (1598)",
    description:
      "Signé par Henri IV au château de Nantes, l'Édit de Nantes met fin aux guerres de Religion en accordant aux protestants la liberté de culte et des garanties politiques. Sa révocation par Louis XIV en 1685 provoque l'exil de 200 000 huguenots.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #8fac6e 0%, #4a7a2a 100%)",
    readTime: "13 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Bretagne
// ---------------------------------------------------------------------------
const BRETAGNE_CARDS: RegionCard[] = [
  {
    id: "megalithes-carnac",
    titre: "Les Mégalithes de Carnac",
    description:
      "Alignement de 3 000 menhirs érigés entre 4 500 et 2 000 avant J.-C., Carnac est le plus grand ensemble mégalithique au monde. Ces pierres dressées par les populations néolithiques restent une énigme archéologique fascinante.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Monument",
    gradient: "linear-gradient(135deg, #b08850 0%, #7a5c2e 100%)",
    readTime: "12 min de lecture",
  },
  {
    id: "corsaires-saint-malo",
    titre: "Les Corsaires de Saint-Malo",
    description:
      "Sous lettres de marque du roi, les corsaires malouins — René Duguay-Trouin, Robert Surcouf — pillent le commerce maritime ennemi au nom de la France. Saint-Malo devient l'une des villes les plus riches du XVIIe siècle.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #1a4a6a 0%, #0a2a4a 100%)",
    readTime: "13 min de lecture",
  },
  {
    id: "anne-de-bretagne",
    titre: "Anne de Bretagne, duchesse et reine",
    description:
      "Deux fois reine de France — épouse de Charles VIII puis de Louis XII — Anne de Bretagne incarne la résistance de l'identité bretonne face à l'annexion. Son mariage politique en 1491 scelle définitivement l'union de la Bretagne à la France.",
    epoque: "RENAISSANCE",
    epoqueColor: "#2E5339",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #5a7a9a 0%, #3a5a7a 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "resistance-bretonne",
    titre: "La Résistance bretonne (1940-1944)",
    description:
      "Dès juin 1940, des Bretons rejoignent de Gaulle à Londres — les premiers Français libres. Le mouvement Libération-Nord et les réseaux Shelburn permettent l'évasion de centaines d'aviateurs alliés par les côtes sauvages du Finistère.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
    readTime: "15 min de lecture",
  },
  {
    id: "langue-bretonne",
    titre: "La Langue Bretonne, héritage celtique",
    description:
      "Seule langue celtique parlée sur le continent européen, le breton fut longtemps interdit à l'école. Aujourd'hui en voie de revitalisation grâce aux écoles Diwan, il est le symbole vivant d'une identité culturelle unique en France.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #4a6050 0%, #2a4030 100%)",
    readTime: "10 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Nouvelle-Aquitaine
// ---------------------------------------------------------------------------
const NA_CARDS: RegionCard[] = [
  {
    id: "lascaux",
    titre: "Lascaux, la préhistoire en Périgord",
    description:
      "Découverte en 1940, la grotte de Lascaux abrite 1 900 représentations d'animaux vieilles de 17 000 ans. Surnommée la « Chapelle Sixtine de la préhistoire », elle révèle une maîtrise artistique extraordinaire des hommes du Paléolithique.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Monument",
    gradient: "linear-gradient(135deg, #8d5a2a 0%, #5a3510 100%)",
    readTime: "13 min de lecture",
  },
  {
    id: "alienor-aquitaine",
    titre: "Aliénor d'Aquitaine, reine des deux royaumes",
    description:
      "Duchesse d'Aquitaine, reine de France puis d'Angleterre, Aliénor (1122-1204) est l'une des femmes les plus puissantes du Moyen Âge. Son mariage avec Henri Plantagenêt crée un empire allant de l'Écosse aux Pyrénées.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #8d6e52 0%, #5d4037 100%)",
    readTime: "14 min de lecture",
  },
  {
    id: "bordeaux-commerce-vin",
    titre: "Bordeaux et le commerce du vin",
    description:
      "Grâce au mariage d'Aliénor, Bordeaux devient le principal port d'exportation du vin vers l'Angleterre. Pendant trois siècles, la Guyenne anglaise s'enrichit de ce commerce vinicole qui fait de Bordeaux la capitale mondiale des grands crus.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #6b1a2a 0%, #4a0e14 100%)",
    readTime: "12 min de lecture",
  },
  {
    id: "pays-basque",
    titre: "Le Pays Basque, identité et culture",
    description:
      "Peuple d'origine mystérieuse parlant la seule langue non indo-européenne d'Europe occidentale, les Basques revendiquent une identité culturelle forte. La pelote basque, l'architecture traditionnelle et les fêtes de Bayonne en sont les symboles vivants.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #2c6e3a 0%, #1a4a25 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "montaigne-renaissance",
    titre: "Montaigne et la Renaissance bordelaise",
    description:
      "Maire de Bordeaux et philosophe, Michel de Montaigne invente les « Essais » dans sa tour du Périgord. Cette forme littéraire nouvelle, fondée sur l'introspection et le doute, fait de lui l'un des pères de l'humanisme moderne.",
    epoque: "RENAISSANCE",
    epoqueColor: "#2E5339",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #4a7a6a 0%, #2a5a4a 100%)",
    readTime: "10 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Occitanie (données existantes conservées)
// ---------------------------------------------------------------------------
const OCCITANIE_CARDS: RegionCard[] = [
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

// ---------------------------------------------------------------------------
// Auvergne-Rhône-Alpes
// ---------------------------------------------------------------------------
const ARA_CARDS: RegionCard[] = [
  {
    id: "lyon-capitale-gaules",
    titre: "Lyon, capitale des Gaules",
    description:
      "Fondée en 43 avant J.-C. sous le nom de Lugdunum, Lyon est la première capitale des Gaules romaines. Ses vestiges antiques — amphithéâtre, musée gallo-romain — témoignent d'une cité qui rayonnait sur tout l'Occident.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #b08850 0%, #7a5c2e 100%)",
    readTime: "14 min de lecture",
  },
  {
    id: "volcans-auvergne",
    titre: "Les Volcans d'Auvergne",
    description:
      "La chaîne des Puys, inscrite au patrimoine mondial de l'UNESCO, aligne 80 volcans éteints dont le puy de Dôme (1 465 m). Cette géologie exceptionnelle a façonné les paysages, les eaux thermales et les traditions de l'Auvergne depuis des millénaires.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Document éducatif",
    gradient: "linear-gradient(135deg, #6b3a1a 0%, #4a2010 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "resistance-lyonnaise",
    titre: "Lyon, capitale de la Résistance",
    description:
      "Surnommée la capitale de la Résistance, Lyon abrita Jean Moulin, coordinateur des mouvements de résistance pour le général de Gaulle. Arrêté en 1943 par Klaus Barbie, il devient le martyr emblématique de la France libre.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
    readTime: "16 min de lecture",
  },
  {
    id: "canuts-lyon",
    titre: "Les Canuts de Lyon, révolte des tisserands",
    description:
      "En 1831 et 1834, les ouvriers en soie lyonnais — les canuts — se soulèvent pour de meilleures conditions de travail. Ces révoltes précèdent le mouvement ouvrier européen et font de Lyon le berceau du syndicalisme français.",
    epoque: "XIXe SIÈCLE",
    epoqueColor: "#253560",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #5a3a6a 0%, #3a1a4a 100%)",
    readTime: "13 min de lecture",
  },
  {
    id: "hannibal-alpes",
    titre: "Hannibal traverse les Alpes (218 av. J.-C.)",
    description:
      "En 218 avant J.-C., le général carthaginois Hannibal franchit les Alpes avec 37 éléphants de guerre pour attaquer Rome par le nord. Cet exploit militaire légendaire reste l'un des passages les plus audacieux de l'histoire militaire antique.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #4a6080 0%, #2a4060 100%)",
    readTime: "12 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Provence-Alpes-Côte d'Azur (PACA)
// ---------------------------------------------------------------------------
const PACA_CARDS: RegionCard[] = [
  {
    id: "massalia-marseille",
    titre: "Massalia, la cité grecque (600 av. J.-C.)",
    description:
      "Fondée vers 600 avant J.-C. par des colons grecs de Phocée, Massalia est l'une des plus anciennes villes de France. Ce comptoir méditerranéen introduit la vigne, l'olivier et l'écriture en Gaule du Sud, façonnant durablement la Provence.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #4a7a8a 0%, #2a5a6a 100%)",
    readTime: "13 min de lecture",
  },
  {
    id: "papes-avignon",
    titre: "Les Papes d'Avignon (1309-1377)",
    description:
      "Pendant 70 ans, la papauté quitte Rome pour Avignon. Sept papes successifs y résident, transformant la ville en capitale de la chrétienté occidentale. Le Palais des Papes, forteresse et palais gothique, reste le plus grand édifice médiéval du monde.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #d4a843 0%, #8b6914 100%)",
    readTime: "15 min de lecture",
  },
  {
    id: "baux-de-provence",
    titre: "Les Baux-de-Provence, seigneurs redoutés",
    description:
      "Perché sur les Alpilles, le château des Baux domine la Provence depuis le Xe siècle. Les seigneurs des Baux, célèbres pour leur cour courtoise et leur brutalité guerrière, régnèrent sur 79 villes à leur apogée.",
    epoque: "MOYEN-ÂGE",
    epoqueColor: "#6B4F2A",
    type: "Monument",
    gradient: "linear-gradient(135deg, #8a7a5a 0%, #5a5a3a 100%)",
    readTime: "9 min de lecture",
  },
  {
    id: "van-gogh-provence",
    titre: "Van Gogh en Provence",
    description:
      "Entre 1888 et 1889, Vincent van Gogh séjourne à Arles puis à Saint-Rémy-de-Provence. C'est ici qu'il peint ses œuvres les plus célèbres — La Nuit étoilée, Les Tournesols — dans une lumière méditerranéenne qui transforme sa palette.",
    epoque: "XIXe SIÈCLE",
    epoqueColor: "#253560",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #c0a020 0%, #8a7010 100%)",
    readTime: "10 min de lecture",
  },
  {
    id: "chateau-if",
    titre: "Le Château d'If, prison légendaire",
    description:
      "Forteresse royale érigée par François Ier en 1524 sur un îlot au large de Marseille, le château d'If devient tristement célèbre comme prison d'État. Alexandre Dumas le rend immortel en y plaçant l'emprisonnement d'Edmond Dantès dans Le Comte de Monte-Cristo.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Monument",
    gradient: "linear-gradient(135deg, #3a5a7a 0%, #1a3a5a 100%)",
    readTime: "8 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Corse
// ---------------------------------------------------------------------------
const CORSE_CARDS: RegionCard[] = [
  {
    id: "napoleon-corse",
    titre: "Napoléon Bonaparte, enfant de Corse",
    description:
      "Né à Ajaccio le 15 août 1769, un an après le rattachement de la Corse à la France, Napoléon Bonaparte va dominer l'Europe pendant deux décennies. Issu d'une famille de petite noblesse corse, il reste le fils le plus célèbre de l'île de Beauté.",
    epoque: "RÉVOLUTION",
    epoqueColor: "#5a1820",
    type: "Fiche thématique",
    gradient: "linear-gradient(135deg, #1a3a5a 0%, #0a1a3a 100%)",
    readTime: "16 min de lecture",
  },
  {
    id: "citadelles-genoises",
    titre: "Les Citadelles génoises de Corse",
    description:
      "Pendant plus de trois siècles (1284-1768), la République de Gênes domine la Corse. Elle laisse un réseau exceptionnel de tours de guet et de citadelles — Calvi, Bonifacio, Bastia — qui ponctuent encore tous les caps de l'île.",
    epoque: "RENAISSANCE",
    epoqueColor: "#2E5339",
    type: "Monument",
    gradient: "linear-gradient(135deg, #5a7a5a 0%, #3a5a3a 100%)",
    readTime: "11 min de lecture",
  },
  {
    id: "annexion-france-1768",
    titre: "L'Annexion de la Corse à la France (1768)",
    description:
      "Par le traité de Versailles de 1768, Gênes cède ses droits sur la Corse à Louis XV. Pascal Paoli, chef des patriotes corses, résiste une dernière fois à Ponte-Novo avant l'occupation française. La Corse devient française un an avant la naissance de Napoléon.",
    epoque: "ANCIEN RÉGIME",
    epoqueColor: "#1a3f4a",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #2c5f7a 0%, #1a3a55 100%)",
    readTime: "12 min de lecture",
  },
  {
    id: "resistance-corse-1943",
    titre: "La Libération de la Corse (1943)",
    description:
      "En septembre 1943, la Corse devient le premier département français libéré, grâce à la résistance locale et au débarquement des Forces françaises libres. Cette libération précède celle du continent de plus d'un an et forge l'identité résistante de l'île.",
    epoque: "CONTEMPORAINE",
    epoqueColor: "#2d2d2d",
    type: "Chronologie",
    gradient: "linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)",
    readTime: "14 min de lecture",
  },
  {
    id: "filitosa",
    titre: "Filitosa, la préhistoire corse",
    description:
      "Site mégalithique majeur du Bassin méditerranéen, Filitosa abrite des statues-menhirs guerrières vieilles de 3 000 ans. Ces figures humaines sculptées témoignent d'une civilisation préhistorique unique propre à la Méditerranée occidentale.",
    epoque: "ANTIQUITÉ",
    epoqueColor: "#4A3728",
    type: "Monument",
    gradient: "linear-gradient(135deg, #8a7a5a 0%, #5a5a3a 100%)",
    readTime: "9 min de lecture",
  },
];

// ---------------------------------------------------------------------------
// Helper : crée les catégories standard pour une région
// ---------------------------------------------------------------------------
function makeCategories(
  regionNom: string,
  patrimoineCards: RegionCard[],
): RegionCategorie[] {
  return [
    {
      id: "patrimoine-histoire",
      label: "Patrimoine & Histoire",
      subtitle: `Monuments, événements et figures qui ont façonné ${regionNom}`,
      cards: patrimoineCards,
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
    categories: makeCategories("l'Île-de-France", IDF_CARDS),
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
    categories: makeCategories("le Centre-Val de Loire", CVL_CARDS),
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
    categories: makeCategories("la Bourgogne-Franche-Comté", BFC_CARDS),
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
    categories: makeCategories("la Normandie", NORMANDIE_CARDS),
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
    categories: makeCategories("les Hauts-de-France", HDF_CARDS),
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
    categories: makeCategories("le Grand Est", GE_CARDS),
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
    categories: makeCategories("les Pays de la Loire", PDL_CARDS),
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
    categories: makeCategories("la Bretagne", BRETAGNE_CARDS),
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
    categories: makeCategories("la Nouvelle-Aquitaine", NA_CARDS),
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
    categories: makeCategories("l'Occitanie", OCCITANIE_CARDS),
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
    categories: makeCategories("l'Auvergne-Rhône-Alpes", ARA_CARDS),
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
    categories: makeCategories("la Provence-Alpes-Côte d'Azur", PACA_CARDS),
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
    categories: makeCategories("la Corse", CORSE_CARDS),
  },
};
