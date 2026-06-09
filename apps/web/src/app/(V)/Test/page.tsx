// Module : node_modules/next
import type { Metadata } from "next";
// Composant : src/components_V/Hero.tsx
import Hero from "@/components_V/Hero";
// Composant : src/components_V/AlaUne.tsx
import AlaUne from "@/components_V/AlaUne";
// Composant : src/components_V/ProchainEvenements.tsx
import ProchainEvenements from "@/components_V/ProchainEvenements";
// Composant : src/components_V/NosMissions.tsx
import NosMissions from "@/components_V/NosMissions";

export const metadata: Metadata = {
  title: "Accueil | Chroniques de France",
  description:
    "Bienvenue sur la plateforme de la Fondation Chroniques de France — préserver et transmettre l'héritage historique et culturel français.",
};

export default function AccueilPage() {
  return (
    <main>
      <Hero />
      <AlaUne />
      <ProchainEvenements />
      <NosMissions />
    </main>
  );
}
