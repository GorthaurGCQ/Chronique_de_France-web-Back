// Schémas de validation Zod — Fondation Chroniques de France

import { z } from "zod";

// ---------------------------------------------------------------------------
// Authentification
// ---------------------------------------------------------------------------

export const registerSchema = z.object({
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères.").max(100),
  email: z.string().email("Adresse e-mail invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre."),
});

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

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

export const updateResourceSchema = createResourceSchema.partial();

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
// Utilisateurs (mise à jour par un admin)
// ---------------------------------------------------------------------------

export const updateUserSchema = z.object({
  nom: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(["USER", "ADMIN", "SCIENTIFIQUE"]).optional(),
});

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
// Helper : parse et retourne une erreur 400 formatée si invalide
// ---------------------------------------------------------------------------

export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "_root";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}
