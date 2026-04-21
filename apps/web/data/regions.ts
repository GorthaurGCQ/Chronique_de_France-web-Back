export type Region = {
  id: string;
  code: string;
  nom: string;
  chefLieu: string;
  nbDepartements: number;
  couleur: string;
  emblemeUrl: string;
  description: string;
};

export const REGIONS: Region[] = [
  {
    id: "ile-de-france",
    code: "11",
    nom: "Île-de-France",
    chefLieu: "Paris",
    nbDepartements: 8,
    couleur: "#7B9ED9",
    emblemeUrl: "/emblemes/ile-de-france.svg",
    description: "Cœur politique et culturel de la France, l'Île-de-France abrite Versailles, le Louvre et des siècles d'histoire royale.",
  },
  {
    id: "centre-val-de-loire",
    code: "24",
    nom: "Centre-Val de Loire",
    chefLieu: "Orléans",
    nbDepartements: 6,
    couleur: "#F7DC6F",
    emblemeUrl: "/emblemes/centre-val-de-loire.svg",
    description: "La « Vallée des Rois » avec ses châteaux de la Renaissance — Chambord, Chenonceau, Amboise — témoins du faste de la cour de France.",
  },
  {
    id: "bourgogne-franche-comte",
    code: "27",
    nom: "Bourgogne-Franche-Comté",
    chefLieu: "Dijon",
    nbDepartements: 8,
    couleur: "#F1948A",
    emblemeUrl: "/emblemes/bourgogne-franche-comte.svg",
    description: "Terre de ducs puissants et de vignobles légendaires, la Bourgogne a façonné la culture et la gastronomie françaises depuis le Moyen Âge.",
  },
  {
    id: "normandie",
    code: "28",
    nom: "Normandie",
    chefLieu: "Rouen",
    nbDepartements: 5,
    couleur: "#76D7C4",
    emblemeUrl: "/emblemes/normandie.svg",
    description: "Des Vikings aux plages du Débarquement, la Normandie porte mille ans d'histoire maritime et militaire, entre cathédrales gothiques et falaises calcaires.",
  },
  {
    id: "hauts-de-france",
    code: "32",
    nom: "Hauts-de-France",
    chefLieu: "Lille",
    nbDepartements: 5,
    couleur: "#85C1E9",
    emblemeUrl: "/emblemes/hauts-de-france.svg",
    description: "Carrefour de l'Europe du Nord, cette région a été le théâtre de batailles décisives et d'une riche culture textile et industrielle.",
  },
  {
    id: "grand-est",
    code: "44",
    nom: "Grand Est",
    chefLieu: "Strasbourg",
    nbDepartements: 10,
    couleur: "#BB8FCE",
    emblemeUrl: "/emblemes/grand-est.svg",
    description: "L'Alsace, la Champagne et la Lorraine forment un creuset où se mêlent influences françaises et germaniques depuis des siècles.",
  },
  {
    id: "pays-de-la-loire",
    code: "52",
    nom: "Pays de la Loire",
    chefLieu: "Nantes",
    nbDepartements: 5,
    couleur: "#82E0AA",
    emblemeUrl: "/emblemes/pays-de-la-loire.svg",
    description: "Entre Loire royale et Atlantique, cette région abrite un patrimoine Renaissance exceptionnel et une tradition maritime ancestrale.",
  },
  {
    id: "bretagne",
    code: "53",
    nom: "Bretagne",
    chefLieu: "Rennes",
    nbDepartements: 4,
    couleur: "#85929E",
    emblemeUrl: "/emblemes/bretagne.svg",
    description: "Terre celtique aux menhirs millénaires et aux pardons colorés, la Bretagne conserve une identité culturelle et linguistique unique en France.",
  },
  {
    id: "nouvelle-aquitaine",
    code: "75",
    nom: "Nouvelle-Aquitaine",
    chefLieu: "Bordeaux",
    nbDepartements: 12,
    couleur: "#7EC8A0",
    emblemeUrl: "/emblemes/nouvelle-aquitaine.svg",
    description: "La plus grande région de France, des vignes de Bordeaux aux falaises du Pays basque, riche d'une préhistoire exceptionnelle à Lascaux.",
  },
  {
    id: "occitanie",
    code: "76",
    nom: "Occitanie",
    chefLieu: "Toulouse",
    nbDepartements: 13,
    couleur: "#C8A07E",
    emblemeUrl: "/emblemes/occitanie.svg",
    description: "Langue d'oc, cathares, troubadours — l'Occitanie est une civilisation à part entière, marquée par ses châteaux médiévaux et la mer Méditerranée.",
  },
  {
    id: "auvergne-rhone-alpes",
    code: "84",
    nom: "Auvergne-Rhône-Alpes",
    chefLieu: "Lyon",
    nbDepartements: 12,
    couleur: "#F4A460",
    emblemeUrl: "/emblemes/auvergne-rhone-alpes.svg",
    description: "Des volcans d'Auvergne aux Alpes majestueuses, cette région unit nature grandiose et cités antiques comme Lyon, ancienne capitale des Gaules.",
  },
  {
    id: "paca",
    code: "93",
    nom: "Provence-Alpes-Côte d'Azur",
    chefLieu: "Marseille",
    nbDepartements: 6,
    couleur: "#FDEBD0",
    emblemeUrl: "/emblemes/paca.svg",
    description: "Lumière méditerranéenne, lavandes de Haute-Provence, cités romaines — la Provence a inspiré peintres, poètes et philosophes depuis l'Antiquité.",
  },
  {
    id: "corse",
    code: "94",
    nom: "Corse",
    chefLieu: "Ajaccio",
    nbDepartements: 2,
    couleur: "#F1948A",
    emblemeUrl: "/emblemes/corse.svg",
    description: "Île de Beauté, berceau de Napoléon Bonaparte, la Corse offre un patrimoine naturel et culturel unique entre maquis odorant et citadelles génoises.",
  },
];

export function getRegionByCode(code: string): Region | undefined {
  return REGIONS.find((r) => r.code === code);
}
