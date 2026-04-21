"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import styles from "./FranceMap.module.css";

const GEO_URL = "/france-regions.geojson";

type RegionProperties = {
  code: string;
  nom: string;
};

// Couleur de base par code de région
const REGION_COLORS: Record<string, string> = {
  "11": "#e8856a", // Île-de-France — corail chaud
  "24": "#72b082", // Centre-Val de Loire — vert sauge
  "27": "#7b8ec4", // Bourgogne-Franche-Comté — bleu lavande
  "28": "#c9a84c", // Normandie — blé doré
  "32": "#5fb8c8", // Hauts-de-France — bleu ciel
  "44": "#9b7bc4", // Grand Est — lilas
  "52": "#d4826a", // Pays de la Loire — terracotta rosé
  "53": "#4e96c4", // Bretagne — bleu océan
  "75": "#7dc47d", // Nouvelle-Aquitaine — vert forêt
  "76": "#c47b5a", // Occitanie — ocre chaud
  "84": "#4db8a0", // Auvergne-Rhône-Alpes — vert turquoise
  "93": "#e8b86a", // Provence-Alpes-Côte d'Azur — jaune soleil
  "94": "#c46b8a", // Corse — rose profond
};

// Version plus foncée au survol (overlay sombre)
function darken(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - 30);
  const g = Math.max(0, ((n >> 8) & 0xff) - 30);
  const b = Math.max(0, (n & 0xff) - 30);
  return `rgb(${r},${g},${b})`;
}

// Infos affichées dans le panneau latéral
const REGION_INFO: Record<string, { emoji: string; description: string }> = {
  "Île-de-France":             { emoji: "🏰", description: "Berceau de la monarchie française, foyer des arts et des lumières, Île-de-France abrite Versailles, le Louvre et des siècles d'histoire royale." },
  "Centre-Val de Loire":       { emoji: "🏯", description: "La « Vallée des Rois » avec ses châteaux de la Renaissance — Chambord, Chenonceau, Amboise — témoins du faste de la cour de France." },
  "Bourgogne-Franche-Comté":   { emoji: "🍷", description: "Terre de ducs puissants et de vignobles légendaires, la Bourgogne a façonné la culture et la gastronomie françaises depuis le Moyen Âge." },
  "Normandie":                  { emoji: "⚓", description: "Des Vikings aux plages du Débarquement, la Normandie porte en elle mille ans d'histoire maritime et militaire, entre cathédrales et falaises." },
  "Hauts-de-France":            { emoji: "🌾", description: "Carrefour de l'Europe du Nord, cette région a été le théâtre de batailles décisives et d'une riche culture textile et industrielle." },
  "Grand Est":                  { emoji: "🦅", description: "L'Alsace, la Champagne et la Lorraine forment un creuset unique où se mêlent influences françaises et germaniques depuis des siècles." },
  "Pays de la Loire":           { emoji: "🌊", description: "Entre Loire royale et Atlantique, cette région abrite un patrimoine Renaissance exceptionnel et une tradition maritime ancestrale." },
  "Bretagne":                   { emoji: "🗿", description: "Terre celtique aux menhirs millénaires et aux pardons colorés, la Bretagne conserve une identité culturelle et linguistique unique en France." },
  "Nouvelle-Aquitaine":         { emoji: "🍇", description: "La plus grande région de France, des vignes de Bordeaux aux falaises du Pays basque, riche d'une préhistoire exceptionnelle à Lascaux." },
  "Occitanie":                  { emoji: "☀️", description: "Langue d'oc, cathares, troubadours — l'Occitanie est une civilisation à part entière, marquée par ses châteaux médiévaux et la mer Méditerranée." },
  "Auvergne-Rhône-Alpes":       { emoji: "🏔️", description: "Des volcans d'Auvergne aux Alpes majestueuses, cette région unit nature grandiose et cités antiques comme Lyon, ancienne capitale des Gaules." },
  "Provence-Alpes-Côte d'Azur": { emoji: "🌿", description: "Lumière méditerranéenne, lavandes de Haute-Provence, cités romaines — la Provence a inspiré peintres, poètes et philosophes depuis l'Antiquité." },
  "Corse":                      { emoji: "🏝️", description: "Île de Beauté, berceau de Napoléon Bonaparte, la Corse offre un patrimoine naturel et culturel unique entre maquis odorant et citadelles génoises." },
};

export default function FranceMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = (nom: string, code: string) => {
    if (selected === nom) {
      setSelected(null);
      setSelectedCode(null);
    } else {
      setSelected(nom);
      setSelectedCode(code);
    }
  };

  const regionInfo = selected ? REGION_INFO[selected] : null;
  const accentColor = selectedCode ? REGION_COLORS[selectedCode] : "#b8933a";

  return (
    <div className={styles.wrapper}>
      {/* Carte */}
      <div className={styles.mapContainer}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [2.5, 46.5], scale: 2600 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const { nom, code } = geo.properties as RegionProperties;
                const isSelected = selected === nom;
                const baseColor = REGION_COLORS[code] ?? "#d4c9a8";
                const hoverColor = darken(baseColor);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleClick(nom, code)}
                    onMouseEnter={() => setHovered(nom)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: {
                        fill: isSelected ? darken(darken(baseColor)) : baseColor,
                        stroke: "#ffffff",
                        strokeWidth: 1.2,
                        outline: "none",
                        cursor: "pointer",
                        filter: isSelected ? "brightness(0.85) saturate(1.3)" : "none",
                      },
                      hover: {
                        fill: hoverColor,
                        stroke: "#ffffff",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                        filter: "brightness(0.9) saturate(1.2)",
                      },
                      pressed: {
                        fill: darken(hoverColor),
                        stroke: "#ffffff",
                        strokeWidth: 1.5,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {hovered && (
          <div className={styles.tooltip}>
            {hovered}
          </div>
        )}
      </div>

      {/* Panneau latéral */}
      <div
        className={styles.infoPanel}
        style={selectedCode ? { borderTop: `4px solid ${accentColor}` } : {}}
      >
        {selected && regionInfo ? (
          <>
            <div className={styles.regionHeader}>
              <span className={styles.regionEmoji}>{regionInfo.emoji}</span>
              <h3 className={styles.regionName}>{selected}</h3>
            </div>
            <span
              className={styles.regionBadge}
              style={{ background: `${accentColor}22`, color: accentColor }}
            >
              Région sélectionnée
            </span>
            <p className={styles.regionDesc}>{regionInfo.description}</p>
            <div className={styles.panelActions}>
              <a
                href={`/bibliotheque?region=${encodeURIComponent(selected)}`}
                className={styles.btnPrimary}
                style={{ background: accentColor }}
              >
                Voir les ressources →
              </a>
              <button
                className={styles.btnSecondary}
                onClick={() => { setSelected(null); setSelectedCode(null); }}
              >
                Désélectionner
              </button>
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>🗺️</span>
            <p className={styles.placeholderTitle}>Explorez par région</p>
            <p className={styles.placeholderSub}>
              Cliquez sur une région de France pour découvrir son histoire et ses ressources.
            </p>
          </div>
        )}

        {/* Compteur régions */}
        <div className={styles.regionCount}>
          <span>🇫🇷</span>
          <span>13 régions métropolitaines</span>
        </div>
      </div>
    </div>
  );
}
