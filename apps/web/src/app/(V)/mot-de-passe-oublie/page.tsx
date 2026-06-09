// =============================================================================
// VUE — Demande de réinitialisation mot de passe
// Appel : POST /api/auth/forgot-password { email }
// =============================================================================

"use client";

// Module : node_modules/react
import { useState } from "react";
// Module : node_modules/next/link
import Link from "next/link";
// Module : node_modules/next/image
import Image from "next/image";
// Style : src/app/(V)/mot-de-passe-oublie/forgot.module.css
import styles from "./forgot.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.message ?? "Une erreur est survenue.");
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
            {sent ? "Email envoyé !" : "Mot de passe oublié ?"}
          </p>
        </div>

        {/* Carte */}
        <div className={styles.card}>
          {sent ? (
            /* ── État succès ── */
            <div className={styles.successBox}>
              <div className={styles.successIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16l.19.92z"/>
                </svg>
              </div>
              <h2 className={styles.successTitle}>Vérifiez votre boîte mail</h2>
              <p className={styles.successDesc}>
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
                Il est valable pendant <strong>1 heure</strong>.
              </p>
              <p className={styles.successHint}>
                Vous n&apos;avez rien reçu ? Vérifiez vos spams ou{" "}
                <button className={styles.retryBtn} onClick={() => setSent(false)}>
                  réessayez
                </button>.
              </p>
            </div>
          ) : (
            /* ── Formulaire ── */
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.intro}>
                <div className={styles.introIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <p className={styles.introText}>
                  Saisissez l&apos;adresse e-mail associée à votre compte.<br />
                  Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="votre@email.fr"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? "Envoi en cours…" : "Envoyer le lien de réinitialisation"}
              </button>

              <p className={styles.switchText}>
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link href="/connexion" className={styles.switchLink}>
                  Se connecter
                </Link>
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
