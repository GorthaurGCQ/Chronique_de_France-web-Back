"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import styles from "./dashboard.module.css";

// ── Types ────────────────────────────────────────────────────────────────────

type Favorite = {
  id: string;
  resourceId: string;
  titre: string;
  description: string;
  type: string;
  timeline: string | null;
  thumbnailUrl: string | null;
  authorName: string | null;
  savedAt: string;
};

const TIMELINE_LABELS: Record<string, string> = {
  ANTIQUITE: "Antiquité", MOYEN_AGE: "Moyen-Âge", RENAISSANCE: "Renaissance",
  ANCIEN_REGIME: "Ancien Régime", REVOLUTION: "Révolution",
  XIXE_SIECLE: "XIXe siècle", CONTEMPORAIN: "Contemporain",
};

const TIMELINE_COLORS: Record<string, string> = {
  ANTIQUITE: "#6b6b2e", MOYEN_AGE: "#3a2318", RENAISSANCE: "#7a3b1e",
  ANCIEN_REGIME: "#1a3f4a", REVOLUTION: "#5a1820",
  XIXE_SIECLE: "#253560", CONTEMPORAIN: "#2d2d2d",
};

const TYPE_LABELS: Record<string, string> = {
  CHRONOLOGIE: "Chronologie", FICHE_THEMATIQUE: "Fiche thématique",
  DOCUMENT_EDUCATIF: "Document éducatif", PUBLICATION: "Publication",
};

// ── Composant ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [favorites, setFavorites]     = useState<Favorite[]>([]);
  const [favsLoading, setFavsLoading] = useState(true);

  // Édition du nom
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue]     = useState("");
  const [nameSaving, setNameSaving]   = useState(false);
  const [nameMsg, setNameMsg]         = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // ── Redirection si non connecté ──────────────────────────────────────────
  useEffect(() => {
    if (!isPending && !session) router.replace("/connexion");
  }, [isPending, session, router]);

  // ── Chargement des favoris ───────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => { if (d.success) setFavorites(d.data); })
      .finally(() => setFavsLoading(false));
  }, [session]);

  // ── Initialise le champ nom ──────────────────────────────────────────────
  useEffect(() => {
    if (session?.user?.name) setNameValue(session.user.name);
  }, [session]);

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus();
  }, [editingName]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function saveName() {
    setNameSaving(true);
    setNameMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameValue }),
    });
    const data = await res.json();
    if (data.success) {
      setNameMsg("Nom mis à jour ✓");
      setEditingName(false);
      router.refresh();
    } else {
      setNameMsg(data.message ?? "Erreur.");
    }
    setNameSaving(false);
  }

  async function removeFavorite(resourceId: string) {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    });
    setFavorites((prev) => prev.filter((f) => f.resourceId !== resourceId));
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDeleteAccount() {
    if (!confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) return;
    await authClient.deleteUser();
    router.push("/");
    router.refresh();
  }

  // ── Chargement ───────────────────────────────────────────────────────────
  if (isPending || !session) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
      </div>
    );
  }

  const user = session.user;
  const initial = user.name?.charAt(0).toUpperCase() ?? "?";
  const joinDate = new Date(user.createdAt ?? Date.now()).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  const totalReadTime = favorites.length * 3; // estimation (3 min / ressource)

  return (
    <main className={styles.page}>
      <div className={styles.inner}>

        {/* ── EN-TÊTE ── */}
        <div className={styles.hero}>
          <div className={styles.avatarLg}>{initial}</div>
          <div className={styles.heroInfo}>
            <h1 className={styles.heroName}>{user.name}</h1>
            <p className={styles.heroEmail}>{user.email}</p>
            <p className={styles.heroJoin}>Membre depuis le {joinDate}</p>
          </div>
        </div>

        {/* ── GRILLE PRINCIPALE ── */}
        <div className={styles.grid}>

          {/* ── COLONNE GAUCHE ── */}
          <div className={styles.col}>

            {/* Infos personnelles */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>👤</span> Informations personnelles
              </h2>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Nom affiché</label>
                {editingName ? (
                  <div className={styles.fieldEdit}>
                    <input
                      ref={nameInputRef}
                      className={styles.fieldInput}
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                    />
                    <button className={styles.btnSave} onClick={saveName} disabled={nameSaving}>
                      {nameSaving ? "…" : "Enregistrer"}
                    </button>
                    <button className={styles.btnCancel} onClick={() => setEditingName(false)}>Annuler</button>
                  </div>
                ) : (
                  <div className={styles.fieldValue}>
                    <span>{user.name}</span>
                    <button className={styles.btnEdit} onClick={() => setEditingName(true)}>✏️ Modifier</button>
                  </div>
                )}
                {nameMsg && <p className={styles.nameMsg}>{nameMsg}</p>}
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Adresse e-mail</label>
                <div className={styles.fieldValue}>
                  <span>{user.email}</span>
                  <span className={styles.badge}>Non modifiable</span>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Rôle</label>
                <div className={styles.fieldValue}>
                  <span className={`${styles.roleBadge} ${user.role === "admin" ? styles.roleBadgeAdmin : styles.roleBadgeUser}`}>
                    {user.role === "admin" ? "Administrateur" : "Membre"}
                  </span>
                </div>
              </div>
            </section>

            {/* Statistiques */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>📊</span> Statistiques
              </h2>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{favorites.length}</span>
                  <span className={styles.statLabel}>Ressources sauvegardées</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{totalReadTime} min</span>
                  <span className={styles.statLabel}>Temps de lecture estimé</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    {Math.floor((Date.now() - new Date(user.createdAt ?? Date.now()).getTime()) / (1000 * 60 * 60 * 24))}j
                  </span>
                  <span className={styles.statLabel}>Jours d&apos;ancienneté</span>
                </div>
              </div>
            </section>

            {/* Actions du compte */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>⚙️</span> Mon compte
              </h2>
              <div className={styles.accountActions}>
                {user.role === "admin" && (
                  <Link href="/admin" className={styles.btnAccount}>
                    🛡️ Accéder au panneau admin
                  </Link>
                )}
                <button className={styles.btnAccount} onClick={handleSignOut}>
                  🚪 Se déconnecter
                </button>
                <button className={`${styles.btnAccount} ${styles.btnAccountDanger}`} onClick={handleDeleteAccount}>
                  🗑️ Supprimer mon compte
                </button>
              </div>
            </section>
          </div>

          {/* ── COLONNE DROITE : FAVORIS ── */}
          <div className={styles.col}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>🔖</span> Ressources sauvegardées
                <span className={styles.countBadge}>{favorites.length}</span>
              </h2>

              {favsLoading ? (
                <p className={styles.emptyMsg}>Chargement…</p>
              ) : favorites.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyMsg}>Aucune ressource sauvegardée pour l&apos;instant.</p>
                  <p className={styles.emptyHint}>
                    Cliquez sur l&apos;icône 🔖 sur les cards pour sauvegarder des ressources.
                  </p>
                  <Link href="/bibliotheque" className={styles.btnBrowse}>
                    Explorer la bibliothèque →
                  </Link>
                </div>
              ) : (
                <ul className={styles.favList}>
                  {favorites.map((fav) => {
                    const bg = TIMELINE_COLORS[fav.timeline ?? ""] ?? "#2d2d2d";
                    return (
                      <li key={fav.id} className={styles.favItem}>
                        <div
                          className={styles.favThumb}
                          style={
                            fav.thumbnailUrl
                              ? { backgroundImage: `url(${fav.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                              : { background: bg }
                          }
                        >
                          {fav.timeline && (
                            <span className={styles.favEpoque}>
                              {TIMELINE_LABELS[fav.timeline] ?? fav.timeline}
                            </span>
                          )}
                        </div>
                        <div className={styles.favBody}>
                          <span className={styles.favType}>{TYPE_LABELS[fav.type] ?? fav.type}</span>
                          <Link href={`/bibliotheque/${fav.resourceId}`} className={styles.favTitle}>
                            {fav.titre}
                          </Link>
                          <p className={styles.favDesc}>{fav.description}</p>
                          <div className={styles.favFooter}>
                            <span className={styles.favDate}>
                              Sauvegardé le {new Date(fav.savedAt).toLocaleDateString("fr-FR")}
                            </span>
                            <button
                              className={styles.favRemove}
                              onClick={() => removeFavorite(fav.resourceId)}
                              aria-label="Retirer des favoris"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
