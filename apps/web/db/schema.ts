// Schéma Drizzle ORM — Fondation Chroniques de France
// Dialette : PostgreSQL (Supabase)

import {
  pgTable,
  pgEnum,
  varchar,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "SCIENTIFIQUE"]);
export const resourceTypeEnum = pgEnum("resource_type", [
  "CHRONOLOGIE",
  "FICHE_THEMATIQUE",
  "DOCUMENT_EDUCATIF",
  "PUBLICATION",
]);

// Types TypeScript dérivés des enums
export type Role = (typeof roleEnum.enumValues)[number];
export type ResourceType = (typeof resourceTypeEnum.enumValues)[number];

// ---------------------------------------------------------------------------
// Table : users
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    nom: varchar("nom", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum().notNull().default("USER"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

// ---------------------------------------------------------------------------
// Table : resources
// ---------------------------------------------------------------------------

export const resources = pgTable(
  "resources",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    titre: varchar("titre", { length: 255 }).notNull(),
    description: text("description").notNull(),
    contenu: text("contenu").notNull(),
    type: resourceTypeEnum().notNull(),
    authorId: varchar("author_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
// Table : events
// ---------------------------------------------------------------------------

export const events = pgTable("events", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titre: varchar("titre", { length: 255 }).notNull(),
  description: text("description").notNull(),
  lieu: varchar("lieu", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  organisateurId: varchar("organisateur_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ---------------------------------------------------------------------------
// Relations (utilisées par l'API relationnelle de Drizzle)
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  resources: many(resources),
  events: many(events),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  author: one(users, {
    fields: [resources.authorId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  organisateur: one(users, {
    fields: [events.organisateurId],
    references: [users.id],
  }),
}));

// ---------------------------------------------------------------------------
// Tables Better Auth (gestion sessions, comptes OAuth, vérifications)
// ---------------------------------------------------------------------------

export const authUser = pgTable("auth_user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: varchar("image", { length: 512 }),
  role: varchar("role", { length: 50 }).default("user"),
  banned: boolean("banned").default(false),
  banReason: varchar("ban_reason", { length: 512 }),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const authSession = pgTable("auth_session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 512 }).notNull().unique(),
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
// Types inférés depuis les tables
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
