"use client";

import { useState } from "react";
import type { TerritoireInfo } from "@/data/territoires/types";
import type { Epoque } from "@/data/epoques";
import styles from "./LegendeEpoque.module.css";

type Props = {
  epoque: Epoque;
  territoires: TerritoireInfo[];
};

export default function LegendeEpoque({ epoque, territoires }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.legend}>
      <button
        className={styles.header}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        type="button"
      >
        <span className={styles.title}>Légende</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`} aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <>
          <ul className={styles.list}>
            {territoires.map((t) => (
              <li key={t.id} className={styles.item}>
                <span className={styles.swatch} style={{ background: t.couleur }} />
                <span className={styles.label}>{t.nom}</span>
              </li>
            ))}
          </ul>
          <div className={styles.source}>
            <span className={styles.sourceLabel}>Source :</span>
            <span className={styles.sourceText}>{epoque.sourceCartographique}</span>
          </div>
        </>
      )}
    </div>
  );
}
