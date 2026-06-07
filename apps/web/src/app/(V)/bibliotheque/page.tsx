import type { Metadata } from "next";
import CarteInteractive from "@/components_V/CarteInteractive/CarteInteractive";
import type { ResourceCardData } from "@/components_V/ResourceCard";
import { listNationalResources } from "@/lib/services/resources.service";
import BibliothequeContent from "@/components_V/bibliotheque/BibliothequeContent";
import styles from "./bibliotheque.module.css";

export const metadata: Metadata = {
  title: "Bibliothèque | Chroniques de France",
  description:
    "Accédez aux ressources pédagogiques de la Fondation : chronologies, fiches thématiques, documents éducatifs et publications, classées par région.",
};

async function getResources(): Promise<ResourceCardData[]> {
  try {
    const rows = await listNationalResources();
    return rows.map((r) => ({
      ...r,
      publishedAt: r.publishedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function BibliothequePage() {
  const resourceList = await getResources();

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.badge}>RESSOURCES PÉDAGOGIQUES</span>
          <h1 className={styles.title}>Bibliothèque</h1>
          <p className={styles.subtitle}>
            Sélectionnez une région sur la carte pour découvrir son histoire et ses ressources associées.
          </p>
        </div>
      </section>

      <section className={styles.mapSection}>
        <CarteInteractive />
      </section>

      <section className={styles.resourcesSection}>
        <div className={styles.resourcesHeader}>
          <h2 className={styles.resourcesTitle}>Ressources — France entière</h2>
          <span className={styles.resourcesCount}>
            {resourceList.length} ressource{resourceList.length !== 1 ? "s" : ""}
          </span>
        </div>
        <BibliothequeContent resources={resourceList} />
      </section>
    </main>
  );
}
