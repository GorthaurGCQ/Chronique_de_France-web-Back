// =============================================================================
// COMPOSANT — Icône SVG maison par nom
// =============================================================================

import IconBase from "./IconBase";
import { UI_ICONS } from "./uiIcons";
import type { IconName, IconTone } from "./types";
import styles from "./AppIcon.module.css";

type Props = {
  name: IconName;
  size?: number;
  tone?: IconTone;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
};

const TONE_CLASS: Record<IconTone, string> = {
  gold: styles.gold,
  navy: styles.navy,
  muted: styles.muted,
  inherit: styles.inherit,
};

export default function AppIcon({
  name,
  size = 20,
  tone = "gold",
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: Props) {
  const IconContent = UI_ICONS[name];
  if (!IconContent) return null;

  return (
    <IconBase
      size={size}
      className={`${styles.icon} ${TONE_CLASS[tone]} ${className ?? ""}`}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
    >
      <IconContent />
    </IconBase>
  );
}

export type { IconName, IconTone };
