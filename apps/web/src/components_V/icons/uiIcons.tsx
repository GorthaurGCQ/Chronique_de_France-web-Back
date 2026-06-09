// =============================================================================
// SVG — Icônes UI, dashboard, patrimoine
// =============================================================================

import type { ReactNode } from "react";
import type { IconName } from "./types";

type IconDef = () => ReactNode;

export const UI_ICONS: Record<IconName, IconDef> = {
  lock: () => (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  denied: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 8l8 8M16 8l-8 8" />
    </>
  ),
  close: () => (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  chevronLeft: () => (
    <path d="M14 6l-6 6 6 6" />
  ),
  chevronRight: () => (
    <path d="M10 6l6 6-6 6" />
  ),
  chevronUp: () => (
    <path d="M6 14l6-6 6 6" />
  ),
  chevronDown: () => (
    <path d="M6 10l6 6 6-6" />
  ),
  fullscreen: () => (
    <>
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
    </>
  ),
  arrowRight: () => (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  external: () => (
    <>
      <path d="M14 5h5v5M10 14L19 5M19 10v9H5V5h9" />
    </>
  ),
  play: () => (
    <>
      <polygon points="8,5 19,12 8,19" fill="currentColor" stroke="none" />
    </>
  ),
  link: () => (
    <>
      <path d="M10 14a4 4 0 0 1 0-5.7l1.3-1.3a4 4 0 0 1 5.7 5.7l-1 1" />
      <path d="M14 10a4 4 0 0 1 0 5.7l-1.3 1.3a4 4 0 0 1-5.7-5.7l1-1" />
    </>
  ),
  document: () => (
    <>
      <path d="M8 3h6l4 4v14H8z" />
      <path d="M14 3v4h4M10 13h6M10 17h6" />
    </>
  ),
  music: () => (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
  book: () => (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0-2 2z" />
      <path d="M6 3v18" />
    </>
  ),
  image: () => (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path d="M3 16l5-5 4 4 3-3 6 6" />
    </>
  ),
  film: () => (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 6v12M17 6v12M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  user: () => (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
    </>
  ),
  key: () => (
    <>
      <circle cx="8" cy="15" r="3" />
      <path d="M11 15h10M17 12v6M20 13v4" />
    </>
  ),
  chart: () => (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  bookmark: () => (
    <path d="M6 4h12v16l-6-4-6 4z" />
  ),
  clock: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  settings: () => (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  camera: () => (
    <>
      <path d="M4 8h4l2-2h4l2 2h4v10H4z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  crown: () => (
    <>
      <path d="M3 18h18M5 18l2-8 5 4 5-4 2 8" />
      <path d="M7 10l2-4 3 3 3-3 2 4" />
    </>
  ),
  shield: () => (
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
  ),
  logout: () => (
    <>
      <path d="M10 17l-3-3 3-3M7 14h9M14 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
    </>
  ),
  trash: () => (
    <>
      <path d="M4 7h16M9 7V5h6v2M10 11v5M14 11v5M6 7l1 12h10l1-12" />
    </>
  ),
  pencil: () => (
    <>
      <path d="M4 20h4l10-10-4-4L4 16z" />
      <path d="M14 6l4 4" />
    </>
  ),
  eye: () => (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  eyeOff: () => (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <path d="M4 4l16 16" />
    </>
  ),
  note: () => (
    <>
      <path d="M6 4h10l4 4v12H6z" />
      <path d="M16 4v4h4M9 13h6M9 17h4" />
    </>
  ),
  calendar: () => (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </>
  ),
  users: () => (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3 20v-1a5 5 0 0 1 8-3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M14 20v-1a4 4 0 0 1 5-3" />
    </>
  ),
  globe: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  message: () => (
    <>
      <path d="M4 6h16v10H8l-4 4z" />
      <path d="M8 11h8" />
    </>
  ),
  phone: () => (
    <path d="M6 4h4l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 4 8a2 2 0 0 1 2-2z" />
  ),
  mail: () => (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 8l9 6 9-6" />
    </>
  ),
  pin: () => (
    <>
      <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
  graduation: () => (
    <>
      <path d="M3 9l9-5 9 5-9 5z" />
      <path d="M21 10v5M12 14v5" />
    </>
  ),
  folder: () => (
    <path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
  ),
  school: () => (
    <>
      <path d="M3 10l9-6 9 6v10H3z" />
      <path d="M9 20v-6h6v6M12 4v6" />
    </>
  ),
  monument: () => (
    <>
      <path d="M6 20h12M8 20V10l4-4 4 4v10" />
      <path d="M10 14h4M10 17h4" />
    </>
  ),
  map: () => (
    <>
      <path d="M4 6l6-2 6 2 4-2v14l-4 2-6-2-6 2V4z" />
      <path d="M10 4v14M16 6v14" />
    </>
  ),
  plus: () => (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  check: () => (
    <path d="M5 12l5 5L19 7" />
  ),
  ban: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 7l10 10" />
    </>
  ),
  clipboard: () => (
    <>
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 5h6a1 1 0 0 1 1 1v1H8V6a1 1 0 0 1 1-1z" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  file: () => (
    <>
      <path d="M8 3h6l4 4v14H8z" />
      <path d="M14 3v4h4" />
    </>
  ),
  anchor: () => (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v8M8 15a4 4 0 0 0 8 0M5 19h14" />
    </>
  ),
  flag: () => (
    <>
      <path d="M5 4v16M5 4h11l-2 3 2 3H5" />
    </>
  ),
};
