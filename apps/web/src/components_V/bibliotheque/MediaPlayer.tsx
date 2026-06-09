"use client";

// Module : node_modules/react
import { useRef, useState } from "react";
// Composant : src/components_V/icons/AppIcon.tsx
import AppIcon from "@/components_V/icons/AppIcon";
import type { IconName } from "@/components_V/icons/types";
// Style : src/app/(V)/bibliotheque/[id]/ressource.module.css
import styles from "@/app/(V)/bibliotheque/[id]/ressource.module.css";

type MediaKind = "youtube" | "vimeo" | "video" | "audio" | "iframe" | "external";

const KIND_LABELS: Record<Exclude<MediaKind, "external">, { icon: IconName; label: string }> = {
  youtube: { icon: "play", label: "YouTube" },
  vimeo: { icon: "play", label: "Vimeo" },
  video: { icon: "play", label: "Vidéo" },
  audio: { icon: "music", label: "Audio" },
  iframe: { icon: "link", label: "Document" },
};

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
  return url.replace(/\/view(\?.*)?$/, "/preview");
}

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
        <AppIcon name="external" size={18} tone="inherit" />
        Ouvrir le média dans un nouvel onglet
      </a>
    );
  }

  const kindInfo = KIND_LABELS[kind];

  return (
    <div className={styles.mediaBlock}>
      <div className={styles.mediaBar}>
        <span className={styles.mediaBarTitle}>
          <AppIcon name={kindInfo.icon} size={16} className={styles.mediaBarIcon} />
          {kindInfo.label}
        </span>
        <div className={styles.mediaBarActions}>
          <button
            type="button"
            className={styles.mediaBarBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Réduire" : "Afficher"}
          >
            <AppIcon name={expanded ? "chevronUp" : "chevronDown"} size={14} tone="inherit" className={styles.mediaBarBtnIcon} />
            {expanded ? "Réduire" : "Afficher"}
          </button>
          {kind !== "audio" && (
            <button
              type="button"
              className={styles.mediaBarBtn}
              onClick={requestFullscreen}
              aria-label="Plein écran"
            >
              <AppIcon name="fullscreen" size={14} tone="inherit" className={styles.mediaBarBtnIcon} />
              Plein écran
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mediaBarBtn}
            aria-label="Ouvrir dans un nouvel onglet"
          >
            <AppIcon name="external" size={14} tone="inherit" className={styles.mediaBarBtnIcon} />
            Ouvrir
          </a>
        </div>
      </div>

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
