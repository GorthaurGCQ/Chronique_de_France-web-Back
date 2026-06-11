/**
 * Tests d'intégration — route /api/favorites
 *
 * Auth (Better Auth) et BDD (Drizzle) sont mockées pour isoler
 * le comportement HTTP de la route sans dépendre de Supabase.
 * Couvre GET (liste), POST (ajout) et DELETE (suppression).
 */

// Module : node_modules/vitest
import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — session utilisateur
// ---------------------------------------------------------------------------

/** Simule auth.api.getSession() — retourne null ou un objet user */
const mockGetSession = vi.fn();

// ---------------------------------------------------------------------------
// Helpers — chaînage Drizzle (select / insert)
// ---------------------------------------------------------------------------

/** Reproduit le chaînage .from().where().orderBy() d'un select Drizzle */
function createSelectChain<T>(resolved: T) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue(resolved),
  };
  return chain;
}

/** Reproduit .values().onConflictDoNothing().returning() d'un insert Drizzle */
function createInsertChain(resolved: { id: string } | null) {
  return {
    values: vi.fn().mockReturnValue({
      onConflictDoNothing: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue(resolved ? [resolved] : []),
      }),
    }),
  };
}

// ---------------------------------------------------------------------------
// Mocks — opérations BDD
// ---------------------------------------------------------------------------

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

// Mock Better Auth — remplace getSession par notre spy
vi.mock("@/lib/auth/auth", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

// Mock Next.js headers() — requis par la route pour lire les cookies
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock Drizzle db — délègue aux spies mockSelect / mockInsert / etc.
vi.mock("@/models_M/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    insert: (...args: unknown[]) => mockInsert(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

// ---------------------------------------------------------------------------
// GET /api/favorites — récupérer la liste des favoris
// ---------------------------------------------------------------------------

describe("GET /api/favorites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Sans session → 401 Unauthorized
  it("retourne 401 si l'utilisateur n'est pas connecté", async () => {
    mockGetSession.mockResolvedValue(null);
    const { GET } = await import("@/app/(C)/api/favorites/route");

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/authentifié/i);
  });

  // Session valide + select mocké → 200 avec tableau data
  it("retourne 200 et la liste des favoris si connecté", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1", email: "test@example.com" },
    });
    mockSelect.mockReturnValue(
      createSelectChain([
        {
          id: "fav-1",
          resourceId: "res-1",
          titre: "Ressource test",
          description: "Description",
          type: "CHRONOLOGIE",
          timeline: "ANTIQUITE",
          domaine: "PATRIMOINE_HISTOIRE",
          thumbnailUrl: null,
          authorName: "Auteur",
          note: null,
          savedAt: new Date(),
        },
      ]),
    );

    const { GET } = await import("@/app/(C)/api/favorites/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].titre).toBe("Ressource test");
  });
});

// ---------------------------------------------------------------------------
// POST /api/favorites — ajouter un favori
// ---------------------------------------------------------------------------

describe("POST /api/favorites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Body sans resourceId → 400 Bad Request
  it("retourne 400 si resourceId est absent", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1" },
    });

    const { POST } = await import("@/app/(C)/api/favorites/route");
    const res = await POST(
      new Request("http://localhost/api/favorites", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  // Insert réussi → 201 Created avec l'id du favori
  it("retourne 201 après ajout d'un favori", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1" },
    });
    mockInsert.mockReturnValue(createInsertChain({ id: "fav-new" }));

    const { POST } = await import("@/app/(C)/api/favorites/route");
    const res = await POST(
      new Request("http://localhost/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: "res-42" }),
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe("fav-new");
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/favorites — retirer un favori
// ---------------------------------------------------------------------------

describe("DELETE /api/favorites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Suppression réussie → 200 OK
  it("retourne 200 après suppression", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1" },
    });
    mockDelete.mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    });

    const { DELETE } = await import("@/app/(C)/api/favorites/route");
    const res = await DELETE(
      new Request("http://localhost/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: "res-42" }),
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });
});
