// Module : node_modules/vitest
import { describe, it, expect } from "vitest";

// Modèle : src/models_M/schemas/validation.ts
import {
  createResourceSchema,
  createEventSchema,
  paginationSchema,
  parseBody,
} from "@/models_M/schemas/validation";

// ---------------------------------------------------------------------------
// createResourceSchema
// ---------------------------------------------------------------------------

describe("createResourceSchema", () => {
  const base = {
    titre: "Un titre valide",
    description: "Une description suffisamment longue.",
    contenu: "A".repeat(50),
    type: "CHRONOLOGIE" as const,
  };

  it("accepte des données valides", () => {
    expect(createResourceSchema.safeParse(base).success).toBe(true);
  });

  it("rejette un titre trop court (< 3 caractères)", () => {
    expect(createResourceSchema.safeParse({ ...base, titre: "AB" }).success).toBe(false);
  });

  it("rejette une description trop courte (< 10 caractères)", () => {
    expect(createResourceSchema.safeParse({ ...base, description: "Court" }).success).toBe(false);
  });

  it("rejette un contenu trop court (< 50 caractères)", () => {
    expect(createResourceSchema.safeParse({ ...base, contenu: "Court" }).success).toBe(false);
  });

  it("rejette un type invalide", () => {
    expect(createResourceSchema.safeParse({ ...base, type: "INCONNU" }).success).toBe(false);
  });

  it("accepte tous les types valides", () => {
    const types = ["CHRONOLOGIE", "FICHE_THEMATIQUE", "DOCUMENT_EDUCATIF", "PUBLICATION"] as const;
    for (const type of types) {
      expect(createResourceSchema.safeParse({ ...base, type }).success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// createEventSchema
// ---------------------------------------------------------------------------

describe("createEventSchema", () => {
  const base = {
    titre: "Conférence annuelle",
    description: "Une description suffisamment longue.",
    lieu: "Paris",
    date: new Date("2026-09-15").toISOString(),
  };

  it("accepte des données valides", () => {
    expect(createEventSchema.safeParse(base).success).toBe(true);
  });

  it("rejette un titre trop court", () => {
    expect(createEventSchema.safeParse({ ...base, titre: "AB" }).success).toBe(false);
  });

  it("rejette un lieu trop court", () => {
    expect(createEventSchema.safeParse({ ...base, lieu: "A" }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// paginationSchema
// ---------------------------------------------------------------------------

describe("paginationSchema", () => {
  it("applique les valeurs par défaut (page=1, limit=10)", () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  it("accepte des valeurs personnalisées", () => {
    const result = paginationSchema.safeParse({ page: "3", limit: "20" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(20);
    }
  });

  it("rejette une limite supérieure à 100", () => {
    expect(paginationSchema.safeParse({ limit: "101" }).success).toBe(false);
  });

  it("rejette une page inférieure à 1", () => {
    expect(paginationSchema.safeParse({ page: "0" }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// parseBody
// ---------------------------------------------------------------------------

describe("parseBody", () => {
  const resourcePayload = {
    titre: "Un titre valide",
    description: "Une description suffisamment longue.",
    contenu: "A".repeat(50),
    type: "CHRONOLOGIE" as const,
  };

  it("retourne success:true avec des données valides", () => {
    const result = parseBody(createResourceSchema, resourcePayload);
    expect(result.success).toBe(true);
  });

  it("retourne success:false avec des données invalides", () => {
    const result = parseBody(createResourceSchema, { ...resourcePayload, titre: "AB" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
    }
  });

  it("retourne les erreurs indexées par champ", () => {
    const result = parseBody(createResourceSchema, {
      titre: "AB",
      description: "Court",
      contenu: "Court",
      type: "INCONNU",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toHaveProperty("titre");
      expect(result.errors).toHaveProperty("description");
      expect(result.errors).toHaveProperty("contenu");
    }
  });
});
