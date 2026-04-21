import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 4 columns */}
        <div className={styles.columns}>
          {/* Col 1 — Logo + description */}
          <div className={styles.col}>
            <div className={styles.footerLogo}>
              <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                <polygon points="10,1 19,10 10,19 1,10" fill="#b8933a" />
              </svg>
              <span>CHRONIQUES DE FRANCE</span>
            </div>
            <p className={styles.footerDesc}>
              Association culturelle dédiée à la valorisation et à la
              transmission du patrimoine historique français.
            </p>
            <div className={styles.socialIcons}>
              <span title="Site web" aria-label="Site web">🌐</span>
              <span title="Messagerie" aria-label="Messagerie">💬</span>
              <span title="Email" aria-label="Email">✉️</span>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>NAVIGATION</h3>
            <ul className={styles.colLinks}>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/bibliotheque">Bibliothèque</Link></li>
              <li><Link href="/evenement">Calendrier Événements</Link></li>
              <li><Link href="/a-propos">Notre Équipe</Link></li>
            </ul>
          </div>

          {/* Col 3 — Juridique */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>JURIDIQUE</h3>
            <ul className={styles.colLinks}>
              <li><Link href="#">Mentions Légales</Link></li>
              <li><Link href="#">Politique de Confidentialité</Link></li>
              <li><Link href="#">Statuts</Link></li>
              <li><Link href="#">Données Personnelles</Link></li>
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>CONTACT</h3>
            <address className={styles.contactInfo}>
              <p>📍 12 rue du Patrimoine, 75001 Paris</p>
              <p>📞 +33 (0)1 23 45 67 89</p>
              <p>✉️ contact@chroniques-de-france.fr</p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <span>© {new Date().getFullYear()} Chroniques de France. Tous droits réservés.</span>
          <span>Fait avec passion à Paris</span>
          <span>Agrément Ministériel n°45-82</span>
        </div>
      </div>
    </footer>
  );
}
