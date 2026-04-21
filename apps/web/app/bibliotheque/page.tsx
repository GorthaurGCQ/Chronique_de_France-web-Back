import type { Metadata } from "next";
import CarteInteractive from "@/components/CarteInteractive/CarteInteractive";
import styles from "./bibliotheque.module.css";

export const metadata: Metadata = {
  title: "Bibliothèque | Chroniques de France",
  description:
    "Accédez aux ressources pédagogiques de la Fondation : chronologies, fiches thématiques, documents éducatifs et publications, classées par région.",
};

export default function BibliothequePage() {
  return (
    <main className={styles.main}>
      {/* En-tête */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.badge}>RESSOURCES PÉDAGOGIQUES</span>
          <h1 className={styles.title}>Bibliothèque</h1>
          <p className={styles.subtitle}>
            Sélectionnez une région sur la carte pour découvrir son histoire et ses ressources associées.
          </p>
        </div>
      </section>

      {/* Carte interactive */}
      <section className={styles.mapSection}>
        <CarteInteractive />
      </section>
    </main>
  );
}
