"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./connexion.module.css";

type Tab = "connexion" | "inscription";

export default function ConnexionPage() {
  const [tab, setTab] = useState<Tab>("connexion");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={styles.main}>
      {/* Background décoratif */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgShape1} />
        <div className={styles.bgShape2} />
      </div>

      <div className={styles.container}>
        {/* Logo + accroche */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink}>
            <svg width="28" height="28" viewBox="0 0 20 20" aria-hidden="true">
              <polygon points="10,1 19,10 10,19 1,10" fill="#b8933a" />
            </svg>
            <span className={styles.logoText}>CHRONIQUES DE FRANCE</span>
          </Link>
          <p className={styles.tagline}>
            {tab === "connexion"
              ? "Bon retour parmi nous."
              : "Rejoignez la communauté."}
          </p>
        </div>

        {/* Carte */}
        <div className={styles.card}>
          {/* Onglets */}
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={tab === "connexion"}
              className={`${styles.tab} ${tab === "connexion" ? styles.tabActive : ""}`}
              onClick={() => setTab("connexion")}
            >
              Se connecter
            </button>
            <button
              role="tab"
              aria-selected={tab === "inscription"}
              className={`${styles.tab} ${tab === "inscription" ? styles.tabActive : ""}`}
              onClick={() => setTab("inscription")}
            >
              Créer un compte
            </button>
          </div>

          {/* ── FORMULAIRE CONNEXION ─────────────────────────── */}
          {tab === "connexion" && (
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email-login">
                  Adresse e-mail
                </label>
                <input
                  id="email-login"
                  type="email"
                  autoComplete="email"
                  placeholder="votre@email.fr"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="password-login">
                    Mot de passe
                  </label>
                  <button type="button" className={styles.forgotLink}>
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    id="password-login"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={styles.input}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <label className={styles.checkboxRow}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.checkboxLabel}>Se souvenir de moi</span>
              </label>

              <button type="submit" className={styles.btnPrimary}>
                Se connecter
              </button>

              <div className={styles.divider}>
                <span>ou continuer avec</span>
              </div>

              <div className={styles.socialRow}>
                <button type="button" className={styles.socialBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" className={styles.socialBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              <p className={styles.switchText}>
                Pas encore de compte ?{" "}
                <button type="button" className={styles.switchLink} onClick={() => setTab("inscription")}>
                  Créer un compte
                </button>
              </p>
            </form>
          )}

          {/* ── FORMULAIRE INSCRIPTION ───────────────────────── */}
          {tab === "inscription" && (
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="prenom">Prénom</label>
                  <input
                    id="prenom"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Jean"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="nom">Nom</label>
                  <input
                    id="nom"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Dupont"
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email-register">
                  Adresse e-mail
                </label>
                <input
                  id="email-register"
                  type="email"
                  autoComplete="email"
                  placeholder="votre@email.fr"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="password-register">
                  Mot de passe
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="password-register"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="8 caractères minimum"
                    className={styles.input}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="confirm-password">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={styles.input}
                  required
                />
              </div>

              <label className={styles.checkboxRow}>
                <input type="checkbox" className={styles.checkbox} required />
                <span className={styles.checkboxLabel}>
                  J'accepte les{" "}
                  <a href="#" className={styles.inlineLink}>conditions d'utilisation</a>
                  {" "}et la{" "}
                  <a href="#" className={styles.inlineLink}>politique de confidentialité</a>
                </span>
              </label>

              <button type="submit" className={styles.btnPrimary}>
                Créer mon compte
              </button>

              <p className={styles.switchText}>
                Déjà un compte ?{" "}
                <button type="button" className={styles.switchLink} onClick={() => setTab("connexion")}>
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>

        <p className={styles.footer}>
          <Link href="/" className={styles.footerLink}>← Retour à l'accueil</Link>
        </p>
      </div>
    </main>
  );
}
