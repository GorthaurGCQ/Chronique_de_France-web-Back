import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Événements | Chronique de France",
  description:
    "Consultez l'agenda culturel de la Fondation Chroniques de France : conférences, expositions, ateliers et rencontres.",
};

export default function EvenementPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Événements</h1>
      <p>
        Découvrez l&apos;agenda culturel de la Fondation Chroniques de France :
        conférences, expositions, ateliers pédagogiques et rencontres
        scientifiques autour du patrimoine historique français.
      </p>
    </main>
  );
}
