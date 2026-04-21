import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Badge */}
        <span className={styles.badge}>INSTITUTION CULTURELLE</span>

        {/* Placeholder image — château SVG */}
        <div className={styles.imagePlaceholder} aria-hidden="true">
          <svg
            className={styles.castleSvg}
            viewBox="0 0 600 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Tours latérales gauche */}
            <rect x="20" y="80" width="50" height="120" fill="#0d1929" />
            <rect x="10" y="60" width="20" height="30" fill="#0d1929" />
            <rect x="35" y="55" width="20" height="35" fill="#0d1929" />
            <rect x="60" y="60" width="20" height="30" fill="#0d1929" />
            {/* Corps central */}
            <rect x="120" y="100" width="360" height="100" fill="#0d1929" />
            <rect x="160" y="70" width="60" height="130" fill="#0d1929" />
            <rect x="270" y="50" width="60" height="150" fill="#0d1929" />
            <rect x="380" y="70" width="60" height="130" fill="#0d1929" />
            {/* Créneaux */}
            <rect x="160" y="55" width="12" height="20" fill="#0d1929" />
            <rect x="178" y="55" width="12" height="20" fill="#0d1929" />
            <rect x="196" y="55" width="12" height="20" fill="#0d1929" />
            <rect x="270" y="35" width="12" height="20" fill="#0d1929" />
            <rect x="288" y="35" width="12" height="20" fill="#0d1929" />
            <rect x="306" y="35" width="12" height="20" fill="#0d1929" />
            <rect x="380" y="55" width="12" height="20" fill="#0d1929" />
            <rect x="398" y="55" width="12" height="20" fill="#0d1929" />
            <rect x="416" y="55" width="12" height="20" fill="#0d1929" />
            {/* Tours latérales droite */}
            <rect x="530" y="80" width="50" height="120" fill="#0d1929" />
            <rect x="520" y="60" width="20" height="30" fill="#0d1929" />
            <rect x="545" y="55" width="20" height="35" fill="#0d1929" />
            <rect x="570" y="60" width="20" height="30" fill="#0d1929" />
            {/* Porche */}
            <rect x="280" y="130" width="40" height="70" rx="20" fill="#0a1520" />
          </svg>
        </div>

        {/* Titre */}
        <h1 className={styles.title}>
          <span className={styles.titleWhite}>Préserver et transmettre</span>
          <span className={styles.titleGold}>l&apos;héritage de France</span>
        </h1>

        {/* Sous-titre */}
        <p className={styles.subtitle}>
          La Fondation Chroniques de France met à disposition des ressources
          pédagogiques, des archives historiques et des événements culturels
          pour valoriser le patrimoine français.
        </p>

        {/* Boutons */}
        <div className={styles.actions}>
          <Link href="/bibliotheque" className={styles.btnOutlineGold}>
            Accéder aux ressources 📖
          </Link>
          <Link href="/connexion" className={styles.btnWhite}>
            Devenir membre
          </Link>
        </div>
      </div>
    </section>
  );
}
