import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | Chronique de France",
  description:
    "En savoir plus sur la mission, les valeurs et l'équipe de la Fondation Chroniques de France.",
};

export default function AProposPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>À propos</h1>
      <p>
        La Fondation Chroniques de France a pour mission de préserver et de
        transmettre le patrimoine historique et culturel français. Portée par
        une équipe de chercheurs, d&apos;enseignants et de passionnés
        d&apos;histoire, elle met à disposition des ressources pédagogiques
        accessibles à tous.
      </p>
    </main>
  );
}
