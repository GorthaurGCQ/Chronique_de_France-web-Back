import styles from "./NosMissions.module.css";

type Mission = {
  emoji: string;
  iconBg: "navy" | "gold";
  title: string;
  description: string;
};

const missions: Mission[] = [
  {
    emoji: "🎓",
    iconBg: "navy",
    title: "Ouvrages pédagogiques",
    description:
      "Nous concevons et diffusons des ouvrages, chronologies et fiches thématiques adaptés à tous les niveaux d'enseignement.",
  },
  {
    emoji: "📂",
    iconBg: "gold",
    title: "Contenus numériques",
    description:
      "Notre plateforme met à disposition des ressources numériques accessibles en ligne : archives, publications et documents inédits.",
  },
  {
    emoji: "🏫",
    iconBg: "navy",
    title: "Actions éducatives",
    description:
      "Nous intervenons dans les établissements scolaires et culturels pour animer ateliers, conférences et parcours pédagogiques.",
  },
];

export default function NosMissions() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>NOS MISSIONS</h2>
          <span className={styles.underline} aria-hidden="true" />
          <p className={styles.subtitle}>
            <em>
              Engagés pour la transmission du patrimoine culturel et historique
              de la France
            </em>
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {missions.map((mission) => (
            <div key={mission.title} className={styles.card}>
              <div
                className={`${styles.iconWrapper} ${
                  mission.iconBg === "navy" ? styles.iconNavy : styles.iconGold
                }`}
                aria-hidden="true"
              >
                <span className={styles.emoji}>{mission.emoji}</span>
              </div>
              <h3 className={styles.cardTitle}>{mission.title}</h3>
              <p className={styles.cardDesc}>{mission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
