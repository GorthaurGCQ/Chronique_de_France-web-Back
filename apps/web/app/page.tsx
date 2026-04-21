import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AlaUne from "@/components/AlaUne";
import NosMissions from "@/components/NosMissions";

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
      <NosMissions />
    </main>
  );
}
