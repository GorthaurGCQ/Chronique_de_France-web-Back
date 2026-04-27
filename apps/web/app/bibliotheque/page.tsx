import type { Metadata } from "next";
import { db } from "@/db";
import { resources, authUser } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import CarteInteractive from "@/components/CarteInteractive/CarteInteractive";
import type { ResourceCardData } from "@/components/ResourceCard";
import BibliothequeContent from "./BibliothequeContent";
import styles from "./bibliotheque.module.css";

export const metadata: Metadata = {
  title: "Bibliothèque | Chroniques de France",
  description:
    "Accédez aux ressources pédagogiques de la Fondation : chronologies, fiches thématiques, documents éducatifs et publications, classées par région.",
};

async function getResources(): Promise<ResourceCardData[]> {
  try {
    const rows = await db
      .select({
        id: resources.id,
        titre: resources.titre,
        description: resources.description,
        contenu: resources.contenu,
        type: resources.type,
        region: resources.region,
        timeline: resources.timeline,
        domaine:      resources.domaine,
        thumbnailUrl: resources.thumbnailUrl,
        publishedAt:  resources.publishedAt,
        authorName:   authUser.name,
      })
      .from(resources)
      .leftJoin(authUser, eq(resources.authorId, authUser.id))
      .where(eq(resources.region, "NATIONAL"))
      .orderBy(desc(resources.publishedAt));

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

      {/* Ressources nationales avec filtres domaine + frise */}
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
