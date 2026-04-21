"use client";

import { useState, useCallback } from "react";
import type { Epoque } from "@/data/epoques";
import type { TerritoireInfo } from "@/data/territoires/types";
import { FRANCE_SVG_PATHS } from "@/data/france-svg-paths";
import {
  CARTE_ANTIQUITE,
  CARTE_MOYEN_AGE,
  CARTE_RENAISSANCE,
  CARTE_ANCIEN_REGIME,
  CARTE_REVOLUTION_EMPIRE,
  CARTE_XIXe_SIECLE,
  CARTE_GUERRES_MONDIALES,
  CARTE_CONTEMPORAINE,
} from "@/data/territoires";
import type { CarteEpoqueData } from "@/data/territoires";
import TooltipTerritoire from "./TooltipTerritoire";
import LegendeEpoque from "./LegendeEpoque";
import styles from "./CarteHistorique.module.css";

const CARTE_MAP: Record<string, CarteEpoqueData> = {
  antiquite:           CARTE_ANTIQUITE,
  "moyen-age":         CARTE_MOYEN_AGE,
  renaissance:         CARTE_RENAISSANCE,
  "ancien-regime":     CARTE_ANCIEN_REGIME,
  "revolution-empire": CARTE_REVOLUTION_EMPIRE,
  "xixe-siecle":       CARTE_XIXe_SIECLE,
  "guerres-mondiales": CARTE_GUERRES_MONDIALES,
  contemporaine:       CARTE_CONTEMPORAINE,
};

/** Extract unique territories ordered by first appearance */
function uniqueTerritoires(data: CarteEpoqueData): TerritoireInfo[] {
  const seen = new Set<string>();
  const result: TerritoireInfo[] = [];
  for (const t of Object.values(data)) {
    if (!seen.has(t.id)) {
      seen.add(t.id);
      result.push(t);
    }
  }
  return result;
}

type HoveredRegion = {
  territoire: TerritoireInfo;
  regionNom: string;
};

type Props = { epoque: Epoque };

export default function CarteHistorique({ epoque }: Props) {
  const [hovered, setHovered] = useState<HoveredRegion | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const carteData = CARTE_MAP[epoque.territoiresKey] ?? CARTE_CONTEMPORAINE;
  const territoires = uniqueTerritoires(carteData);

  const handleEnter = useCallback(
    (territoire: TerritoireInfo, regionNom: string, e: React.MouseEvent) => {
      setHovered({ territoire, regionNom });
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    },
    []
  );
  const handleMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  }, []);
  const handleLeave = useCallback(() => setHovered(null), []);

  return (
    <div className={styles.wrapper}>
      {/* key forces remount + fadeIn animation on era change */}
      <div key={epoque.id} className={styles.mapCard}>
        <div className={styles.eraLabel} style={{ background: epoque.couleur }}>
          {epoque.label}&nbsp;·&nbsp;
          {epoque.dateDebut < 0
            ? `${Math.abs(epoque.dateDebut)} av. J.-C.`
            : epoque.dateDebut}{" "}
          – {epoque.dateFin}
        </div>

        <svg
          viewBox="0 0 600 680"
          className={styles.svg}
          role="img"
          aria-label={`Carte historique de France — ${epoque.label}`}
        >
          <defs>
            <filter id="ch-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.18)" />
            </filter>
            <filter id="ch-shadow-hover" x="-8%" y="-8%" width="116%" height="116%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.35)" />
            </filter>
          </defs>

          {/* Ocean background */}
          <rect x="0" y="0" width="600" height="680" fill="#b8d4e8" />

          {/* Render each modern region path, colored by its historical territory */}
          {FRANCE_SVG_PATHS.map(({ code, nom, d }) => {
            const territoire = carteData[code];
            if (!territoire) return null;
            const isHovered = hovered?.territoire.id === territoire.id;
            return (
              <path
                key={code}
                d={d}
                fill={territoire.couleur}
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 0.8}
                strokeLinejoin="round"
                className={`${styles.region} ${isHovered ? styles.regionHovered : ""}`}
                filter={isHovered ? "url(#ch-shadow-hover)" : "url(#ch-shadow)"}
                tabIndex={0}
                role="button"
                aria-label={`${territoire.nom} — ${nom}`}
                onMouseEnter={(e) => handleEnter(territoire, nom, e)}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
              />
            );
          })}
        </svg>

        <LegendeEpoque epoque={epoque} territoires={territoires} />
      </div>

      <TooltipTerritoire
        territoire={hovered?.territoire ?? null}
        regionNom={hovered?.regionNom}
        x={mouseX}
        y={mouseY}
        visible={!!hovered}
      />
    </div>
  );
}
