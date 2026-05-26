import { describe, it, expect } from "vitest";

import {
  updateResourceSchema,
  updateUserSchema,
  resourceQuerySchema,
  eventQuerySchema,
  parseBody,
} from "@/lib/validation";

describe("updateResourceSchema", () => {
  it("accepte un objet vide (tous les champs optionnels)", () => {
    expect(updateResourceSchema.safeParse({}).success).toBe(true);
  });

  it("accepte une mise à jour partielle du titre", () => {
    const result = updateResourceSchema.safeParse({ titre: "Nouveau titre" });
    expect(result.success).toBe(true);
  });

  it("rejette un titre trop court même en mise à jour partielle", () => {
    expect(updateResourceSchema.safeParse({ titre: "AB" }).success).toBe(false);
  });
});

describe("updateUserSchema", () => {
  it("accepte une mise à jour du rôle ADMIN", () => {
    expect(updateUserSchema.safeParse({ role: "ADMIN" }).success).toBe(true);
  });

  it("rejette un rôle inconnu", () => {
    expect(updateUserSchema.safeParse({ role: "SUPERUSER" }).success).toBe(false);
  });

  it("rejette un email invalide", () => {
    expect(updateUserSchema.safeParse({ email: "pas-email" }).success).toBe(false);
  });
});

describe("resourceQuerySchema", () => {
  it("applique pagination par défaut avec filtre type optionnel", () => {
    const result = resourceQuerySchema.safeParse({ type: "CHRONOLOGIE" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
      expect(result.data.type).toBe("CHRONOLOGIE");
    }
  });

  it("accepte un paramètre search", () => {
    const result = resourceQuerySchema.safeParse({ search: "révolution" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe("révolution");
    }
  });
});

describe("eventQuerySchema", () => {
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

describe("parseBody — updateResourceSchema", () => {
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
