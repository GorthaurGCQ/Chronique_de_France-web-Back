// =============================================================================
// COMPOSANT CLIENT — Liste événements + formulaire d'inscription public
// Appel : POST /api/events/register { eventId, nom, prenom, email }
// =============================================================================

"use client";

// Module : node_modules/react
import { useState } from "react";
// Style : src/app/(V)/evenement/evenement.module.css
import styles from "@/app/(V)/evenement/evenement.module.css";

type EventItem = {
  id: string;
  titre: string;
  description: string;
  lieu: string;
  date: string;
  thumbnailUrl: string | null;
  region: string | null;
  domaine: string | null;
  authorName: string | null;
  capaciteMax?: number | null;
  inscriptionsConfirmees?: number;
  placesRestantes?: number | null;
  complet?: boolean;
  listeAttenteCount?: number;
};

const REGION_LABELS: Record<string, string> = {
  NATIONAL: "National", AUVERGNE_RHONE_ALPES: "Auvergne-Rhône-Alpes",
  BOURGOGNE_FRANCHE_COMTE: "Bourgogne-Franche-Comté", BRETAGNE: "Bretagne",
  CENTRE_VAL_DE_LOIRE: "Centre-Val de Loire", CORSE: "Corse",
  GRAND_EST: "Grand Est", HAUTS_DE_FRANCE: "Hauts-de-France",
  ILE_DE_FRANCE: "Île-de-France", NORMANDIE: "Normandie",
  NOUVELLE_AQUITAINE: "Nouvelle-Aquitaine", OCCITANIE: "Occitanie",
  PAYS_DE_LA_LOIRE: "Pays de la Loire", PROVENCE_ALPES_COTE_AZUR: "Provence-Alpes-Côte d'Azur",
};

const DOMAINE_LABELS: Record<string, string> = {
  PATRIMOINE_HISTOIRE: "Patrimoine & Histoire", CULTURE_TRADITIONS: "Culture & Traditions",
  ARCHITECTURE: "Architecture", GEOGRAPHIE: "Géographie",
  FIGURES_HISTORIQUES: "Figures Historiques", EVENEMENTS_MARQUANTS: "Événements Marquants",
};

const DOMAINE_COLORS: Record<string, string> = {
  PATRIMOINE_HISTOIRE: "#6b4c2a", CULTURE_TRADITIONS: "#2a4a6b",
  ARCHITECTURE: "#3a2a5a", GEOGRAPHIE: "#1a5a3a",
  FIGURES_HISTORIQUES: "#5a2a2a", EVENEMENTS_MARQUANTS: "#4a3a1a",
};

function formatDate(d: Date) {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// ── Modale d'inscription ─────────────────────────────────────────────────────

function RegisterModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const [form, setForm]     = useState({ nom: "", prenom: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registrationStatut, setRegistrationStatut] = useState<"CONFIRME" | "LISTE_ATTENTE">("CONFIRME");
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      eventId: event.id,
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      email: form.email.trim().toLowerCase(),
    };
    const res = await fetch("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      setSubmittedEmail(payload.email);
      setEmailSent(data.emailSent === true);
      setRegistrationStatut(data.statut === "LISTE_ATTENTE" ? "LISTE_ATTENTE" : "CONFIRME");
      setWaitlistPosition(data.listeAttentePosition ?? null);
      setSuccess(true);
    } else {
      setError(data.message ?? "Une erreur est survenue.");
    }
    setLoading(false);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>S&apos;inscrire</h2>
            <p className={styles.modalSubtitle}>{event.titre}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        {success ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>{registrationStatut === "LISTE_ATTENTE" ? "⏳" : "✓"}</div>
            <p className={styles.successTitle}>
              {registrationStatut === "LISTE_ATTENTE" ? "Liste d'attente" : "Inscription confirmée !"}
            </p>
            <p className={styles.successDesc}>
              {registrationStatut === "LISTE_ATTENTE" ? (
                <>
                  L&apos;événement <strong>{event.titre}</strong> est complet.
                  Vous êtes en liste d&apos;attente
                  {waitlistPosition != null ? <> (position {waitlistPosition})</> : null}.
                </>
              ) : (
                <>Vous êtes inscrit(e) à <strong>{event.titre}</strong>.</>
              )}
              {emailSent ? (
                <>
                  <br />
                  Un récapitulatif a été envoyé à <strong>{submittedEmail}</strong>.
                </>
              ) : (
                <>
                  <br />
                  Votre inscription est enregistrée, mais l&apos;e-mail de confirmation n&apos;a pas pu être envoyé.
                </>
              )}
            </p>
            <button className={styles.btnClose} onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <form className={styles.modalForm} onSubmit={handleSubmit}>
            <div className={styles.modalEventInfo}>
              <span>📅 {formatDate(new Date(event.date))} · {formatTime(new Date(event.date))}</span>
              <span>📍 {event.lieu}</span>
              {event.capaciteMax != null && (
                <span>
                  👥 {event.complet ? "Complet" : `${event.placesRestantes ?? 0} place(s) restante(s)`}
                  {event.listeAttenteCount ? ` · ${event.listeAttenteCount} en attente` : ""}
                </span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Prénom</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Jean"
                  required
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nom</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Dupont"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Adresse e-mail</label>
              <input
                type="email"
                className={styles.formInput}
                placeholder="votre@email.fr"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading
                ? "Inscription en cours…"
                : event.complet
                  ? "Rejoindre la liste d'attente"
                  : "Confirmer l'inscription"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Grille d'événements à venir ───────────────────────────────────────────────

export function UpcomingGrid({ events: list }: { events: EventItem[] }) {
  const [selected, setSelected] = useState<EventItem | null>(null);

  if (list.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Aucun événement prévu pour le moment.</p>
        <p className={styles.emptyHint}>Revenez bientôt pour découvrir notre prochain agenda.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {list.map((ev) => {
          const d = new Date(ev.date);
          const color = DOMAINE_COLORS[ev.domaine ?? ""] ?? "#2d2d2d";
          return (
            <article key={ev.id} className={styles.card}>
              <div
                className={styles.cardVisual}
                style={
                  ev.thumbnailUrl
                    ? { backgroundImage: `url(${ev.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: color }
                }
              >
                <div className={styles.cardDateBox}>
                  <span className={styles.cardDay}>{d.getDate()}</span>
                  <span className={styles.cardMonth}>{d.toLocaleDateString("fr-FR", { month: "short" })}</span>
                </div>
                {ev.domaine && (
                  <span className={styles.cardDomaine}>
                    {DOMAINE_LABELS[ev.domaine] ?? ev.domaine}
                  </span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{ev.titre}</h3>
                <p className={styles.cardDesc}>{ev.description}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardMetaItem}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {ev.lieu}
                  </span>
                  <span className={styles.cardMetaItem}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {formatDate(d)} · {formatTime(d)}
                  </span>
                  {ev.region && ev.region !== "NATIONAL" && (
                    <span className={styles.cardMetaItem}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                      </svg>
                      {REGION_LABELS[ev.region] ?? ev.region}
                    </span>
                  )}
                  {ev.capaciteMax != null && (
                    <span className={styles.cardMetaItem}>
                      👥 {ev.complet ? "Complet — liste d'attente" : `${ev.placesRestantes ?? 0} place(s) restante(s)`}
                    </span>
                  )}
                </div>
                <button
                  className={styles.btnRegister}
                  onClick={() => setSelected(ev)}
                >
                  {ev.complet ? "Liste d'attente →" : "S'inscrire →"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selected && (
        <RegisterModal event={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
