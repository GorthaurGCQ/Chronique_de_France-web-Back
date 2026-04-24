"use client";

import { useRef, useState } from "react";
import styles from "./ressource.module.css";

// ── Détection du type de média ───────────────────────────────────────────────

type MediaKind = "youtube" | "vimeo" | "video" | "audio" | "iframe" | "external";

function detectKind(url: string): MediaKind {
  if (/youtube\.com|youtu\.be/i.test(url))   return "youtube";
  if (/vimeo\.com/i.test(url))               return "vimeo";
  if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url)) return "video";
  if (/\.(mp3|wav|aac|flac|ogg)(\?|$)/i.test(url)) return "audio";
  if (/drive\.google\.com/i.test(url))       return "iframe";
  return "external";
}

function toYouTubeEmbed(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (!match) return url;
  const videoId = match[1];
  const timeMatch = url.match(/[?&]t=(\d+)/);
  const time = timeMatch ? `&start=${timeMatch[1]}` : "";
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1${time}`;
}

function toVimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (!match) return url;
  return `https://player.vimeo.com/video/${match[1]}?byline=0&portrait=0`;
}

function toDriveEmbed(url: string): string {
  // https://drive.google.com/file/d/FILE_ID/view → /preview
  return url.replace(/\/view(\?.*)?$/, "/preview");
}

// ── Composant ────────────────────────────────────────────────────────────────

export default function MediaPlayer({ url }: { url: string }) {
  const kind = detectKind(url);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(true);

  function requestFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  }

  if (kind === "external") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.mediaBtn}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Ouvrir le média dans un nouvel onglet
      </a>
    );
  }

  return (
    <div className={styles.mediaBlock}>
      {/* Barre de contrôle */}
      <div className={styles.mediaBar}>
        <span className={styles.mediaBarTitle}>
          {kind === "youtube" && "▶ YouTube"}
          {kind === "vimeo"   && "▶ Vimeo"}
          {kind === "video"   && "▶ Vidéo"}
          {kind === "audio"   && "🎵 Audio"}
          {kind === "iframe"  && "🔗 Document"}
        </span>
        <div className={styles.mediaBarActions}>
          <button
            type="button"
            className={styles.mediaBarBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Réduire" : "Afficher"}
          >
            {expanded ? "▲ Réduire" : "▼ Afficher"}
          </button>
          {kind !== "audio" && (
            <button
              type="button"
              className={styles.mediaBarBtn}
              onClick={requestFullscreen}
              aria-label="Plein écran"
            >
              ⛶ Plein écran
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mediaBarBtn}
            aria-label="Ouvrir dans un nouvel onglet"
          >
            ↗ Ouvrir
          </a>
        </div>
      </div>

      {/* Lecteur */}
      {expanded && (
        <div ref={containerRef} className={styles.mediaContainer}>
          {(kind === "youtube" || kind === "vimeo" || kind === "iframe") && (
            <iframe
              src={
                kind === "youtube" ? toYouTubeEmbed(url)
                : kind === "vimeo" ? toVimeoEmbed(url)
                : toDriveEmbed(url)
              }
              className={styles.mediaIframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              title="Média associé"
            />
          )}
          {kind === "video" && (
            <video
              src={url}
              controls
              className={styles.mediaVideo}
              aria-label="Vidéo associée à la ressource"
            />
          )}
          {kind === "audio" && (
            <audio
              src={url}
              controls
              className={styles.mediaAudio}
              aria-label="Audio associé à la ressource"
            />
          )}
        </div>
      )}
    </div>
  );
}
