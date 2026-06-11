/**
 * Tests unitaires — schémas Zod de mise à jour et de requête (PATCH / GET).
 * Couvre updateResourceSchema, resourceQuerySchema, eventQuerySchema et parseBody.
 */

// Module : node_modules/vitest
import { describe, it, expect } from "vitest";

// Modèle : src/models_M/schemas/validation.ts
import {
  updateResourceSchema,
  resourceQuerySchema,
  eventQuerySchema,
  parseBody,
} from "@/models_M/schemas/validation";

// ---------------------------------------------------------------------------
// updateResourceSchema — PATCH partiel sur une ressource
// ---------------------------------------------------------------------------

describe("updateResourceSchema", () => {
  // Tous les champs sont optionnels : un body vide est valide
  it("accepte un objet vide (tous les champs optionnels)", () => {
    expect(updateResourceSchema.safeParse({}).success).toBe(true);
  });

  // Seul le titre peut être envoyé lors d'une mise à jour ciblée
  it("accepte une mise à jour partielle du titre", () => {
    const result = updateResourceSchema.safeParse({ titre: "Nouveau titre" });
    expect(result.success).toBe(true);
  });

  // La contrainte min(3) s'applique même en mise à jour partielle
  it("rejette un titre trop court même en mise à jour partielle", () => {
    expect(updateResourceSchema.safeParse({ titre: "AB" }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resourceQuerySchema — paramètres GET /api/resources
// ---------------------------------------------------------------------------

describe("resourceQuerySchema", () => {
  // page et limit reçoivent des valeurs par défaut si absents
  it("applique pagination par défaut avec filtre type optionnel", () => {
    const result = resourceQuerySchema.safeParse({ type: "CHRONOLOGIE" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
      expect(result.data.type).toBe("CHRONOLOGIE");
    }
  });

  // Le paramètre search est optionnel et transmis tel quel
  it("accepte un paramètre search", () => {
    const result = resourceQuerySchema.safeParse({ search: "révolution" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe("révolution");
    }
  });
});

// ---------------------------------------------------------------------------
// eventQuerySchema — paramètres GET /api/events
// ---------------------------------------------------------------------------

describe("eventQuerySchema", () => {
  // Les query strings sont converties en nombres (page, limit)
  it("combine pagination et recherche", () => {
    const result = eventQuerySchema.safeParse({ page: "2", limit: "25", search: "conférence" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(25);
      expect(result.data.search).toBe("conférence");
    }
  });
});

// ---------------------------------------------------------------------------
// parseBody — helper qui encapsule safeParse + formatage des erreurs
// ---------------------------------------------------------------------------

describe("parseBody — updateResourceSchema", () => {
  // parseBody retourne { success, data } ou { success, errors } typés
  it("retourne les données typées pour une mise à jour valide", () => {
    const result = parseBody(updateResourceSchema, {
      description: "Description mise à jour suffisamment longue.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toContain("mise à jour");
    }
  });
});
