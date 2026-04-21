"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { EPOQUES } from "@/data/epoques";
import CarteHistorique from "./CarteHistorique";
import styles from "./TimelineHistorique.module.css";

const SVG_W = 700;
const SVG_H = 80;
const PADDING = 40;
const TRACK_Y = 44;
const DOT_R = 7;
const THUMB_R = 11;
const TRACK_W = SVG_W - PADDING * 2;

function xForIndex(i: number) {
  return PADDING + (i / (EPOQUES.length - 1)) * TRACK_W;
}

export default function TimelineHistorique() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbX, setThumbX] = useState(xForIndex(0));
  const svgRef = useRef<SVGSVGElement>(null);

  const epoque = EPOQUES[activeIndex];

  // Convert a raw pixel offset in SVG space to the closest era index
  const snapToIndex = useCallback((rawX: number) => {
    const clamped = Math.max(PADDING, Math.min(SVG_W - PADDING, rawX));
    const ratio = (clamped - PADDING) / TRACK_W;
    return Math.round(ratio * (EPOQUES.length - 1));
  }, []);

  // Convert client x to SVG x accounting for scaling
  const clientToSvgX = useCallback((clientX: number) => {
    if (!svgRef.current) return clientX;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = SVG_W / rect.width;
    return (clientX - rect.left) * scaleX;
  }, []);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const svgX = clientToSvgX(e.clientX);
      const clamped = Math.max(PADDING, Math.min(SVG_W - PADDING, svgX));
      setThumbX(clamped);
      setActiveIndex(snapToIndex(svgX));
    };
    const onUp = (e: MouseEvent) => {
      const idx = snapToIndex(clientToSvgX(e.clientX));
      setActiveIndex(idx);
      setThumbX(xForIndex(idx));
      setIsDragging(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, clientToSvgX, snapToIndex]);

  // Touch drag handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onTouchMove = (e: TouchEvent) => {
      const svgX = clientToSvgX(e.touches[0].clientX);
      const clamped = Math.max(PADDING, Math.min(SVG_W - PADDING, svgX));
      setThumbX(clamped);
      setActiveIndex(snapToIndex(svgX));
    };
    const onTouchEnd = (e: TouchEvent) => {
      const idx = snapToIndex(clientToSvgX(e.changedTouches[0].clientX));
      setActiveIndex(idx);
      setThumbX(xForIndex(idx));
      setIsDragging(false);
    };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, clientToSvgX, snapToIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      const next = Math.max(0, activeIndex - 1);
      setActiveIndex(next);
      setThumbX(xForIndex(next));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const next = Math.min(EPOQUES.length - 1, activeIndex + 1);
      setActiveIndex(next);
      setThumbX(xForIndex(next));
    }
  }, [activeIndex]);

  // Click on a dot
  const handleDotClick = useCallback((idx: number) => {
    setActiveIndex(idx);
    setThumbX(xForIndex(idx));
  }, []);

  // Gradient stop colors
  const gradStops = EPOQUES.map((e, i) => ({
    offset: `${(i / (EPOQUES.length - 1)) * 100}%`,
    color: e.couleur,
  }));

  return (
    <section className={styles.section} aria-label="Chronologie historique de la France">
      <div className={styles.header}>
        <h2 className={styles.title}>Chronologie historique</h2>
        <p className={styles.subtitle}>
          Explorez l'évolution du territoire français à travers les âges. Glissez le curseur ou cliquez sur une époque.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Left: map */}
        <div className={styles.mapWrapper}>
          <CarteHistorique epoque={epoque} />
        </div>

        {/* Right: info panel */}
        <aside className={styles.panel}>
          <div className={styles.panelAccent} style={{ background: epoque.couleur }} />
          <div className={styles.panelContent}>
            <div className={styles.epoqueTag} style={{ background: `${epoque.couleur}22`, color: epoque.couleur }}>
              {epoque.dateDebut < 0
                ? `${Math.abs(epoque.dateDebut)} av. J.-C.`
                : epoque.dateDebut}{" "}
              — {epoque.dateFin}
            </div>
            <h3 className={styles.epoqueTitle}>{epoque.label}</h3>
            <p className={styles.epoqueDesc}>{epoque.description}</p>

            <div className={styles.faits}>
              <div className={styles.faitsTitle}>Faits marquants</div>
              <ul className={styles.faitsList}>
                {epoque.faitsHistoriques.map((fait, i) => (
                  <li key={i} className={styles.fait}>
                    <span className={styles.faitDot} style={{ background: epoque.couleur }} />
                    <span>{fait}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation arrows */}
            <div className={styles.navRow}>
              <button
                className={styles.navBtn}
                onClick={() => handleDotClick(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                aria-label="Époque précédente"
              >
                ← Précédent
              </button>
              <span className={styles.navCounter}>
                {activeIndex + 1} / {EPOQUES.length}
              </span>
              <button
                className={styles.navBtn}
                onClick={() => handleDotClick(Math.min(EPOQUES.length - 1, activeIndex + 1))}
                disabled={activeIndex === EPOQUES.length - 1}
                aria-label="Époque suivante"
              >
                Suivant →
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Timeline */}
      <div className={styles.timelineWrapper}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className={styles.timelineSvg}
          role="slider"
          aria-label="Curseur chronologique"
          aria-valuemin={0}
          aria-valuemax={EPOQUES.length - 1}
          aria-valuenow={activeIndex}
          aria-valuetext={epoque.label}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <defs>
            <linearGradient id="tl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              {gradStops.map((s) => (
                <stop key={s.offset} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
            <marker id="tl-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.6)" />
            </marker>
          </defs>

          {/* Track */}
          <line
            x1={PADDING}
            y1={TRACK_Y}
            x2={SVG_W - PADDING}
            y2={TRACK_Y}
            stroke="url(#tl-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#tl-arrow)"
          />

          {/* Era dots & labels */}
          {EPOQUES.map((e, i) => {
            const cx = xForIndex(i);
            const isActive = i === activeIndex;
            return (
              <g
                key={e.id}
                onClick={() => handleDotClick(i)}
                className={styles.dotGroup}
                role="button"
                tabIndex={-1}
                aria-label={e.label}
              >
                {/* Outer glow for active */}
                {isActive && (
                  <circle cx={cx} cy={TRACK_Y} r={DOT_R + 6} fill={e.couleur} opacity="0.25" />
                )}
                <circle
                  cx={cx}
                  cy={TRACK_Y}
                  r={isActive ? DOT_R + 2 : DOT_R}
                  fill={e.couleur}
                  stroke="#fff"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`${styles.dot} ${isActive ? styles.dotActive : ""}`}
                />
                <text
                  x={cx}
                  y={TRACK_Y + 20}
                  textAnchor="middle"
                  className={`${styles.dotLabel} ${isActive ? styles.dotLabelActive : ""}`}
                  fill={isActive ? e.couleur : "rgba(255,255,255,0.55)"}
                >
                  {e.label}
                </text>
              </g>
            );
          })}

          {/* Draggable thumb */}
          <circle
            cx={thumbX}
            cy={TRACK_Y}
            r={THUMB_R}
            fill="#fff"
            stroke={epoque.couleur}
            strokeWidth="3"
            className={`${styles.thumb} ${isDragging ? styles.thumbDragging : ""}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            aria-hidden="true"
          />
        </svg>
      </div>
    </section>
  );
}
