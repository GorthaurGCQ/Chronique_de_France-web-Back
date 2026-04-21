/** Info historique associée à un territoire pour une époque donnée */
export type TerritoireInfo = {
  id: string;
  nom: string;
  couleur: string;
  seigneur?: string;
  dateDebut?: number;
  dateFin?: number;
  description: string;
};

/**
 * Mapping : code INSEE de région moderne → TerritoireInfo historique.
 * Codes des 13 régions métropolitaines :
 *  "11" Île-de-France   "24" Centre-Val de Loire   "27" Bourgogne-Franche-Comté
 *  "28" Normandie        "32" Hauts-de-France        "44" Grand Est
 *  "52" Pays de la Loire "53" Bretagne               "75" Nouvelle-Aquitaine
 *  "76" Occitanie        "84" Auvergne-Rhône-Alpes   "93" Prov.-Alpes-Côte d'Azur
 *  "94" Corse
 */
export type CarteEpoqueData = Record<string, TerritoireInfo>;
