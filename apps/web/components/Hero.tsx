import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Bannière en background */}
      <Image
        src="/bannier.png"
        alt="Bannière Chronique de France"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
      />

      {/* Overlay sombre pour lisibilité */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Contenu par-dessus — ancré en bas */}
      <div className={styles.container}>
        <span className={styles.badge}>INSTITUTION CULTURELLE</span>

        <div className={styles.bottom}>
          <p className={styles.subtitle}>
            La Fondation Chroniques de France met à disposition des ressources
            pédagogiques, des archives historiques et des événements culturels
            pour valoriser le patrimoine français.
          </p>

          <div className={styles.actions}>
            <Link href="/bibliotheque" className={styles.btnOutlineGold}>
              Accéder aux ressources 📖
            </Link>
            <Link href="/connexion" className={styles.btnWhite}>
              Devenir membre
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
