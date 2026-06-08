// =============================================================================
// COUCHE BACK — Validation des données entrantes (schémas Zod)
// Appelée par les route.ts avant INSERT/UPDATE en base
// =============================================================================

import { z } from "zod";

// ---------------------------------------------------------------------------
// Ressources pédagogiques
// ---------------------------------------------------------------------------

const resourceTypeEnum = z.enum([
  "CHRONOLOGIE",
  "FICHE_THEMATIQUE",
  "DOCUMENT_EDUCATIF",
  "PUBLICATION",
]);

export const createResourceSchema = z.object({
  titre: z.string().min(3, "Le titre doit comporter au moins 3 caractères.").max(255),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères."),
  contenu: z.string().min(50, "Le contenu doit comporter au moins 50 caractères."),
  type: resourceTypeEnum,
});

export const updateResourceSchema = createResourceSchema.partial(); // tous les champs optionnels

// ---------------------------------------------------------------------------
// Événements
// ---------------------------------------------------------------------------

export const createEventSchema = z.object({
  titre: z.string().min(3, "Le titre doit comporter au moins 3 caractères.").max(255),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères."),
  lieu: z.string().min(2, "Le lieu doit comporter au moins 2 caractères.").max(255),
  date: z.coerce.date().refine((d) => !isNaN(d.getTime()), { message: "Date invalide." }),
});

export const updateEventSchema = createEventSchema.partial();

// ---------------------------------------------------------------------------
// Paramètres de requête (pagination, recherche, filtrage)
// ---------------------------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const resourceQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  type: resourceTypeEnum.optional(),
});

export const eventQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Helper : parse le body JSON et renvoie erreurs 400 structurées si invalide
// ---------------------------------------------------------------------------

export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data); // validation sans lever d'exception
  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "_root";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return { success: false, errors };
  }
  return { success: true, data: result.data }; // données typées et validées
}
