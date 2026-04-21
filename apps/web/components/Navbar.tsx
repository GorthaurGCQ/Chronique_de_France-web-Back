"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/bibliotheque", label: "Bibliothèque" },
  { href: "/evenement", label: "Événements" },
  { href: "/a-propos", label: "À propos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <svg
            className={styles.logoIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <polygon points="10,1 19,10 10,19 1,10" fill="#b8933a" />
          </svg>
          <span>CHRONIQUES DE FRANCE</span>
        </Link>

        {/* Liens centre (desktop) */}
        <ul className={`${styles.navLinks} ${isOpen ? styles.navLinksOpen : ""}`}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${pathname === href ? styles.active : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          {/* Recherche + Connexion (dans le menu mobile) */}
          <li className={styles.mobileActions}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Rechercher..."
                className={styles.searchInput}
                aria-label="Rechercher"
              />
            </div>
            <Link href="/connexion" className={styles.btnConnexion}>
              Connexion
            </Link>
          </li>
        </ul>

        {/* Actions droite (desktop) */}
        <div className={styles.desktopActions}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Rechercher..."
              className={styles.searchInput}
              aria-label="Rechercher"
            />
          </div>
          <Link href="/connexion" className={styles.btnConnexion}>
            Connexion
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
        >
          <span className={`${styles.bar} ${isOpen ? styles.barOpen1 : ""}`} />
          <span className={`${styles.bar} ${isOpen ? styles.barOpen2 : ""}`} />
          <span className={`${styles.bar} ${isOpen ? styles.barOpen3 : ""}`} />
        </button>
      </nav>
    </header>
  );
}
