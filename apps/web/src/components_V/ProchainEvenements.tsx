import Link from "next/link";
import styles from "./ProchainEvenements.module.css";

type Evenement = {
  date: { jour: string; mois: string };
  type: string;
  titre: string;
  lieu: string;
  description: string;
  href: string;
};

const evenements: Evenement[] = [
  {
    date: { jour: "14", mois: "MAI" },
    type: "CONFÉRENCE",
    titre: "La France médiévale : pouvoirs et territoires",
    lieu: "Paris — Sorbonne",
    description:
      "Une conférence exceptionnelle réunissant historiens et chercheurs autour des dynamiques territoriales du Moyen Âge.",
    href: "/evenement",
  },
  {
    date: { jour: "02", mois: "JUN" },
    type: "ATELIER",
    titre: "Initiation à la paléographie du XVIIe siècle",
    lieu: "Lyon — Bibliothèque municipale",
    description:
      "Apprenez à déchiffrer les manuscrits anciens lors de cet atelier pratique animé par nos experts.",
    href: "/evenement",
  },
  {
    date: { jour: "21", mois: "JUN" },
    type: "EXPOSITION",
    titre: "Chroniques d'Occitanie — Regards croisés",
    lieu: "Toulouse — Musée des Augustins",
    description:
      "Une exposition immersive retraçant l'histoire et le patrimoine culturel de la région occitane.",
    href: "/evenement",
  },
];

export default function ProchainEvenements() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.sectionTitle}>Prochains événements</h2>
            <span className={styles.underline} aria-hidden="true" />
          </div>
          <Link href="/evenement" className={styles.seeAll}>
            Voir tout l'agenda →
          </Link>
        </div>

        <div className={styles.list}>
          {evenements.map((ev) => (
            <article key={ev.titre} className={styles.card}>
              <div className={styles.dateBadge}>
                <span className={styles.dateJour}>{ev.date.jour}</span>
                <span className={styles.dateMois}>{ev.date.mois}</span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.tag}>{ev.type}</span>
                <h3 className={styles.cardTitle}>{ev.titre}</h3>
                <p className={styles.lieu}>📍 {ev.lieu}</p>
                <p className={styles.cardDesc}>{ev.description}</p>
              </div>
              <Link href={ev.href} className={styles.cta}>
                En savoir plus →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
