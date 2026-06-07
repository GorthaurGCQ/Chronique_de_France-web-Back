// =============================================================================
// COUCHE FRONT — Exemple d'appel HTTP vers le back (fetch → /api/favorites)
// =============================================================================

"use client"; // Ce composant s'exécute dans le navigateur (pas sur le serveur)

import { useState, useEffect } from "react";
// Hook session : sait si l'utilisateur est connecté (via cookies /api/auth)
import { useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import styles from "./BookmarkButton.module.css";

// Props typées reçues du composant parent (page ressource)
interface Props {
  resourceId: string;       // ID de la ressource à mettre en favori
  initialSaved?: boolean;   // État initial optionnel
  className?: string;       // Classe CSS optionnelle
}

export default function BookmarkButton({ resourceId, initialSaved = false, className }: Props) {
  const { data: session } = useSession(); // null si non connecté
  const router = useRouter();               // Navigation programmatique
  const [saved, setSaved]       = useState(initialSaved); // favori ou non
  const [loading, setLoading]   = useState(false);        // requête en cours
  const [showTip, setShowTip]   = useState(false);        // bulle de confirmation

  // Au chargement : si connecté, interroge le back pour savoir si déjà en favori
  useEffect(() => {
    if (!session) return; // pas de session → pas d'appel API
    fetch("/api/favorites") // GET vers route.ts (même origine = cookies envoyés)
      .then((r) => r.json()) // parse le corps JSON de la réponse
      .then((d) => {
        if (d.success) {
          // cherche si cette resourceId est dans la liste renvoyée par le back
          setSaved(d.data.some((f: { resourceId: string }) => f.resourceId === resourceId));
        }
      });
  }, [session, resourceId]); // re-exécute si session ou ressource change

  async function toggle() {
    if (!session) {
      router.push("/connexion"); // redirige vers login si anonyme
      return;
    }
    setLoading(true);
    const method = saved ? "DELETE" : "POST"; // DELETE = retirer, POST = ajouter
    await fetch("/api/favorites", {
      method,                                      // verbe HTTP
      headers: { "Content-Type": "application/json" }, // format du body
      body: JSON.stringify({ resourceId }),          // données envoyées au back
    });
    setSaved((prev) => !prev);   // met à jour l'UI immédiatement
    setShowTip(true);            // affiche le message
    setTimeout(() => setShowTip(false), 1800); // cache après 1,8 s
    setLoading(false);
  }

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <button
        type="button"
        className={`${styles.btn} ${saved ? styles.btnSaved : ""}`}
        onClick={toggle}           // clic → toggle() → fetch vers le back
        disabled={loading}         // désactivé pendant la requête
        aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={saved}
        title={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      {showTip && (
        <span className={styles.tip}>
          {saved ? "Ajouté aux favoris ★" : "Retiré"}
        </span>
      )}
    </div>
  );
}
