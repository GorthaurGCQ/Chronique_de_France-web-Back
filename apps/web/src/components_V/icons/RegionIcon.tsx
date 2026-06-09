// =============================================================================
// COMPOSANT — Picto régional SVG
// =============================================================================

import IconBase from "./IconBase";
import { REGION_ICONS } from "./regionIcons";
import {
  REGION_NAME_TO_ICON,
  type RegionIconName,
  type IconTone,
} from "./types";
import styles from "./AppIcon.module.css";

type Props = {
  region: string;
  size?: number;
  tone?: IconTone;
  className?: string;
};

const TONE_CLASS: Record<IconTone, string> = {
  gold: styles.gold,
  navy: styles.navy,
  muted: styles.muted,
  inherit: styles.inherit,
};

export function getRegionIconName(region: string): RegionIconName | undefined {
  return REGION_NAME_TO_ICON[region];
}

export default function RegionIcon({
  region,
  size = 32,
  tone = "gold",
  className,
}: Props) {
  const iconName = REGION_NAME_TO_ICON[region];
  if (!iconName) return null;

  const IconContent = REGION_ICONS[iconName];

  return (
    <IconBase
      size={size}
      className={`${styles.icon} ${TONE_CLASS[tone]} ${className ?? ""}`}
      aria-hidden
    >
      <IconContent />
    </IconBase>
  );
}
