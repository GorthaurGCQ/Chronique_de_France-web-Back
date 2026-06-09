// =============================================================================
// COMPOSANT — Ornement fleur de lys (brand)
// =============================================================================

import IconBase from "./IconBase";
import styles from "./AppIcon.module.css";

type Props = {
  size?: number;
  className?: string;
};

export default function FleurDeLys({ size = 20, className }: Props) {
  return (
    <IconBase
      size={size}
      className={`${styles.icon} ${styles.gold} ${className ?? ""}`}
      fill="currentColor"
      stroke="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12 2c0 3-1.5 5-3 6.5C7.5 10 6 11 6 13c0 1.5 1 2.5 2.5 2.5.8 0 1.5-.3 2-.8.5.5 1.2.8 2 .8 1.5 0 2.5-1 2.5-2.5 0-2-1.5-3-3-4.5C13.5 7 12 5 12 2z" />
      <path d="M12 16v6M9 20h6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </IconBase>
  );
}
