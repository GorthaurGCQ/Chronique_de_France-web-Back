// =============================================================================
// TYPES — Noms d'icônes SVG maison (Chronique de France)
// =============================================================================

export type IconName =
  | "lock"
  | "denied"
  | "close"
  | "chevronLeft"
  | "chevronRight"
  | "chevronUp"
  | "chevronDown"
  | "fullscreen"
  | "arrowRight"
  | "external"
  | "play"
  | "link"
  | "document"
  | "music"
  | "book"
  | "image"
  | "film"
  | "user"
  | "key"
  | "chart"
  | "bookmark"
  | "clock"
  | "settings"
  | "camera"
  | "crown"
  | "shield"
  | "logout"
  | "trash"
  | "pencil"
  | "eye"
  | "eyeOff"
  | "note"
  | "calendar"
  | "users"
  | "globe"
  | "message"
  | "phone"
  | "mail"
  | "pin"
  | "graduation"
  | "folder"
  | "school"
  | "monument"
  | "map"
  | "plus"
  | "check"
  | "ban"
  | "clipboard"
  | "file"
  | "anchor"
  | "flag";

export type RegionIconName =
  | "regionIdf"
  | "regionCentre"
  | "regionBourgogne"
  | "regionNormandie"
  | "regionHauts"
  | "regionGrandEst"
  | "regionPdl"
  | "regionBretagne"
  | "regionAquitaine"
  | "regionOccitanie"
  | "regionAra"
  | "regionPaca"
  | "regionCorse";

/** Correspondance nom affiché FranceMap → clé icône régionale */
export const REGION_NAME_TO_ICON: Record<string, RegionIconName> = {
  "Île-de-France": "regionIdf",
  "Centre-Val de Loire": "regionCentre",
  "Bourgogne-Franche-Comté": "regionBourgogne",
  "Normandie": "regionNormandie",
  "Hauts-de-France": "regionHauts",
  "Grand Est": "regionGrandEst",
  "Pays de la Loire": "regionPdl",
  "Bretagne": "regionBretagne",
  "Nouvelle-Aquitaine": "regionAquitaine",
  "Occitanie": "regionOccitanie",
  "Auvergne-Rhône-Alpes": "regionAra",
  "Provence-Alpes-Côte d'Azur": "regionPaca",
  "Corse": "regionCorse",
};

export type IconTone = "gold" | "navy" | "muted" | "inherit";
