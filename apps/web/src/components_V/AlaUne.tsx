import Link from "next/link";
import styles from "./AlaUne.module.css";

type Card = {
  gradient: string;
  tag: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

const cards: Card[] = [
  {
    gradient: "linear-gradient(135deg, #4a7c59 0%, #2d5a3d 100%)",
    tag: "PUBLICATION",
    title: "Châteaux de la Loire",
    description:
      "Découvrez notre nouvelle chronologie illustrée sur les châteaux de la Renaissance, entre art et politique royale.",
    ctaLabel: "Lire l'article",
    ctaHref: "/bibliotheque",
  },
  {
    gradient: "linear-gradient(135deg, #c4956a 0%, #8b6340 100%)",
    tag: "ÉVÉNEMENT",
    title: "Grand Colloque Annuel",
    description:
      "Rejoignez chercheurs et passionnés lors de notre colloque annuel dédié à l'histoire médiévale française.",
    ctaLabel: "S'inscrire",
    ctaHref: "/evenement",
  },
  {
    gradient: "linear-gradient(135deg, #d4cfc4 0%, #b0a898 100%)",
    tag: "ARCHIVES",
    title: "Manuscrits du XVIIe siècle",
    description:
      "Accédez à notre fonds numérisé de manuscrits du Grand Siècle, désormais consultables en ligne.",
    ctaLabel: "Consulter",
    ctaHref: "/bibliotheque",
  },
];

export default function AlaUne() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.sectionTitle}>À la une</h2>
            <span className={styles.underline} aria-hidden="true" />
          </div>
          <Link href="/bibliotheque" className={styles.seeAll}>
            Voir toutes les actualités →
          </Link>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              {/* Placeholder image */}
              <div
                className={styles.cardImage}
                style={{ background: card.gradient }}
                aria-hidden="true"
              />
              {/* Content */}
              <div className={styles.cardContent}>
                <span className={styles.tag}>{card.tag}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.description}</p>
                <Link href={card.ctaHref} className={styles.cta}>
                  {card.ctaLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
