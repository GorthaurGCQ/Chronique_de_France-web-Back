// =============================================================================
// COMPOSANT — Écran « accès refusé » (membre sans droit granulaire)
// =============================================================================

// Module : node_modules/next/link
import Link from "next/link";
// Composant : src/components_V/icons/AppIcon.tsx
import AppIcon from "@/components_V/icons/AppIcon";
// Style : src/components_V/accessScreens.module.css
import styles from "./accessScreens.module.css";

type Props = {
  sectionTitle?: string;
};

export default function AccessDeniedScreen({ sectionTitle }: Props) {
  const title = sectionTitle ? `${sectionTitle} — Accès refusé` : "Accès refusé";

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconDenied}`} aria-hidden="true">
          <AppIcon name="denied" size={32} />
        </div>
        <span className={styles.badge}>Permissions</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>
          Vous n&apos;avez pas l&apos;autorisation d&apos;accéder à cette section.
          Contactez un administrateur pour obtenir les droits nécessaires.
        </p>
        <div className={styles.actions}>
          <Link href="/profil" className={styles.btnPrimary}>
            Mon profil
          </Link>
          <Link href="/" className={styles.btnSecondary}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
