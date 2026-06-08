// =============================================================================
// VUE — Nouveau mot de passe (lien reçu par email)
// Appel : Better Auth reset via token URL (?token=)
// =============================================================================

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth/auth-client";
import styles from "./reset.module.css";

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");

  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");

  // Vérification de la force du mot de passe
  const strength = (() => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8)  score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ["", "Très faible", "Faible", "Moyen", "Fort", "Très fort"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"][strength];

  useEffect(() => {
    if (!token) setError("Lien invalide ou expiré. Demandez un nouveau lien.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!token) {
      setError("Lien invalide. Demandez un nouveau lien de réinitialisation.");
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.resetPassword({ newPassword: password, token });
      if (res.error) {
        setError(res.error.message ?? "Lien expiré. Demandez un nouveau lien.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/connexion"), 3000);
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgShape1} />
        <div className={styles.bgShape2} />
      </div>

      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/CDF_L.png"
              alt="Chronique de France"
              height={52}
              width={180}
              style={{ width: "auto", height: "52px", objectFit: "contain" }}
              priority
            />
            <span className={styles.logoText}>Chronique de France</span>
          </Link>
          <p className={styles.tagline}>
            {done ? "Mot de passe mis à jour !" : "Nouveau mot de passe"}
          </p>
        </div>

        {/* Carte */}
        <div className={styles.card}>
          {done ? (
            /* ── Succès ── */
            <div className={styles.successBox}>
              <div className={styles.successIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className={styles.successTitle}>Mot de passe mis à jour</h2>
              <p className={styles.successDesc}>
                Votre mot de passe a été réinitialisé avec succès.<br />
                Vous allez être redirigé vers la page de connexion…
              </p>
              <Link href="/connexion" className={styles.btnPrimary} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Se connecter maintenant →
              </Link>
            </div>
          ) : !token ? (
            /* ── Lien invalide ── */
            <div className={styles.errorBox}>
              <div className={styles.errorIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2 className={styles.errorTitle}>Lien invalide</h2>
              <p className={styles.errorDesc}>Ce lien est invalide ou a expiré.</p>
              <Link href="/mot-de-passe-oublie" className={styles.btnPrimary} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Demander un nouveau lien
              </Link>
            </div>
          ) : (
            /* ── Formulaire ── */
            <form className={styles.form} onSubmit={handleSubmit}>
              <p className={styles.formHint}>
                Choisissez un nouveau mot de passe sécurisé pour votre compte.
              </p>

              {error && <p className={styles.errorMsg}>{error}</p>}

              {/* Nouveau mot de passe */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Nouveau mot de passe</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    className={styles.input}
                    placeholder="8 caractères minimum"
                    required
                    minLength={8}
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd((v) => !v)} aria-label={showPwd ? "Masquer" : "Afficher"}>
                    {showPwd
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>

                {/* Jauge de force */}
                {password.length > 0 && (
                  <div className={styles.strengthWrapper}>
                    <div className={styles.strengthBar}>
                      {[1,2,3,4,5].map((i) => (
                        <div
                          key={i}
                          className={styles.strengthSegment}
                          style={{ background: i <= strength ? strengthColor : "#e5e7eb" }}
                        />
                      ))}
                    </div>
                    <span className={styles.strengthLabel} style={{ color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirmation */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="confirm">Confirmer le mot de passe</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    className={`${styles.input} ${confirm.length > 0 && confirm !== password ? styles.inputError : ""} ${confirm.length > 0 && confirm === password ? styles.inputSuccess : ""}`}
                    placeholder="••••••••"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "Masquer" : "Afficher"}>
                    {showConfirm
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {confirm.length > 0 && confirm !== password && (
                  <p className={styles.fieldError}>Les mots de passe ne correspondent pas.</p>
                )}
                {confirm.length > 0 && confirm === password && (
                  <p className={styles.fieldOk}>✓ Les mots de passe correspondent.</p>
                )}
              </div>

              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading || password !== confirm || password.length < 8}
              >
                {loading ? "Mise à jour…" : "Réinitialiser le mot de passe"}
              </button>

              <p className={styles.switchText}>
                <Link href="/connexion" className={styles.switchLink}>← Retour à la connexion</Link>
              </p>
            </form>
          )}
        </div>

        <p className={styles.footer}>
          <Link href="/" className={styles.footerLink}>← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
