export type Epoque = {
  id: string;
  label: string;
  dateDebut: number;
  dateFin: number;
  couleur: string;
  description: string;
  faitsHistoriques: string[];
  sourceCartographique: string;
  territoiresKey: string;
};

export const EPOQUES: Epoque[] = [
  {
    id: "antiquite",
    label: "Antiquité",
    dateDebut: -500000,
    dateFin: 486,
    couleur: "#C4956A",
    description:
      "De la Gaule préhistorique à la chute de l'Empire romain d'Occident. La Gaule est divisée en quatre grandes provinces romaines après la conquête de César (52 av. J.-C.). La romanisation apporte la langue latine, le droit, les voies romaines et le christianisme.",
    faitsHistoriques: [
      "52 av. J.-C. : Défaite de Vercingétorix à Alésia — fin de la résistance gauloise",
      "27 av. J.-C. : Auguste réorganise la Gaule en 4 provinces (Belgique, Lyonnaise, Aquitaine, Narbonnaise)",
      "486 ap. J.-C. : Clovis bat Syagrius à Soissons — fin de l'autorité romaine en Gaule",
    ],
    sourceCartographique: "Provinces romaines d'après César, Auguste (27 av. J.-C.) — Atlas historique CNRS/EHESS",
    territoiresKey: "antiquite",
  },
  {
    id: "moyen-age",
    label: "Moyen Âge",
    dateDebut: 486,
    dateFin: 1492,
    couleur: "#8B2635",
    description:
      "Du règne de Clovis à la fin de la guerre de Cent Ans. La France féodale est divisée en duchés et comtés dont les seigneurs doivent hommage au roi, mais gardent une large autonomie. Les Plantagenêts contrôlent plus de la moitié du royaume au XIIe siècle.",
    faitsHistoriques: [
      "987 : Hugues Capet élu roi — fondation de la dynastie capétienne",
      "1204 : Philippe Auguste conquiert la Normandie sur Jean sans Terre",
      "1453 : Victoire de Castillon — fin de la guerre de Cent Ans, les Anglais quittent la France",
    ],
    sourceCartographique: "Fiefs et domaines royaux vers 1180 — Atlas de l'Histoire de France (BnF/Gallica)",
    territoiresKey: "moyen-age",
  },
  {
    id: "renaissance",
    label: "Renaissance",
    dateDebut: 1492,
    dateFin: 1610,
    couleur: "#2D5A3D",
    description:
      "De la découverte de l'Amérique à l'assassinat d'Henri IV. La France s'unifie sous l'autorité royale au détriment des grands seigneurs. Les gouvernements provinciaux remplacent progressivement les duchés. Les guerres de Religion (1562-1598) déchirent le pays.",
    faitsHistoriques: [
      "1516 : Concordat de Bologne — le roi nomme les évêques, renforce l'autorité royale sur l'Église",
      "1539 : Ordonnance de Villers-Cotterêts — le français remplace le latin dans les actes officiels",
      "1598 : Édit de Nantes — Henri IV accorde la liberté de culte aux protestants",
    ],
    sourceCartographique: "Gouvernements généraux de France, XVIe siècle — Bibliothèque nationale de France",
    territoiresKey: "renaissance",
  },
  {
    id: "ancien-regime",
    label: "Ancien Régime",
    dateDebut: 1610,
    dateFin: 1789,
    couleur: "#1a2744",
    description:
      "De la mort d'Henri IV à la Révolution française. La monarchie absolue atteint son apogée sous Louis XIV (Versailles, 1682). La France compte 32 provinces aux coutumes et institutions variées. Les Lumières préparent la remise en cause de cet ordre.",
    faitsHistoriques: [
      "1648 : Traités de Westphalie — la France obtient l'Alsace, puissance dominante en Europe",
      "1682 : Louis XIV installe la cour à Versailles — apogée de la monarchie absolue",
      "1766 : Rattachement de la Lorraine — la France atteint ses frontières « naturelles »",
    ],
    sourceCartographique: "Provinces de l'Ancien Régime (XVIIe-XVIIIe s.) — Carte de Cassini, BnF",
    territoiresKey: "ancien-regime",
  },
  {
    id: "revolution-empire",
    label: "Révolution & Empire",
    dateDebut: 1789,
    dateFin: 1815,
    couleur: "#1D3461",
    description:
      "De la prise de la Bastille à Waterloo. La Révolution abolit les provinces et crée 83 départements égaux. Napoléon Bonaparte porte la France à son apogée territoriale (130 départements en 1811) avant la défaite de 1815 et le Congrès de Vienne.",
    faitsHistoriques: [
      "22 déc. 1789 : Loi créant 83 départements — fin des provinces et des privilèges féodaux",
      "1804 : Napoléon se couronne Empereur — début de la construction de l'Empire européen",
      "1811 : Apogée de l'Empire — 130 départements de Rome à Hambourg",
    ],
    sourceCartographique: "Départements révolutionnaires 1789-1815 — Archives nationales / IGN historique",
    territoiresKey: "revolution-empire",
  },
  {
    id: "xixe-siecle",
    label: "XIXe siècle",
    dateDebut: 1815,
    dateFin: 1900,
    couleur: "#708090",
    description:
      "Du Congrès de Vienne à la Belle Époque. La France oscille entre monarchies et républiques (6 régimes en 85 ans). La défaite de 1870-71 contre la Prusse impose la cession de l'Alsace-Moselle. La IIIe République (1870) s'installe durablement.",
    faitsHistoriques: [
      "1815 : Congrès de Vienne — la France retrouve ses frontières de 1789",
      "10 mai 1871 : Traité de Francfort — cession de l'Alsace-Moselle à l'Empire allemand",
      "1882 : Lois Jules Ferry — enseignement primaire laïc, gratuit et obligatoire",
    ],
    sourceCartographique: "France administrative XIXe siècle — Archives cartographiques IGN / Gallica BnF",
    territoiresKey: "xixe-siecle",
  },
  {
    id: "guerres-mondiales",
    label: "Guerres mondiales",
    dateDebut: 1900,
    dateFin: 1945,
    couleur: "#4A4A2A",
    description:
      "Deux guerres mondiales en 30 ans. La Grande Guerre (1914-1918) se déroule en grande partie sur le sol français (Verdun, Marne). En 1940, l'armistice divise la France en zone occupée et zone libre (Vichy). La Libération (1944) et la capitulation allemande (1945) restaurent la France.",
    faitsHistoriques: [
      "1918 : Victoire — l'Alsace-Moselle retrouve la France après 47 ans de séparation",
      "22 juin 1940 : Armistice — la France divisée en zone occupée et zone libre (Vichy)",
      "Octobre 1943 : La Corse est la première région de France métropolitaine libérée",
    ],
    sourceCartographique: "Ligne de démarcation 1940-1942 — Archives nationales / Mémorial de Caen",
    territoiresKey: "guerres-mondiales",
  },
  {
    id: "contemporaine",
    label: "France actuelle",
    dateDebut: 1945,
    dateFin: new Date().getFullYear(),
    couleur: "#3B82F6",
    description:
      "De la Libération à nos jours. La Ve République (1958) apporte stabilité institutionnelle. La réforme territoriale de 2016 regroupe 22 régions en 13 régions métropolitaines. La France est membre fondateur de l'Union européenne (1957) et du Conseil de sécurité de l'ONU.",
    faitsHistoriques: [
      "1957 : Traité de Rome — la France cofonde la Communauté économique européenne",
      "1958 : Ve République — de Gaulle instaure un régime semi-présidentiel stable",
      "2016 : Réforme territoriale — fusion des régions : 22 régions deviennent 13",
    ],
    sourceCartographique: "Régions administratives 2016 — IGN GÉOFLA / data.gouv.fr",
    territoiresKey: "contemporaine",
  },
];
