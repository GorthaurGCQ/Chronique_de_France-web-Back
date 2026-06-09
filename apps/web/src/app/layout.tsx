// =============================================================================
// LAYOUT RACINE — Polices, Navbar, Footer (toutes les pages sauf /admin)
// =============================================================================

// Module : node_modules/next
import type { Metadata } from "next";
// Module : node_modules/next/font/google
import { Cinzel_Decorative, MedievalSharp, Source_Sans_3 } from "next/font/google";
// Composant : src/components_V/NavbarWrapper.tsx
import NavbarWrapper from "@/components_V/NavbarWrapper";
// Composant : src/components_V/FooterWrapper.tsx
import FooterWrapper from "@/components_V/FooterWrapper";
// Module : src/app/globals.css
import "./globals.css";

/** Titres et accents — inspiration médiévale / patrimoniale */
const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

/** Accroches fantastiques (accueil, citations) */
const medievalSharp = MedievalSharp({
  variable: "--font-medieval",
  subsets: ["latin"],
  weight: "400",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chroniques de France",
  description:
    "Plateforme pédagogique et culturelle de la Fondation Chroniques de France — préserver et transmettre l'héritage de France.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cinzelDecorative.variable} ${medievalSharp.variable} ${sourceSans3.variable}`}
      >
        <NavbarWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
