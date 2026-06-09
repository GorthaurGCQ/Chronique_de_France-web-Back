// =============================================================================
// COMPOSANT — Enregistre silencieusement une consultation de ressource
// Appel : POST /api/profile/history { resourceId } (non bloquant)
// =============================================================================

"use client";

// Module : node_modules/react
import { useEffect } from "react";

export default function ViewTracker({ resourceId }: { resourceId: string }) {
  useEffect(() => {
    // Envoie la vue au montage du composant (page ressource ouverte)
    fetch("/api/profile/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    }).catch(() => {/* échec silencieux — ne bloque pas l'affichage */});
  }, [resourceId]);

  return null; // Composant invisible (effet de bord uniquement)
}
