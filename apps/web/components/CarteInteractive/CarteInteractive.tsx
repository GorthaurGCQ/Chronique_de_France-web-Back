"use client";

import { useState, useCallback, useRef } from "react";
import { FRANCE_SVG_PATHS } from "@/data/france-svg-paths";
import { REGIONS, getRegionByCode, type Region } from "@/data/regions";
import TooltipRegion from "./TooltipRegion";
import PanneauRegion from "./PanneauRegion";
import styles from "./CarteInteractive.module.css";

export default function CarteInteractive() {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const hoveredRegion = hoveredCode ? getRegionByCode(hoveredCode) ?? null : null;

  const handleMouseEnter = useCallback(
    (code: string, e: React.MouseEvent) => {
      setHoveredCode(code);
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    },
    []
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCode(null);
  }, []);

  const handleClick = useCallback((code: string) => {
    const region = getRegionByCode(code);
    if (!region) return;
    setSelectedRegion((prev) => (prev?.code === code ? null : region));
  }, []);

  const handleKeyDown = useCallback(
    (code: string, e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(code);
      }
    },
    [handleClick]
  );

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Explorez la France</h2>
        <p className={styles.subtitle}>
          Survolez une région pour la découvrir, cliquez pour en savoir plus
        </p>
      </div>

      {/* Map card */}
      <div className={styles.card}>
        {/* Region count badge */}
        <div className={styles.mapBadge}>
          🇫🇷 {REGIONS.length} régions métropolitaines
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 600 680"
          className={styles.svg}
          role="img"
          aria-label="Carte interactive de France par régions"
        >
          <defs>
            <filter id="region-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="rgba(0,0,0,0.18)"
              />
            </filter>
            <filter id="region-shadow-hover" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="rgba(0,0,0,0.28)"
              />
            </filter>
          </defs>

          {FRANCE_SVG_PATHS.map(({ code, nom, d }) => {
            const region = getRegionByCode(code);
            const isHovered = hoveredCode === code;
            const isSelected = selectedRegion?.code === code;
            const fill = region?.couleur ?? "#ccc";

            return (
              <path
                key={code}
                d={d}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                strokeLinejoin="round"
                className={`${styles.regionPath} ${isHovered ? styles.regionHovered : ""} ${isSelected ? styles.regionSelected : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`${nom} — chef-lieu : ${region?.chefLieu ?? ""}`}
                aria-pressed={isSelected}
                filter={
                  isHovered
                    ? "url(#region-shadow-hover)"
                    : "url(#region-shadow)"
                }
                onMouseEnter={(e) => handleMouseEnter(code, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(code)}
                onKeyDown={(e) => handleKeyDown(code, e)}
              />
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      <TooltipRegion
        region={hoveredRegion}
        x={mouseX}
        y={mouseY}
        visible={!!hoveredCode && !selectedRegion}
      />

      {/* Side panel */}
      <PanneauRegion
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
      />
    </section>
  );
}
