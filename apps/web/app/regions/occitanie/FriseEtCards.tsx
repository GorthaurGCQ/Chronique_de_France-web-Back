"use client";

import { useState, useEffect, useRef } from "react";
import { OCCITANIE_CATEGORIES } from "@/data/occitaniaData";
import styles from "./occitanie.module.css";

/* ── Époques de la frise ── */
const EPOQUES = [
  { id: "ANTIQUITÉ",     label: "Antiquité",    date: "av. J.-C. – Ve s." },
  { id: "MOYEN-ÂGE",    label: "Moyen-Âge",    date: "Ve – XVe s." },
  { id: "RENAISSANCE",   label: "Renaissance",   date: "XVe – XVIIe s." },
  { id: "ANCIEN RÉGIME", label: "Ancien Régime", date: "XVIIe – 1789" },
  { id: "RÉVOLUTION",    label: "Révolution",    date: "1789 – 1815" },
  { id: "XIXe SIÈCLE",   label: "XIXe siècle",   date: "1815 – 1914" },
  { id: "CONTEMPORAINE", label: "Contemporain",  date: "1914 – auj." },
] as const;

function IconBookmark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function FriseEtCards() {
  const [catIdx, setCatIdx]           = useState(0);
  const [epoqueFilter, setEpoqueFilter] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCat  = OCCITANIE_CATEGORIES[catIdx];
  const nbCats      = OCCITANIE_CATEGORIES.length;
  const filteredCards = epoqueFilter
    ? currentCat.cards.filter((c) => c.epoque === epoqueFilter)
    : currentCat.cards;

  /* Changer de catégorie via les flèches */
  function prevCat() {
    setCatIdx((i) => (i - 1 + nbCats) % nbCats);
    setEpoqueFilter(null);
    setDropdownOpen(false);
  }
  function nextCat() {
    setCatIdx((i) => (i + 1) % nbCats);
    setEpoqueFilter(null);
    setDropdownOpen(false);
  }
  function selectCat(idx: number) {
    setCatIdx(idx);
    setEpoqueFilter(null);
    setDropdownOpen(false);
  }

  /* Fermer le dropdown au clic extérieur */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* ── SÉLECTEUR DE CATÉGORIE ── */}
      <div className={styles.catSection}>

        {/* Navigation roulette */}
        <div className={styles.catNav}>
          <button type="button" className={styles.catArrow} onClick={prevCat} aria-label="Catégorie précédente">
            ←
          </button>

          <div className={styles.catCenter} ref={dropdownRef}>
            <button
              type="button"
              className={styles.catTitle}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              <span>{currentCat.label}</span>
              <span className={`${styles.catChevron} ${dropdownOpen ? styles.catChevronOpen : ""}`}>▾</span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <ul className={styles.catDropdown} role="listbox">
                {OCCITANIE_CATEGORIES.map((cat, i) => (
                  <li key={cat.id} role="option" aria-selected={i === catIdx}>
                    <button
                      type="button"
                      className={`${styles.catDropdownItem} ${i === catIdx ? styles.catDropdownItemActive : ""}`}
                      onClick={() => selectCat(i)}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="button" className={styles.catArrow} onClick={nextCat} aria-label="Catégorie suivante">
            →
          </button>
        </div>

        {/* Sous-titre */}
        <p className={styles.catSubtitle}>{currentCat.subtitle}</p>

        {/* Indicateur de position (dots) */}
        <div className={styles.catDots} aria-hidden="true">
          {OCCITANIE_CATEGORIES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.catDot} ${i === catIdx ? styles.catDotActive : ""}`}
              onClick={() => selectCat(i)}
              aria-label={`Catégorie ${i + 1}`}
            />
          ))}
        </div>

        <span className={styles.aboutDivider} aria-hidden="true" />
      </div>

      {/* ── FRISE CHRONOLOGIQUE ── */}
      <div className={styles.frise} role="navigation" aria-label="Filtrer par époque">
        <button
          type="button"
          className={`${styles.friseTout} ${epoqueFilter === null ? styles.friseToutActive : ""}`}
          onClick={() => setEpoqueFilter(null)}
        >
          Tout
        </button>

        <div className={styles.friseTrack}>
          <div className={styles.friseLine} />
          {EPOQUES.map((epoque) => {
              const isActive = epoqueFilter === epoque.id;
              return (
                <button
                  key={epoque.id}
                  type="button"
                  onClick={() => setEpoqueFilter(isActive ? null : epoque.id)}
                  className={`${styles.frisePoint} ${isActive ? styles.frisePointActive : ""}`}
                  aria-pressed={isActive}
                  title={epoque.date}
                >
                <span className={styles.frisePointDate}>{epoque.date}</span>
                <span className={styles.frisePointDot} />
                <span className={styles.frisePointLabel}>{epoque.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRILLE DE CARDS ── */}
      {currentCat.cards.length === 0 ? (
        <div className={styles.catEmpty}>
          <span className={styles.catEmptyIcon}>🏛️</span>
          <p className={styles.catEmptyText}>
            Les ressources pour cette catégorie sont en cours de préparation.
          </p>
          <p className={styles.catEmptyHint}>Revenez bientôt — de nouveaux contenus seront ajoutés prochainement.</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <p className={styles.friseEmpty}>
          Aucun contenu pour cette période — d&apos;autres ressources seront ajoutées prochainement.
        </p>
      ) : (
        <div className={styles.grid} key={`${catIdx}-${epoqueFilter ?? "all"}`}>
          {filteredCards.map((card) => (
            <article key={card.id} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <div className={styles.cardImage} style={{ background: card.gradient }} aria-hidden="true" />
                <span className={styles.cardEpoque} style={{ background: card.epoqueColor }}>{card.epoque}</span>
                <button type="button" className={styles.cardBookmark} aria-label={`Sauvegarder : ${card.titre}`}>
                  <IconBookmark />
                </button>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardType}>{card.type}</span>
                <h3 className={styles.cardTitle}>{card.titre}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardReadTime}>{card.readTime}</span>
                  <button type="button" className={styles.cardArrow} aria-label={`Voir ${card.titre}`}>→</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
