// =============================================================================
// COMPOSANT — Écran « compte requis » (visiteur non connecté)
// =============================================================================

// Module : node_modules/next/link
import Link from "next/link";
// Style : src/components_V/accessScreens.module.css
import styles from "./accessScreens.module.css";

type Props = {
  sectionTitle?: string;
};

export default function LoginRequiredScreen({ sectionTitle }: Props) {
  const title = sectionTitle ? `${sectionTitle} — Compte requis` : "Compte requis";

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          🔒
        </div>
        <span className={styles.badge}>Accès membres</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>
          Cette section est réservée aux membres inscrits. Créez un compte ou
          connectez-vous pour y accéder.
        </p>
        <div className={styles.actions}>
          <Link href="/connexion" className={styles.btnPrimary}>
            Se connecter
          </Link>
          <Link href="/connexion?mode=register" className={styles.btnSecondary}>
            Créer un compte
          </Link>
        </div>
        <Link href="/" className={styles.backLink}>
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
