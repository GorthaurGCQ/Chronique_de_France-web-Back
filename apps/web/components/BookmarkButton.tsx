"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import styles from "./BookmarkButton.module.css";

interface Props {
  resourceId: string;
  initialSaved?: boolean;
  className?: string;
}

export default function BookmarkButton({ resourceId, initialSaved = false, className }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved]       = useState(initialSaved);
  const [loading, setLoading]   = useState(false);
  const [showTip, setShowTip]   = useState(false);

  // Vérifie si la ressource est déjà en favori
  useEffect(() => {
    if (!session) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSaved(d.data.some((f: { resourceId: string }) => f.resourceId === resourceId));
        }
      });
  }, [session, resourceId]);

  async function toggle() {
    if (!session) {
      router.push("/connexion");
      return;
    }
    setLoading(true);
    const method = saved ? "DELETE" : "POST";
    await fetch("/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    });
    setSaved((prev) => !prev);
    setShowTip(true);
    setTimeout(() => setShowTip(false), 1800);
    setLoading(false);
  }

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <button
        type="button"
        className={`${styles.btn} ${saved ? styles.btnSaved : ""}`}
        onClick={toggle}
        disabled={loading}
        aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={saved}
        title={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        {/* Étoile */}
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
