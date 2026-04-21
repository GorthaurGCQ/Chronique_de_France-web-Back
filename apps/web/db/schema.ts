// Schéma Drizzle ORM — Fondation Chroniques de France
// Dialette : PostgreSQL (Supabase)

import {
  pgTable,
  pgEnum,
  varchar,
  text,
  timestamp,
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
// Types inférés depuis les tables
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
