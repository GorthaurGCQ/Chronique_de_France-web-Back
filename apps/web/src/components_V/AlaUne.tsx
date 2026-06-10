// =============================================================================
// VUE SSR — Section « À la une » : ressources publiées en base (table resources)
// =============================================================================

// Module : node_modules/next/link
import Link from "next/link";
// Composant : src/components_V/icons/AppIcon.tsx
import AppIcon from "@/components_V/icons/AppIcon";
// Composant : src/components_V/ResourceCard.tsx
import ResourceCard from "@/components_V/ResourceCard";
// Service : src/lib/services_M/resources.service.ts
import { listRecentResources } from "@/lib/services_M/resources.service";
// Style : src/components_V/AlaUne.module.css
import styles from "./AlaUne.module.css";

export const dynamic = "force-dynamic";

export default async function AlaUne() {
  let resources: Awaited<ReturnType<typeof listRecentResources>> = [];
  try {
    resources = await listRecentResources(3);
  } catch {
    resources = [];
  }

  if (resources.length === 0) return null;

  const cards = resources.map((r) => ({
    ...r,
    publishedAt: r.publishedAt.toISOString(),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.sectionTitle}>À la une</h2>
            <span className={styles.underline} aria-hidden="true" />
          </div>
          <Link href="/bibliotheque" className={styles.seeAll}>
            Voir toutes les ressources
            <AppIcon name="arrowRight" size={16} tone="inherit" className={styles.inlineIcon} />
          </Link>
        </div>

        <div className={styles.grid}>
          {cards.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
}
