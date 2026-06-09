// =============================================================================
// COUCHE DONNÉES (BACK) — Modèle des tables PostgreSQL (Drizzle ORM)
// Définit la structure persistée ; utilisé par db/index.ts et toutes les route.ts
// Dialecte : PostgreSQL (hébergé sur Supabase)
// =============================================================================

// Module : node_modules/drizzle-orm/pg-core
import {
  pgTable,      // déclare une table SQL
  pgEnum,       // colonne à valeurs fixes (enum PostgreSQL)
  varchar,      // chaîne courte (email, id…)
  text,         // chaîne longue (contenu, description…)
  timestamp,    // date/heure
  boolean,      // vrai/faux
  index,        // index non unique (perf recherche)
  uniqueIndex,  // contrainte d'unicité
} from "drizzle-orm/pg-core";
// Module : node_modules/drizzle-orm
import { relations } from "drizzle-orm"; // liens entre tables (optionnel, requêtes relationnelles)

// ---------------------------------------------------------------------------
// Enums — valeurs autorisées en base (cohérence métier)
// ---------------------------------------------------------------------------

export const resourceTypeEnum = pgEnum("resource_type", [
  "CHRONOLOGIE",
  "FICHE_THEMATIQUE",
  "DOCUMENT_EDUCATIF",
  "PUBLICATION",
]);
export const regionEnum = pgEnum("region", [
  "NATIONAL",
  "AUVERGNE_RHONE_ALPES",
  "BOURGOGNE_FRANCHE_COMTE",
  "BRETAGNE",
  "CENTRE_VAL_DE_LOIRE",
  "CORSE",
  "GRAND_EST",
  "HAUTS_DE_FRANCE",
  "ILE_DE_FRANCE",
  "NORMANDIE",
  "NOUVELLE_AQUITAINE",
  "OCCITANIE",
  "PAYS_DE_LA_LOIRE",
  "PROVENCE_ALPES_COTE_AZUR",
]);
export const timelineEnum = pgEnum("timeline", [
  "ANTIQUITE",
  "MOYEN_AGE",
  "RENAISSANCE",
  "ANCIEN_REGIME",
  "REVOLUTION",
  "XIXE_SIECLE",
  "CONTEMPORAIN",
]);
export const domaineEnum = pgEnum("domaine", [
  "PATRIMOINE_HISTOIRE",
  "CULTURE_TRADITIONS",
  "ARCHITECTURE",
  "GEOGRAPHIE",
  "FIGURES_HISTORIQUES",
  "EVENEMENTS_MARQUANTS",
]);

// Types TS inférés depuis les enums (autocomplétion dans le code back)
export type ResourceType = (typeof resourceTypeEnum.enumValues)[number];
export type Region = (typeof regionEnum.enumValues)[number];
export type Timeline = (typeof timelineEnum.enumValues)[number];
export type Domaine = (typeof domaineEnum.enumValues)[number];

// ---------------------------------------------------------------------------
// Tables Better Auth — utilisateurs, sessions, comptes (login email/mdp)
// Liées à /api/auth/* et auth.api.getSession() dans les route.ts
// ---------------------------------------------------------------------------

export const authUser = pgTable("auth_user", {
  id: varchar("id", { length: 36 }).primaryKey(), // identifiant unique utilisateur
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: varchar("image", { length: 512 }),
  role: varchar("role", { length: 50 }).default("user"),
  banned: boolean("banned").default(false),
  banReason: varchar("ban_reason", { length: 512 }),
  banExpires: timestamp("ban_expires"),
  permissions:       text("permissions"),                       // Réservé Better Auth admin plugin (ne pas modifier)
  customPermissions: text("custom_permissions").default("[]"), // Nos droits granulaires
  userPreferences:   text("user_preferences").default('{"emailNotifications":true,"defaultRegion":"NATIONAL"}'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const authSession = pgTable("auth_session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(), // fin de validité session
  token: varchar("token", { length: 512 }).notNull().unique(), // cookie de session côté client
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => authUser.id, { onDelete: "cascade" }),
});

export const authAccount = pgTable("auth_account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 64 }).notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => authUser.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 512 }),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const authVerification = pgTable("auth_verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// Table : resources — contenus pédagogiques (bibliothèque, admin CRUD)
// ---------------------------------------------------------------------------

export const resources = pgTable(
  "resources",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()), // UUID généré à l'insertion
    titre: varchar("titre", { length: 255 }).notNull(),
    description: text("description").notNull(),
    contenu: text("contenu").notNull(),
    type: resourceTypeEnum().notNull(),
    region: regionEnum().notNull().default("NATIONAL"),
    timeline: timelineEnum().notNull(),
    domaine: domaineEnum().notNull().default("PATRIMOINE_HISTOIRE"),
    mediaUrl:     varchar("media_url",     { length: 1024 }),
    bannerUrl:    varchar("banner_url",    { length: 1024 }),
    thumbnailUrl: varchar("thumbnail_url", { length: 1024 }),
    authorId: varchar("author_id", { length: 36 })
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }), // clé étrangère → auth_user
    publishedAt: timestamp("published_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("resources_type_idx").on(table.type),
    index("resources_titre_idx").on(table.titre),
  ],
);

// ---------------------------------------------------------------------------
// Table : favorites — lien utilisateur ↔ ressource (API /api/favorites)
// ---------------------------------------------------------------------------

export const favorites = pgTable(
  "favorites",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    resourceId: varchar("resource_id", { length: 36 })
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),
    note:      text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("favorites_user_resource_idx").on(table.userId, table.resourceId), // 1 favori max par couple user+ressource
  ],
);

// ---------------------------------------------------------------------------
// Table : events — (suite du schéma : events, audit, relations… même principe)
// ---------------------------------------------------------------------------

export const events = pgTable("events", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titre: varchar("titre", { length: 255 }).notNull(),
  description: text("description").notNull(),
  contenu: text("contenu").notNull().default(""),
  lieu: varchar("lieu", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 1024 }),
  region: regionEnum().notNull().default("NATIONAL"),
  timeline: timelineEnum().notNull().default("CONTEMPORAIN"),
  domaine: domaineEnum().notNull().default("EVENEMENTS_MARQUANTS"),
  organisateurId: varchar("organisateur_id", { length: 36 })
    .notNull()
    .references(() => authUser.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ---------------------------------------------------------------------------
// Table : audit_logs
// ---------------------------------------------------------------------------

export const auditLogs = pgTable("audit_logs", {
  id:          varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  actorId:     varchar("actor_id",   { length: 36 }),          // null si système
  actorName:   varchar("actor_name", { length: 255 }),
  actorRole:   varchar("actor_role", { length: 50 }),
  action:      varchar("action",     { length: 100 }).notNull(), // CREATE_RESOURCE, DELETE_USER…
  category:    varchar("category",   { length: 50 }).notNull(),  // resources | users | events
  severity:    varchar("severity",   { length: 20 }).notNull().default("info"), // success | info | warning | danger
  target:      varchar("target",     { length: 255 }),           // "Ressource : Clovis Ier"
  details:     text("details"),                                  // JSON ou texte libre
  createdAt:   timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("audit_logs_category_idx").on(table.category),
  index("audit_logs_actor_idx").on(table.actorId),
  index("audit_logs_created_idx").on(table.createdAt),
]);

// ---------------------------------------------------------------------------
// Table : resource_views (historique de consultation)
// ---------------------------------------------------------------------------

export const resourceViews = pgTable(
  "resource_views",
  {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId:     varchar("user_id",     { length: 36 }).notNull().references(() => authUser.id,  { onDelete: "cascade" }),
    resourceId: varchar("resource_id", { length: 36 }).notNull().references(() => resources.id, { onDelete: "cascade" }),
    viewedAt:   timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [
    index("resource_views_user_idx").on(table.userId),
    uniqueIndex("resource_views_user_resource_idx").on(table.userId, table.resourceId),
  ],
);

// ---------------------------------------------------------------------------
// Table : event_registrations
// ---------------------------------------------------------------------------

export const eventRegistrations = pgTable(
  "event_registrations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    eventId: varchar("event_id", { length: 36 })
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    nom:    varchar("nom",    { length: 100 }).notNull(),
    prenom: varchar("prenom", { length: 100 }).notNull(),
    email:  varchar("email",  { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("registrations_event_idx").on(table.eventId),
    uniqueIndex("registrations_event_email_idx").on(table.eventId, table.email),
  ],
);

// ---------------------------------------------------------------------------
// Relations (utilisées par l'API relationnelle de Drizzle)
// ---------------------------------------------------------------------------

export const authUserRelations = relations(authUser, ({ many }) => ({
  resources: many(resources),
  events: many(events),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  author: one(authUser, {
    fields: [resources.authorId],
    references: [authUser.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  organisateur: one(authUser, {
    fields: [events.organisateurId],
    references: [authUser.id],
  }),
}));

// ---------------------------------------------------------------------------
// Types inférés depuis les tables
// ---------------------------------------------------------------------------

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
