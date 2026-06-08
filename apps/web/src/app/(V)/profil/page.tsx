// =============================================================================
// VUE — Profil utilisateur (déconnexion, suppression de compte)
// Appels : signOut(), authClient.deleteUser() → /api/auth/*
// =============================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut, authClient } from "@/lib/auth/auth-client";
import styles from "./profil.module.css";

export default function ProfilPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    setError("");
    try {
      const res = await authClient.deleteUser();
      if (res.error) {
        setError(res.error.message ?? "Erreur lors de la suppression.");
        setDeleteLoading(false);
        return;
      }
      router.push("/");
    } catch {
      setError("Une erreur est survenue. Réessayez.");
      setDeleteLoading(false);
    }
  }

  if (isPending) {
    return (
      <main className={styles.main}>
        <p className={styles.loading}>Chargement…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.main}>
        <div className={styles.notConnected}>
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <Link href="/connexion" className={styles.btnPrimary}>
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  const userInitial = session.user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mon profil</h1>

        {/* Carte infos */}
        <div className={styles.card}>
          <div className={styles.avatarLarge}>{userInitial}</div>
          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Nom</span>
              <span className={styles.infoValue}>{session.user.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{session.user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email vérifié</span>
              <span className={styles.infoValue}>
                {session.user.emailVerified ? (
                  <span className={styles.badgeOk}>Oui</span>
                ) : (
                  <span className={styles.badgePending}>Non</span>
                )}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Rôle</span>
              <span className={styles.infoValue}>
                {session.user.role === "admin" ? (
                  <span className={styles.badgeAdmin}>Administrateur</span>
                ) : (
                  <span className={styles.badgeUser}>Membre</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.btnSignOut} onClick={handleSignOut}>
            Se déconnecter
          </button>
        </div>

        {/* Zone danger */}
        <div className={styles.danger}>
          <h2 className={styles.dangerTitle}>Zone danger</h2>
          <p className={styles.dangerDesc}>
            La suppression de votre compte est irréversible. Toutes vos données seront effacées.
          </p>

          {error && <p className={styles.errorMsg}>{error}</p>}

          {!deleteConfirm ? (
            <button className={styles.btnDelete} onClick={() => setDeleteConfirm(true)}>
              Supprimer mon compte
            </button>
          ) : (
            <div className={styles.confirmBox}>
              <p className={styles.confirmText}>Êtes-vous sûr ? Cette action est irréversible.</p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.btnDeleteConfirm}
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Suppression…" : "Oui, supprimer définitivement"}
                </button>
                <button
                  className={styles.btnCancel}
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleteLoading}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
