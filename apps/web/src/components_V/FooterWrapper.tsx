// =============================================================================
// WRAPPER FOOTER — Masque le footer sur les pages /admin
// =============================================================================

"use client";

// Module : node_modules/next/navigation
import { usePathname } from "next/navigation";
// Composant : src/components_V/Footer.tsx
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Footer />;
}
