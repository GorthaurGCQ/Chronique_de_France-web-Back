/**
 * Generates TypeScript data files for historical territories.
 * Uses the same Mercator projection as generate-svg-paths.mjs.
 * Run: node scripts/generate-territoire-paths.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data", "territoires");
mkdirSync(OUT, { recursive: true });

// ── Projection (identical to generate-svg-paths.mjs) ──────────────────────
const W = 600, H = 680, SCALE = 2300;
const LON_C_RAD = (2.5 * Math.PI) / 180;
const mercY = lat => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
const Y_C = mercY(46.5);
const proj = ([lon, lat]) => {
  const x = ((lon * Math.PI / 180) - LON_C_RAD) * SCALE + W / 2;
  const y = H / 2 - (mercY(lat) - Y_C) * SCALE;
  return [x, y];
};
const toPath = coords => {
  const pts = coords.map(proj);
  return "M " + pts[0].map(v => v.toFixed(2)).join(" ") +
    " " + pts.slice(1).map(p => "L " + p.map(v => v.toFixed(2)).join(" ")).join(" ") + " Z";
};

// ── Territory raw data (geographic polygons [lon, lat]) ───────────────────

const ANTIQUITE = [
  {
    id: "gallia-belgica", nom: "Gallia Belgica",
    couleur: "#E8A87C", seigneur: "Empire romain",
    dateDebut: -27, dateFin: 400,
    description: "Province septentrionale couvrant le nord de la France actuelle, la Belgique et le Luxembourg. Chef-lieu : Reims (Durocortorum).",
    coords: [[-2,51.1],[2.5,51.1],[5,51],[8.5,51],[8.5,48],[7.5,47.5],[5.5,47.5],[4,47.8],[2,48.5],[0,49],[-1,49.5],[-2,51.1]]
  },
  {
    id: "gallia-lugdunensis", nom: "Gallia Lugdunensis",
    couleur: "#D4956A", seigneur: "Empire romain",
    dateDebut: -27, dateFin: 400,
    description: "Province centrale et occidentale incluant Bretagne, Normandie et la vallée de la Loire. Chef-lieu : Lyon (Lugdunum).",
    coords: [[-5.1,48.7],[-2,51.1],[-1,49.5],[0,49],[2,48.5],[4,47.8],[5.5,47.5],[5.5,46.5],[4,45.5],[2,45.8],[0,45.8],[-1.5,46],[-3,46.5],[-4.5,47.5],[-5.1,48.7]]
  },
  {
    id: "gallia-aquitania", nom: "Gallia Aquitania",
    couleur: "#C47B50", seigneur: "Empire romain",
    dateDebut: -27, dateFin: 400,
    description: "Province méridionale et atlantique. Couvre le sud-ouest de la Gaule de la Loire aux Pyrénées. Chef-lieu : Bordeaux (Burdigala).",
    coords: [[-5.1,48.7],[-4.5,47.5],[-3,46.5],[-1.5,46],[0,45.8],[2,45.8],[4,45.5],[3.5,44.5],[2,43.3],[0,43],[-2,43.5],[-4,43.5],[-5.1,43.5],[-5.1,48.7]]
  },
  {
    id: "gallia-narbonensis", nom: "Gallia Narbonensis",
    couleur: "#B05A30", seigneur: "Empire romain",
    dateDebut: -120, dateFin: 400,
    description: "La plus ancienne province romaine de Gaule (« Nostra Provincia »). Côte méditerranéenne et couloir rhodanien. Chef-lieu : Narbonne (Narbo Martius).",
    coords: [[3.5,45.5],[5.5,46.5],[5.5,47.5],[7.5,47.5],[8.5,48],[8.5,43.5],[7.5,43],[5,43],[3.5,43.5],[3,44],[3.5,45.5]]
  },
  {
    id: "corse-romaine", nom: "Corsica",
    couleur: "#A04820", seigneur: "Empire romain",
    dateDebut: -238, dateFin: 400,
    description: "Île conquise par Rome en 238 av. J.-C., administrée conjointement avec la Sardaigne.",
    coords: [[8.6,43.1],[9.6,43],[9.6,42],[9.5,41.4],[8.8,41.3],[8.5,42],[8.6,43.1]]
  }
];

const MOYEN_AGE = [
  {
    id: "flandre", nom: "Comté de Flandre",
    couleur: "#FFD700", seigneur: "Baudouin IX de Flandre",
    dateDebut: 862, dateFin: 1477,
    description: "Puissant comté du nord, vassal du roi de France mais allié des rois d'Angleterre. Richesse textile et commerciale.",
    coords: [[-2,51.1],[5,51.1],[5.5,50.3],[4.5,50],[3.5,49.5],[2,49.5],[0.5,49.8],[-1,49.5],[-2,51.1]]
  },
  {
    id: "normandie-med", nom: "Duché de Normandie",
    couleur: "#FFD700", seigneur: "Plantagenêts (puis France en 1204)",
    dateDebut: 911, dateFin: 1204,
    description: "Fondé par le Viking Rollon (911), le duché passe aux Plantagenêts en 1150. Philippe Auguste le conquiert en 1204.",
    coords: [[-2,50.5],[0.5,49.8],[2,49.5],[3.5,49.5],[2.5,48.5],[1,48.5],[0,48.7],[-1.5,48.5],[-2,49.5],[-2,50.5]]
  },
  {
    id: "domaine-royal", nom: "Domaine royal capétien",
    couleur: "#4169E1", seigneur: "Philippe Auguste (1180-1223)",
    dateDebut: 987, dateFin: 1789,
    description: "Territoire sous contrôle direct du roi de France. Très restreint en 1180 (Paris, Orléans, Senlis), il s'agrandit considérablement sous Philippe Auguste.",
    coords: [[-0.5,49.2],[2,49.5],[3.5,49],[3.5,48.5],[2.5,47.5],[1,47.5],[0,48],[0,49],[-0.5,49.2]]
  },
  {
    id: "champagne", nom: "Comté de Champagne",
    couleur: "#9370DB", seigneur: "Thibaut III de Champagne",
    dateDebut: 950, dateFin: 1284,
    description: "Comté prospère grâce aux foires de Champagne, carrefour du commerce médiéval européen. Réuni au domaine royal en 1284.",
    coords: [[3.5,49],[5.5,49.5],[6.5,49],[7,48],[6,47.5],[5,47.5],[3.5,48.5],[3.5,49]]
  },
  {
    id: "bretagne-med", nom: "Duché de Bretagne",
    couleur: "#228B22", seigneur: "Arthur Ier de Bretagne",
    dateDebut: 939, dateFin: 1532,
    description: "Duché autonome préservant sa langue et ses traditions celtiques. Définitivement uni à la France en 1532.",
    coords: [[-5.1,48.7],[-2,49.5],[-1.5,48.5],[0,47.2],[-1,47],[-2.5,47],[-4,47.5],[-5.1,47.5],[-5.1,48.7]]
  },
  {
    id: "anjou-maine", nom: "Anjou, Maine & Touraine",
    couleur: "#DC143C", seigneur: "Plantagenêts (possession anglaise)",
    dateDebut: 1154, dateFin: 1204,
    description: "Territoires continentaux des rois d'Angleterre (maison Plantagenêt), conquis par Philippe Auguste en 1204-1205.",
    coords: [[-2,49.5],[-1.5,48.5],[0,47.2],[1,47.5],[1.5,47],[0,46.5],[-1.5,46.5],[-2,47.5],[-3,48],[-2,49.5]]
  },
  {
    id: "bourgogne-med", nom: "Duché de Bourgogne",
    couleur: "#8B0000", seigneur: "Eudes III de Bourgogne",
    dateDebut: 880, dateFin: 1477,
    description: "Grand duché vassal, foyer d'art roman et cistercien. Les Ducs de Bourgogne rivalisèrent avec le roi de France au XVe siècle.",
    coords: [[3.5,48.5],[5,47.5],[5.5,47],[6,47.5],[5.5,45.5],[4.5,45.5],[3.5,46],[3,47.5],[3.5,48.5]]
  },
  {
    id: "aquitaine-ang", nom: "Duché d'Aquitaine",
    couleur: "#CD5C5C", seigneur: "Richard Cœur de Lion / roi d'Angleterre",
    dateDebut: 1152, dateFin: 1453,
    description: "Apporté à Henri II par son mariage avec Aliénor d'Aquitaine (1152). Possession anglaise disputée pendant la guerre de Cent Ans.",
    coords: [[-2,47.5],[-1.5,46.5],[0,46.5],[1.5,47],[2,46],[1,45],[0,44.5],[-1.5,44],[-3,44.5],[-4,46],[-3,47],[-2,47.5]]
  },
  {
    id: "toulouse-med", nom: "Comté de Toulouse",
    couleur: "#DAA520", seigneur: "Raymond VII de Toulouse",
    dateDebut: 852, dateFin: 1271,
    description: "Grand comté méridional, centre de la civilisation occitane et du catharisme. Affaibli par la croisade des Albigeois (1209-1229).",
    coords: [[1.5,47],[2,46],[3.5,46],[5.5,45.5],[4.5,43.5],[3,43.5],[2,43.5],[0,43.5],[0,44.5],[1,45],[1.5,47]]
  },
  {
    id: "gascogne", nom: "Duché de Gascogne",
    couleur: "#C08040", seigneur: "Ducs de Guyenne / roi d'Angleterre",
    dateDebut: 602, dateFin: 1453,
    description: "Territoire pyrénéen à l'identité gasconne distincte, uni à l'Aquitaine puis possession anglaise pendant la guerre de Cent Ans.",
    coords: [[-5.1,46],[-4,46],[-3,44.5],[-1.5,44],[0,44.5],[0,43.5],[-2,43.5],[-4,43.5],[-5.1,43.5],[-5.1,46]]
  },
  {
    id: "lorraine-empire", nom: "Lorraine & Alsace (Empire)",
    couleur: "#808080", seigneur: "Saint-Empire romain germanique",
    dateDebut: 925, dateFin: 1766,
    description: "Territoires relevant du Saint-Empire romain germanique, hors de la suzeraineté du roi de France jusqu'aux traités de Westphalie (1648).",
    coords: [[6.5,49],[8.5,51],[8.5,47.5],[6,47.5],[6,47],[6,47.5],[5,47.5],[5.5,47],[6,47.5],[7,48],[6.5,49]]
  },
  {
    id: "provence-med", nom: "Comté de Provence",
    couleur: "#FF8C00", seigneur: "Maison de Barcelone puis d'Anjou",
    dateDebut: 879, dateFin: 1481,
    description: "Comté rattaché aux rois de France en 1481 sous Louis XI, apporté par le testament de Charles du Maine.",
    coords: [[5.5,45.5],[7,47.5],[8.5,47.5],[8.5,43.5],[7.5,43],[5,43],[4.5,43.5],[5.5,45.5]]
  },
  {
    id: "corse-gene", nom: "Corse",
    couleur: "#A08060", seigneur: "Gênes (puis France 1768)",
    dateDebut: 1347, dateFin: 1768,
    description: "Sous domination génoise depuis le XIVe siècle, la Corse est cédée à la France en 1768, un an avant la naissance de Napoléon Bonaparte.",
    coords: [[8.6,43.1],[9.6,43],[9.6,42],[9.5,41.4],[8.8,41.3],[8.5,42],[8.6,43.1]]
  }
];

const RENAISSANCE = [
  {
    id: "gouv-nord", nom: "Gouvernement de Picardie & Flandre",
    couleur: "#4682B4", seigneur: "Gouverneur royal",
    dateDebut: 1492, dateFin: 1610,
    description: "Frontière septentrionale stratégique face aux Habsbourg des Pays-Bas. Zone de conflits récurrents.",
    coords: [[-2,51.1],[5.5,51.1],[6.5,50],[5,49],[3.5,49],[2,49.5],[0.5,50],[-1,49.5],[-2,51.1]]
  },
  {
    id: "gouv-normandie", nom: "Gouvernement de Normandie",
    couleur: "#5F9EA0", seigneur: "Gouverneur royal",
    dateDebut: 1204, dateFin: 1790,
    description: "Province royale après la conquête de Philippe Auguste. Importante pour le commerce maritime et la production textile.",
    coords: [[-2,50.5],[0.5,50],[2,49.5],[3.5,49],[2.5,48.5],[0,48.5],[-1.5,48.5],[-2,49.5],[-2,50.5]]
  },
  {
    id: "gouv-bretagne", nom: "Gouvernement de Bretagne",
    couleur: "#2E8B57", seigneur: "Gouverneur royal",
    dateDebut: 1532, dateFin: 1790,
    description: "Unie à la France par le traité de 1532, la Bretagne conserve ses privilèges (États de Bretagne) jusqu'à la Révolution.",
    coords: [[-5.1,48.7],[-2,49.5],[-1.5,48.5],[-0.5,47],[0,47.2],[-1,47],[-2.5,47],[-4,47.5],[-5.1,47.5],[-5.1,48.7]]
  },
  {
    id: "gouv-ile-de-france", nom: "Île-de-France & Centre",
    couleur: "#1E3A6E", seigneur: "Gouverneur royal",
    dateDebut: 987, dateFin: 1790,
    description: "Cœur du domaine royal. Paris, Orléans et la vallée de la Loire concentrent le pouvoir royal et la vie de cour.",
    coords: [[-0.5,49.2],[2,49.5],[3.5,49],[3.5,48.5],[2.5,47.5],[1,47],[0,46.5],[-0.5,47],[0,47.2],[0,48.5],[-0.5,49.2]]
  },
  {
    id: "gouv-champagne", nom: "Champagne, Lorraine & Alsace",
    couleur: "#7B4EA0", seigneur: "Gouverneur royal",
    dateDebut: 1284, dateFin: 1790,
    description: "La Champagne réunie au domaine en 1284. La Lorraine acquise en 1766, l'Alsace en 1648 (traité de Westphalie).",
    coords: [[3.5,49],[8.5,51],[8.5,47.5],[6,47.5],[5,47.5],[5.5,47.5],[5,47.5],[3.5,48.5],[3.5,49]]
  },
  {
    id: "gouv-bourgogne", nom: "Bourgogne & Franche-Comté",
    couleur: "#9B2335", seigneur: "Gouverneur royal",
    dateDebut: 1477, dateFin: 1790,
    description: "La Bourgogne revient à la Couronne à la mort de Charles le Téméraire (1477). La Franche-Comté annexée en 1678.",
    coords: [[3.5,48.5],[5,47.5],[6,47.5],[8.5,47.5],[7.5,45.5],[5.5,45.5],[4.5,45.5],[3.5,46],[3,47.5],[3.5,48.5]]
  },
  {
    id: "gouv-poitou-guyenne", nom: "Poitou, Guyenne & Gascogne",
    couleur: "#8B6914", seigneur: "Gouverneur royal",
    dateDebut: 1453, dateFin: 1790,
    description: "Définitivement réunis à la Couronne après la victoire de Castillon (1453) qui met fin à la guerre de Cent Ans.",
    coords: [[-5.1,48.7],[-4,47.5],[-3,47],[-2,47.5],[-1.5,46.5],[0,46.5],[1,47],[0,46.5],[-0.5,47],[0,45],[0,43.5],[-2,43.5],[-4,43.5],[-5.1,43.5],[-5.1,48.7]]
  },
  {
    id: "gouv-languedoc-provence", nom: "Languedoc & Provence",
    couleur: "#D2691E", seigneur: "Gouverneur royal",
    dateDebut: 1271, dateFin: 1790,
    description: "Le Languedoc réuni en 1271, la Provence en 1481. Régions méridionales aux traditions juridiques romaines (droit écrit).",
    coords: [[1,47],[2,46],[3.5,46],[4.5,45.5],[7.5,45.5],[8.5,47.5],[8.5,43.5],[7.5,43],[5,43],[3.5,43.5],[2,43.5],[0,43.5],[0,44.5],[1,45],[1,47]]
  },
  {
    id: "corse-ren", nom: "Corse",
    couleur: "#A08060", seigneur: "République de Gênes",
    dateDebut: 1347, dateFin: 1768,
    description: "Toujours sous domination génoise au temps de la Renaissance. La résistance corse menée par Sampiero Corso (1564-1567) échoue.",
    coords: [[8.6,43.1],[9.6,43],[9.6,42],[9.5,41.4],[8.8,41.3],[8.5,42],[8.6,43.1]]
  }
];

const ANCIEN_REGIME = [
  {
    id: "flandre-ar", nom: "Flandre & Artois",
    couleur: "#4169E1", seigneur: "Province royale",
    dateDebut: 1668, dateFin: 1789,
    description: "Acquises progressivement par Louis XIV lors des guerres de Flandre. Frontière nord stratégique fortifiée par Vauban.",
    coords: [[-2,51.1],[5.5,51.1],[5.5,50],[3.5,49.5],[1.5,50],[-1,49.5],[-2,51.1]]
  },
  {
    id: "normandie-ar", nom: "Province de Normandie",
    couleur: "#5B9BD5", seigneur: "Province royale",
    dateDebut: 1468, dateFin: 1790,
    description: "L'une des plus grandes provinces. Réputée pour son agriculture, son commerce maritime (Rouen, Le Havre) et ses manufactures.",
    coords: [[-2,50.5],[1.5,50],[3.5,49.5],[2.5,48.5],[0,48.5],[-1.5,48.5],[-2,49.5],[-2,50.5]]
  },
  {
    id: "bretagne-ar", nom: "Province de Bretagne",
    couleur: "#1E7A3C", seigneur: "Province à États",
    dateDebut: 1532, dateFin: 1790,
    description: "Province à États particulièrement jalouse de ses privilèges (les Breton Liberties). Vote ses propres impôts via les États de Bretagne.",
    coords: [[-5.1,48.7],[-2,49.5],[-1.5,48.5],[-0.5,47],[-1.5,47],[-3,47],[-4.5,47.5],[-5.1,47.5],[-5.1,48.7]]
  },
  {
    id: "ile-de-france-ar", nom: "Île-de-France",
    couleur: "#1A2744", seigneur: "Province royale (Paris)",
    dateDebut: 987, dateFin: 1790,
    description: "Cœur du royaume, siège de la cour à Versailles depuis 1682. Centre administratif, intellectuel et culturel de la France.",
    coords: [[-0.5,49.2],[1.5,50],[3.5,49.5],[3.5,48.5],[2.5,47.5],[1,47.5],[0,48.5],[-0.5,49.2]]
  },
  {
    id: "champagne-ar", nom: "Province de Champagne",
    couleur: "#7B2FBE", seigneur: "Province royale",
    dateDebut: 1284, dateFin: 1790,
    description: "Ancienne terre des grands foires médiévales, devenue province royale depuis 1284. Patrie du vin de Champagne (Dom Pérignon, XVIIe s.).",
    coords: [[3.5,49.5],[6.5,49],[7,48],[6.5,47.5],[5,47.5],[3.5,48.5],[3.5,49.5]]
  },
  {
    id: "alsace-lorraine-ar", nom: "Alsace & Lorraine",
    couleur: "#6A4C93", seigneur: "Province royale",
    dateDebut: 1648, dateFin: 1871,
    description: "L'Alsace annexée par les traités de Westphalie (1648), la Lorraine en 1766. Terres de contact entre culture française et germanique.",
    coords: [[6.5,49],[8.5,51],[8.5,47.5],[6.5,47.5],[7,48],[6.5,49]]
  },
  {
    id: "bourgogne-ar", nom: "Province de Bourgogne",
    couleur: "#8B0000", seigneur: "Province à États",
    dateDebut: 1477, dateFin: 1790,
    description: "Province à États, conservant des institutions issues de l'époque ducale. Grande richesse viticole et patrimoine cistercien.",
    coords: [[3.5,48.5],[5,47.5],[6.5,47.5],[6,45.5],[5,45.5],[4.5,45.5],[3.5,46],[3,47.5],[3.5,48.5]]
  },
  {
    id: "centre-ar", nom: "Orléanais, Berry & Bourbonnais",
    couleur: "#2E4A7A", seigneur: "Province royale",
    dateDebut: 1498, dateFin: 1790,
    description: "Territoires du cœur du royaume. Le Bourbonnais donna son nom à la dynasty régnante (Henri IV, 1589).",
    coords: [[1,47.5],[3.5,48.5],[3,47.5],[3.5,46],[2.5,45.5],[1.5,45.5],[0.5,45.5],[0,46.5],[1,47.5]]
  },
  {
    id: "poitou-saintonge", nom: "Poitou & Saintonge",
    couleur: "#4A8C6F", seigneur: "Province royale",
    dateDebut: 1453, dateFin: 1790,
    description: "Ancien cœur de l'Aquitaine anglaise. Patrie de Richelieu et de Talleyrand. Commerce du sel et de l'eau-de-vie (cognac).",
    coords: [[-2,47.5],[-1.5,46.5],[0,46.5],[0.5,45.5],[0,44.5],[-1.5,44],[-2.5,44.5],[-3,46],[-2,47.5]]
  },
  {
    id: "guyenne-gascogne", nom: "Guyenne & Gascogne",
    couleur: "#7D5A2E", seigneur: "Province royale",
    dateDebut: 1453, dateFin: 1790,
    description: "Territoire d'Outre-Garonne, ancienne terre anglaise. Bordeaux, port de commerce du vin de Bordeaux avec l'Angleterre.",
    coords: [[-5.1,47.5],[-3,46],[-2.5,44.5],[-1.5,44],[0,44.5],[0,43.5],[-2,43.5],[-4,43.5],[-5.1,43.5],[-5.1,47.5]]
  },
  {
    id: "languedoc-ar", nom: "Province de Languedoc",
    couleur: "#C4782A", seigneur: "Province à États",
    dateDebut: 1271, dateFin: 1790,
    description: "Province à États, la plus étendue du royaume. Canal du Midi construit sous Louis XIV (1666-1681). Patrie de la langue d'oc.",
    coords: [[0,44.5],[0.5,45.5],[1.5,45.5],[3.5,46],[5,45.5],[5,43.5],[3.5,43.5],[2,43.5],[0,43.5],[0,44.5]]
  },
  {
    id: "dauphiné-provence", nom: "Dauphiné & Provence",
    couleur: "#C84B00", seigneur: "Province royale",
    dateDebut: 1349, dateFin: 1790,
    description: "Le Dauphiné cédé en 1349, la Provence en 1481. Riviera méditerranéenne et Alpes. Nice restée sarde jusqu'en 1860.",
    coords: [[5,45.5],[6,45.5],[8.5,47.5],[8.5,43.5],[7.5,43],[5,43],[5,43.5],[5,45.5]]
  },
  {
    id: "corse-ar", nom: "Corse",
    couleur: "#A08060", seigneur: "France depuis 1768",
    dateDebut: 1768, dateFin: 1790,
    description: "Achetée à Gênes en 1768. Napoléon Bonaparte y naît la même année. Devient département français en 1790.",
    coords: [[8.6,43.1],[9.6,43],[9.6,42],[9.5,41.4],[8.8,41.3],[8.5,42],[8.6,43.1]]
  }
];

const REVOLUTION_EMPIRE = [
  {
    id: "france-hexagone", nom: "France républicaine (83 départements)",
    couleur: "#002395", seigneur: "République française",
    dateDebut: 1789, dateFin: 1815,
    description: "La loi du 22 décembre 1789 divise la France en 83 départements, effaçant les anciennes provinces. Principe : égalité des citoyens devant la loi.",
    coords: [[-5.1,51.1],[5.5,51.1],[8.5,51.1],[8.5,43.5],[7.5,43],[5,43],[2.9,43],[2,43.5],[0,43],[2,43.5],[-2,43.5],[-4,43.5],[-5.1,43.5],[-5.1,51.1]]
  },
  {
    id: "departements-belgique", nom: "Départements belges (Empire)",
    couleur: "#3A5A8C", seigneur: "Empire napoléonien",
    dateDebut: 1795, dateFin: 1814,
    description: "La Belgique et le Luxembourg annexés en 1795 forment 9 nouveaux départements. Rattachés à la France jusqu'à la chute de l'Empire.",
    coords: [[0,51.5],[6,51.5],[6,50],[5.5,50],[4.5,50],[3.5,49.5],[2,49.5],[0.5,50],[0,51.5]]
  },
  {
    id: "departements-rhénans", nom: "Départements rhénans (Empire)",
    couleur: "#4A6A9C", seigneur: "Empire napoléonien",
    dateDebut: 1798, dateFin: 1814,
    description: "La rive gauche du Rhin annexée en 1798. Quatre nouveaux départements : Bas-Rhin (rive gauche), Roer, Rhin-et-Moselle, Sarre.",
    coords: [[8.5,51.1],[12,51],[12,47.5],[8.5,47.5],[8.5,51.1]]
  },
  {
    id: "corse-emp", nom: "Corse",
    couleur: "#1A3A7A", seigneur: "Empire napoléonien — berceau de l'Empereur",
    dateDebut: 1768, dateFin: 1815,
    description: "Île natale de Napoléon Bonaparte (né à Ajaccio le 15 août 1769). Tient une place symbolique centrale dans l'identité de l'Empire.",
    coords: [[8.6,43.1],[9.6,43],[9.6,42],[9.5,41.4],[8.8,41.3],[8.5,42],[8.6,43.1]]
  }
];

const XIXe_SIECLE = [
  {
    id: "france-xix", nom: "France métropolitaine",
    couleur: "#708090", seigneur: "Monarchie constitutionnelle / IIIe République",
    dateDebut: 1815, dateFin: 1914,
    description: "Après le Congrès de Vienne (1815), la France retrouve ses frontières de 1789. 89 départements. Perd l'Alsace-Moselle en 1871.",
    coords: [[-5.1,51.1],[-2,51.1],[0.5,51.1],[3.5,50.5],[5.5,50],[6.5,49],[6.5,47.5],[5,45.5],[7.5,45.5],[8.5,47.5],[8.5,43.5],[7.5,43],[5,43],[2.9,43],[0,43],[-2,43.5],[-4,43.5],[-5.1,43.5],[-5.1,51.1]]
  },
  {
    id: "alsace-moselle-prussienne", nom: "Alsace-Lorraine (Annexée, 1871)",
    couleur: "#5C5C5C", seigneur: "Empire allemand après 1871",
    dateDebut: 1871, dateFin: 1918,
    description: "Cédée à l'Empire allemand par le traité de Francfort (10 mai 1871) suite à la défaite de la guerre franco-prussienne. Restituée en 1918.",
    coords: [[6.5,49],[8.5,51],[8.5,47.5],[6.5,47.5],[6.5,49]]
  },
  {
    id: "corse-xix", nom: "Corse",
    couleur: "#606878", seigneur: "France",
    dateDebut: 1815, dateFin: 1945,
    description: "Département français depuis 1790, sous-divisé en Haute-Corse et Corse-du-Sud depuis 1976.",
    coords: [[8.6,43.1],[9.6,43],[9.6,42],[9.5,41.4],[8.8,41.3],[8.5,42],[8.6,43.1]]
  }
];

const GUERRES_MONDIALES = [
  {
    id: "zone-occupee", nom: "Zone occupée (Wehrmacht, 1940-1944)",
    couleur: "#4A4A2A", seigneur: "Occupation allemande nazie",
    dateDebut: 1940, dateFin: 1944,
    description: "Occupation directe par la Wehrmacht après l'armistice du 22 juin 1940. Comprend Paris, la côte atlantique et le nord industriel.",
    coords: [[-5.1,51.1],[8.5,51.1],[8.5,48],[6,47.5],[5,47.5],[4,46.8],[3,46.8],[2,46.5],[1,46.5],[0,46.8],[-1,46.8],[-2,47],[-5.1,47.5],[-5.1,51.1]]
  },
  {
    id: "zone-libre", nom: "Zone libre (État français de Vichy)",
    couleur: "#6B7B4A", seigneur: "Maréchal Pétain — État français",
    dateDebut: 1940, dateFin: 1942,
    description: "Zone non occupée jusqu'au 11 novembre 1942, gouvernée depuis Vichy par le régime autoritaire du Maréchal Pétain. Collabore avec l'occupant nazi.",
    coords: [[-5.1,47.5],[-2,47],[-1,46.8],[0,46.8],[1,46.5],[2,46.5],[3,46.8],[4,46.8],[5,47.5],[5,45.5],[7.5,45.5],[8.5,47.5],[8.5,43.5],[7.5,43],[5,43],[2.9,43],[0,43],[-2,43.5],[-4,43.5],[-5.1,43.5],[-5.1,47.5]]
  },
  {
    id: "alsace-moselle-nazie", nom: "Alsace-Moselle (Annexée par le Reich)",
    couleur: "#2A2A1A", seigneur: "Reich nazi (de facto annexée)",
    dateDebut: 1940, dateFin: 1944,
    description: "Incorporée de fait au Reich nazi dès août 1940. Les habitants soumis à la germanisation forcée et à la conscription dans la Wehrmacht (« Malgré-nous »).",
    coords: [[6.5,49],[8.5,51],[8.5,47.5],[6.5,47.5],[6.5,49]]
  },
  {
    id: "corse-wwii", nom: "Corse",
    couleur: "#556070", seigneur: "Occupation italienne (1942-1943)",
    dateDebut: 1942, dateFin: 1943,
    description: "Occupée par l'Italie fasciste de novembre 1942 à septembre 1943. Première région française libérée (octobre 1943), sous l'impulsion de la résistance locale.",
    coords: [[8.6,43.1],[9.6,43],[9.6,42],[9.5,41.4],[8.8,41.3],[8.5,42],[8.6,43.1]]
  }
];

// ── Generate output files ─────────────────────────────────────────────────
function toTS(eraId, rawData) {
  const items = rawData.map(t => ({
    ...t,
    d: toPath(t.coords)
  }));
  const varName = `TERRITOIRES_${eraId.toUpperCase().replace(/-/g, "_")}`;
  return `// Auto-generated by scripts/generate-territoire-paths.mjs
import type { Territoire } from "./types";

export const ${varName}: Territoire[] = ${JSON.stringify(items, null, 2)};
`;
}

const ERAS = [
  ["antiquite",          ANTIQUITE],
  ["moyen-age",          MOYEN_AGE],
  ["renaissance",        RENAISSANCE],
  ["ancien-regime",      ANCIEN_REGIME],
  ["revolution-empire",  REVOLUTION_EMPIRE],
  ["xixe-siecle",        XIXe_SIECLE],
  ["guerres-mondiales",  GUERRES_MONDIALES],
];

for (const [id, data] of ERAS) {
  writeFileSync(join(OUT, `${id}.ts`), toTS(id, data), "utf8");
  console.log(`Written data/territoires/${id}.ts (${data.length} territories)`);
}

// types.ts
writeFileSync(join(OUT, "types.ts"), `export type Territoire = {
  id: string;
  nom: string;
  couleur: string;
  coords: [number, number][];
  d: string;
  seigneur?: string;
  dateDebut?: number;
  dateFin?: number;
  description: string;
  emblemeUrl?: string;
};
`, "utf8");

// contemporaine.ts — wraps france-svg-paths.ts
writeFileSync(join(OUT, "contemporaine.ts"), `// Reuses the modern administrative regions from france-svg-paths.ts
import { FRANCE_SVG_PATHS } from "@/data/france-svg-paths";
import { REGIONS } from "@/data/regions";
import type { Territoire } from "./types";

export const TERRITOIRES_CONTEMPORAINE: Territoire[] = FRANCE_SVG_PATHS.map(({ code, nom, d }) => {
  const region = REGIONS.find(r => r.code === code);
  return {
    id: code,
    nom,
    couleur: region?.couleur ?? "#3B82F6",
    coords: [],
    d,
    seigneur: "République française",
    dateDebut: 2016,
    description: region?.description ?? \`Région administrative issue de la réforme territoriale de 2016.\`,
  };
});
`, "utf8");

// index.ts
writeFileSync(join(OUT, "index.ts"), `export { TERRITOIRES_ANTIQUITE } from "./antiquite";
export { TERRITOIRES_MOYEN_AGE } from "./moyen-age";
export { TERRITOIRES_RENAISSANCE } from "./renaissance";
export { TERRITOIRES_ANCIEN_REGIME } from "./ancien-regime";
export { TERRITOIRES_REVOLUTION_EMPIRE } from "./revolution-empire";
export { TERRITOIRES_XIXE_SIECLE } from "./xixe-siecle";
export { TERRITOIRES_GUERRES_MONDIALES } from "./guerres-mondiales";
export { TERRITOIRES_CONTEMPORAINE } from "./contemporaine";
export type { Territoire } from "./types";
`, "utf8");

console.log("\nAll territory files generated successfully.");
