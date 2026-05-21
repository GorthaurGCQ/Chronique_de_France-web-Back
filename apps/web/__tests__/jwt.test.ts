import { describe, it, expect } from 'vitest';

import { AuthError, requireRole, handleAuthError, signJWT, verifyJWT } from '../lib/jwt';

// ---------------------------------------------------------------------------
// AuthError
// ---------------------------------------------------------------------------

describe('AuthError', () => {
  it('crée une erreur avec le bon message', () => {
    const err = new AuthError('Accès interdit.', 403);
    expect(err.message).toBe('Accès interdit.');
  });

  it('utilise le statusCode fourni', () => {
    const err = new AuthError('Non autorisé.', 401);
    expect(err.statusCode).toBe(401);
  });

  it('utilise 401 comme statusCode par défaut', () => {
    const err = new AuthError('Erreur.');
    expect(err.statusCode).toBe(401);
  });

  it('est une instance de Error', () => {
    const err = new AuthError('Erreur.');
    expect(err).toBeInstanceOf(Error);
  });

  it('a le nom "AuthError"', () => {
    const err = new AuthError('Erreur.');
    expect(err.name).toBe('AuthError');
  });
});

// ---------------------------------------------------------------------------
// requireRole
// ---------------------------------------------------------------------------

describe('requireRole', () => {
  const userPayload = { userId: '1', email: 'user@test.com', role: 'USER' as const };
  const adminPayload = { userId: '2', email: 'admin@test.com', role: 'ADMIN' as const };

  it('ne lève pas d\'erreur si le rôle est autorisé', () => {
    expect(() => requireRole(['USER'])(userPayload)).not.toThrow();
  });

  it('autorise plusieurs rôles', () => {
    expect(() => requireRole(['USER', 'ADMIN'])(adminPayload)).not.toThrow();
  });

  it('lève une AuthError si le rôle est refusé', () => {
    expect(() => requireRole(['ADMIN'])(userPayload)).toThrow(AuthError);
  });

  it('lève une erreur 403 en cas de refus', () => {
    try {
      requireRole(['ADMIN'])(userPayload);
    } catch (e) {
      expect(e).toBeInstanceOf(AuthError);
      expect((e as AuthError).statusCode).toBe(403);
    }
  });
});

// ---------------------------------------------------------------------------
// handleAuthError
// ---------------------------------------------------------------------------

describe('handleAuthError', () => {
  it('retourne un statut 401 pour une AuthError 401', async () => {
    const res = handleAuthError(new AuthError('Non autorisé.', 401));
    expect(res.status).toBe(401);
  });

  it('retourne un statut 403 pour une AuthError 403', async () => {
    const res = handleAuthError(new AuthError('Accès refusé.', 403));
    expect(res.status).toBe(403);
  });

  it('retourne un statut 500 pour une erreur inconnue', async () => {
    const res = handleAuthError(new Error('Erreur inconnue'));
    expect(res.status).toBe(500);
  });

  it('retourne success:false dans le body', async () => {
    const res = handleAuthError(new AuthError('Erreur.', 401));
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// signJWT / verifyJWT
// ---------------------------------------------------------------------------

describe('signJWT / verifyJWT', () => {
  const payload = { userId: '42', email: 'test@example.com', role: 'USER' as const };

  it('génère un token en string', () => {
    const token = signJWT(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('vérifie un token valide et retourne le payload', () => {
    const token = signJWT(payload);
    const req = new Request('http://localhost', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const decoded = verifyJWT(req);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('lève une AuthError 401 si le header Authorization est absent', () => {
    const req = new Request('http://localhost');
    expect(() => verifyJWT(req)).toThrow(AuthError);
  });

  it('lève une AuthError 401 si le token est invalide', () => {
    const req = new Request('http://localhost', {
      headers: { Authorization: 'Bearer token.invalide.ici' },
    });
    expect(() => verifyJWT(req)).toThrow(AuthError);
  });

});
