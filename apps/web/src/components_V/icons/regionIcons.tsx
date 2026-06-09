// =============================================================================
// SVG — 13 pictos régionaux (style héraldique outline)
// =============================================================================

import type { ReactNode } from "react";
import type { RegionIconName } from "./types";

type RegionDef = () => ReactNode;

export const REGION_ICONS: Record<RegionIconName, RegionDef> = {
  regionIdf: () => (
    <>
      <path d="M6 20h12M8 20V12l4-6 4 6v8" />
      <path d="M10 14h4M10 17h4" />
      <path d="M12 6v2" />
    </>
  ),
  regionCentre: () => (
    <>
      <path d="M5 20h14M7 20V10l5-5 5 5v10" />
      <path d="M9 13h2v4M13 13h2v4" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  regionBourgogne: () => (
    <>
      <path d="M8 18c0-4 2-7 4-9s4-5 4-9" />
      <path d="M12 4v14" />
      <ellipse cx="12" cy="19" rx="3" ry="2" />
      <path d="M10 6h4" />
    </>
  ),
  regionNormandie: () => (
    <>
      <circle cx="12" cy="6" r="2" />
      <path d="M12 8v7M8 18a4 4 0 0 0 8 0M5 20h14" />
    </>
  ),
  regionHauts: () => (
    <>
      <path d="M12 4v16M9 8l3-4 3 4M9 12l3 4 3-4M9 16l3 4 3-4" />
    </>
  ),
  regionGrandEst: () => (
    <>
      <path d="M12 4l2 4h4l-3 3 1 5-4-2-4 2 1-5-3-3h4z" />
    </>
  ),
  regionPdl: () => (
    <>
      <path d="M4 14c3-2 5-2 8 0s5 2 8 0" />
      <path d="M4 17c3-2 5-2 8 0s5 2 8 0" />
      <path d="M4 11c3-2 5-2 8 0s5 2 8 0" />
    </>
  ),
  regionBretagne: () => (
    <>
      <path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" />
      <path d="M10 12h4" />
    </>
  ),
  regionAquitaine: () => (
    <>
      <circle cx="9" cy="10" r="2" />
      <circle cx="15" cy="10" r="2" />
      <circle cx="12" cy="14" r="2" />
      <path d="M6 18c2-3 4-4 6-4s4 1 6 4" />
    </>
  ),
  regionOccitanie: () => (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />
    </>
  ),
  regionAra: () => (
    <>
      <path d="M6 20l6-16 6 16M8 15h8" />
      <path d="M10 11h4" />
    </>
  ),
  regionPaca: () => (
    <>
      <path d="M12 20V8M8 12c0-2 2-4 4-4s4 2 4 4" />
      <path d="M10 20c1-2 2-3 2-5M14 20c-1-2-2-3-2-5" />
    </>
  ),
  regionCorse: () => (
    <>
      <path d="M8 6c4-2 8 0 8 6s-4 8-8 6-8-4-8-6 4-8 8-6z" />
      <path d="M10 10c2 1 4 3 4 5" />
    </>
  ),
};
