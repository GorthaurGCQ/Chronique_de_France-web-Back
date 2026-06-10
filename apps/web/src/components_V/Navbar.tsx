// =============================================================================
// COMPOSANT — Navigation principale (session, liens, recherche)
// Session : useSession() → affiche connexion ou menu utilisateur
// =============================================================================

"use client";

// Module : node_modules/react
import { useState, useEffect, useRef } from "react";
// Module : node_modules/next/link
import Link from "next/link";
// Module : node_modules/next/image
import Image from "next/image";
// Module : node_modules/next/navigation
import { usePathname, useRouter } from "next/navigation";
// Auth : src/lib/auth/auth-client.ts
import { useSession, signOut } from "@/lib/auth/auth-client";
// Composant : src/components_V/NavbarSearch.tsx
import NavbarSearch from "./NavbarSearch";
// Style : src/components_V/Navbar.module.css
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/bibliotheque", label: "Bibliothèque" },
  { href: "/evenement", label: "Événements" },
  { href: "/dashboard", label: "Espace membre" },
  { href: "/a-propos", label: "À propos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
        setIsOpen(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const userInitial  = session?.user?.name?.charAt(0).toUpperCase() ?? "?";
  const userImage    = (session?.user as { image?: string } | undefined)?.image ?? null;

  return (
    <header className={`${styles.header} ${visible ? styles.headerVisible : styles.headerHidden}`}>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/CDF_L.png"
            alt="Chronique de France"
            height={44}
            width={160}
            style={{ width: "auto", height: "44px", objectFit: "contain" }}
            priority
          />
          <span className={styles.logoText}>Chronique de France</span>
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
          {/* Actions (dans le menu mobile) */}
          <li className={styles.mobileActions}>
            <NavbarSearch fullWidth onNavigate={() => setIsOpen(false)} />
            {session ? (
              <div className={styles.userMenu}>
                <Link href="/dashboard" className={styles.userMenuLink} onClick={() => setIsOpen(false)}>
                  {userImage ? (
                    <Image src={userImage} alt="Avatar" width={32} height={32} className={styles.avatarImg} unoptimized />
                  ) : (
                    <span className={styles.avatar}>{userInitial}</span>
                  )}
                  <span>Dashboard</span>
                </Link>
                <button className={styles.btnSignOut} onClick={handleSignOut}>
                  Se déconnecter
                </button>
              </div>
            ) : (
              <Link href="/connexion" className={styles.btnConnexion} onClick={() => setIsOpen(false)}>
                Connexion
              </Link>
            )}
          </li>
        </ul>

        {/* Actions droite (desktop) */}
        <div className={styles.desktopActions}>
          <NavbarSearch />
          {session ? (
            <div className={styles.userMenu}>
              <Link href="/dashboard" className={styles.userMenuLink}>
                {userImage ? (
                  <Image src={userImage} alt="Avatar" width={32} height={32} className={styles.avatarImg} unoptimized />
                ) : (
                  <span className={styles.avatar}>{userInitial}</span>
                )}
                <span className={styles.userName}>Dashboard</span>
              </Link>
              <button className={styles.btnSignOut} onClick={handleSignOut}>
                Se déconnecter
              </button>
            </div>
          ) : (
            <Link href="/connexion" className={styles.btnConnexion}>
              Connexion
            </Link>
          )}
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
