import type { Metadata } from "next";
import Hero from "@/components_V/Hero";
import AlaUne from "@/components_V/AlaUne";
import ProchainEvenements from "@/components_V/ProchainEvenements";
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
