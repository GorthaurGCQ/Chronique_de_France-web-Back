// =============================================================================
// WRAPPER NAVBAR — Masque la navbar sur les pages /admin (layout admin dédié)
// =============================================================================

"use client";

// Module : node_modules/next/navigation
import { usePathname } from "next/navigation";
// Composant : src/components_V/Navbar.tsx
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  // Pas de navbar publique dans l'espace admin
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
