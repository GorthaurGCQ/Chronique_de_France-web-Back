// Module : node_modules/next/link
import Link from "next/link";
// Module : node_modules/next/image
import Image from "next/image";
// Composant : src/components_V/icons/FleurDeLys.tsx
import FleurDeLys from "@/components_V/icons/FleurDeLys";
// Composant : src/components_V/icons/AppIcon.tsx
import AppIcon from "@/components_V/icons/AppIcon";
// Style : src/components_V/Hero.module.css
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Bannière seule — taille d'origine */}
      <div className={styles.banner}>
        <div className={styles.bannerMedia}>
          <Image
            src="/bannier.png"
            alt="Bannière Chronique de France"
            fill
            className={styles.bannerImage}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>

        {/* Calques fusionnés + animations GPU (transform / opacity) */}
        <div className={styles.bannerTint} aria-hidden="true" />
        <div className={styles.bannerGlow} aria-hidden="true" />
        <div className={styles.bannerShine} aria-hidden="true" />

        <div className={styles.particles} aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={styles.particle}
              data-i={i}
              style={{ "--particle-delay": `${i * 1.15}s` } as React.CSSProperties}
            />
          ))}
        </div>

        <div className={styles.frameCorners} aria-hidden="true">
          <span className={styles.frameCorner} data-pos="tl" />
          <span className={styles.frameCorner} data-pos="tr" />
          <span className={styles.frameCorner} data-pos="bl" />
          <span className={styles.frameCorner} data-pos="br" />
        </div>
      </div>

      {/* Texte et actions sous la bannière */}
      <div className={styles.below}>
        <div className={styles.banderoleWrap}>
          <div className={styles.banderole}>
            <FleurDeLys size={18} className={styles.banderoleOrnament} />
            <div className={styles.banderoleShine} aria-hidden="true" />
            <p className={styles.tagline}>
              La Fondation Chroniques de France met à disposition des ressources
              pédagogiques, des archives historiques et des événements culturels
              pour valoriser le patrimoine français.
            </p>
            <FleurDeLys size={18} className={styles.banderoleOrnament} />
          </div>
          <span className={styles.banderoleTailLeft} aria-hidden="true" />
          <span className={styles.banderoleTailRight} aria-hidden="true" />
        </div>

        <div className={styles.actions}>
          <Link href="/bibliotheque" className={styles.btnOutlineGold}>
            <AppIcon name="book" size={18} tone="inherit" className={styles.btnIcon} />
            Accéder aux ressources
          </Link>
          <Link href="/connexion" className={styles.btnWhite}>
            Devenir membre
          </Link>
        </div>
      </div>
    </section>
  );
}
