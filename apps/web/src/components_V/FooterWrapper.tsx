// =============================================================================
// WRAPPER FOOTER — Masque le footer sur les pages /admin
// =============================================================================

"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Footer />;
}
