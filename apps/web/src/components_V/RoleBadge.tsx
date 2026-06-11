// Badge affiché selon auth_user.role (dont organisateur = badge métier événements)

import AppIcon from "@/components_V/icons/AppIcon";
import styles from "./roleBadge.module.css";

type Props = {
  role?: string | null;
  className?: string;
};

export default function RoleBadge({ role, className }: Props) {
  const cls = [styles.badge, className].filter(Boolean).join(" ");

  if (role === "founder") {
    return (
      <span className={`${cls} ${styles.founder}`}>
        <AppIcon name="crown" size={12} className={styles.icon} />
        Fondateur
      </span>
    );
  }

  if (role === "admin") {
    return <span className={`${cls} ${styles.admin}`}>Administrateur</span>;
  }

  if (role === "organisateur") {
    return (
      <span className={`${cls} ${styles.organisateur}`}>
        <AppIcon name="calendar" size={12} className={styles.icon} />
        Organisateur
      </span>
    );
  }

  return <span className={`${cls} ${styles.user}`}>Membre</span>;
}
