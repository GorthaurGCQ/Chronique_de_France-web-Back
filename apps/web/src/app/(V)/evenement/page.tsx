import type { Metadata } from "next";
import { listUpcomingAndPastEvents } from "@/lib/services_M/events.service";
import styles from "./evenement.module.css";
import { UpcomingGrid } from "@/components_V/evenement/EventsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Événements | Chronique de France",
  description:
    "Consultez l'agenda culturel de la Fondation Chroniques de France : conférences, expositions, ateliers et rencontres.",
};

const REGION_LABELS: Record<string, string> = {
  NATIONAL: "National", AUVERGNE_RHONE_ALPES: "Auvergne-Rhône-Alpes",
  BOURGOGNE_FRANCHE_COMTE: "Bourgogne-Franche-Comté", BRETAGNE: "Bretagne",
  CENTRE_VAL_DE_LOIRE: "Centre-Val de Loire", CORSE: "Corse",
  GRAND_EST: "Grand Est", HAUTS_DE_FRANCE: "Hauts-de-France",
  ILE_DE_FRANCE: "Île-de-France", NORMANDIE: "Normandie",
  NOUVELLE_AQUITAINE: "Nouvelle-Aquitaine", OCCITANIE: "Occitanie",
  PAYS_DE_LA_LOIRE: "Pays de la Loire", PROVENCE_ALPES_COTE_AZUR: "Provence-Alpes-Côte d'Azur",
};

export default async function EvenementPage() {
  const { upcoming, past } = await listUpcomingAndPastEvents();

  const upcomingSerialized = upcoming.map((e) => ({
    ...e,
    date: e.date instanceof Date ? e.date.toISOString() : String(e.date),
  }));
  const pastSerialized = past.map((e) => ({
    ...e,
    date: e.date instanceof Date ? e.date.toISOString() : String(e.date),
  }));

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Agenda culturel</p>
          <h1 className={styles.heroTitle}>Événements</h1>
          <p className={styles.heroDesc}>
            Conférences, expositions, ateliers pédagogiques et rencontres scientifiques
            autour du patrimoine historique français.
          </p>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionDot} style={{ background: "#22c55e" }} />
            À venir
            <span className={styles.sectionCount}>{upcoming.length}</span>
          </h2>
          <UpcomingGrid events={upcomingSerialized} />
        </section>

        {pastSerialized.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionDot} style={{ background: "#9ca3af" }} />
              Événements passés
            </h2>
            <div className={styles.pastList}>
              {pastSerialized.map((ev) => {
                const d = new Date(ev.date);
                return (
                  <div key={ev.id} className={styles.pastItem}>
                    <div className={styles.pastDate}>
                      <span>{d.getDate()}</span>
                      <span>{d.toLocaleDateString("fr-FR", { month: "short" })}</span>
                      <span>{d.getFullYear()}</span>
                    </div>
                    <div className={styles.pastBody}>
                      <p className={styles.pastTitle}>{ev.titre}</p>
                      <p className={styles.pastMeta}>
                        {ev.lieu}
                        {ev.region && ev.region !== "NATIONAL"
                          ? ` · ${REGION_LABELS[ev.region] ?? ev.region}`
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
