// =============================================================================
// VUE ADMIN — CRUD événements + gestion inscriptions
// Appels : /api/admin/events, /api/admin/events/[id]/registrations, /api/admin/upload
// =============================================================================

"use client";

// Module : node_modules/react
import { useEffect, useRef, useState, useCallback } from "react";
// Style : src/app/(V)/admin/admin.module.css
import styles from "../admin.module.css";
// Composant : src/components_V/RichTextEditor.tsx
import RichTextEditor from "@/components_V/RichTextEditor";

type Registration = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  createdAt: string;
};

type Event = {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  lieu: string;
  date: string;
  thumbnailUrl: string | null;
  region: string | null;
  timeline: string | null;
  domaine: string | null;
  publishedAt: string;
  authorName: string | null;
};

const EMPTY_FORM = {
  titre:        "",
  description:  "",
  contenu:      "",
  lieu:         "",
  date:         "",
  thumbnailUrl: "",
  region:   "NATIONAL",
  timeline: "CONTEMPORAIN",
  domaine:  "EVENEMENTS_MARQUANTS",
};

const REGIONS = [
  { value: "NATIONAL",                label: "National (toute la France)" },
  { value: "AUVERGNE_RHONE_ALPES",    label: "Auvergne-Rhône-Alpes" },
  { value: "BOURGOGNE_FRANCHE_COMTE", label: "Bourgogne-Franche-Comté" },
  { value: "BRETAGNE",                label: "Bretagne" },
  { value: "CENTRE_VAL_DE_LOIRE",     label: "Centre-Val de Loire" },
  { value: "CORSE",                   label: "Corse" },
  { value: "GRAND_EST",               label: "Grand Est" },
  { value: "HAUTS_DE_FRANCE",         label: "Hauts-de-France" },
  { value: "ILE_DE_FRANCE",           label: "Île-de-France" },
  { value: "NORMANDIE",               label: "Normandie" },
  { value: "NOUVELLE_AQUITAINE",      label: "Nouvelle-Aquitaine" },
  { value: "OCCITANIE",               label: "Occitanie" },
  { value: "PAYS_DE_LA_LOIRE",        label: "Pays de la Loire" },
  { value: "PROVENCE_ALPES_COTE_AZUR",label: "Provence-Alpes-Côte d'Azur" },
];

const TIMELINES = [
  { value: "ANTIQUITE",    label: "Antiquité (av. J.-C. – Ve s.)" },
  { value: "MOYEN_AGE",    label: "Moyen-Âge (Ve – XVe s.)" },
  { value: "RENAISSANCE",  label: "Renaissance (XVe – XVIIe s.)" },
  { value: "ANCIEN_REGIME",label: "Ancien Régime (XVIIe – 1789)" },
  { value: "REVOLUTION",   label: "Révolution (1789 – 1815)" },
  { value: "XIXE_SIECLE",  label: "XIXe siècle (1815 – 1914)" },
  { value: "CONTEMPORAIN", label: "Contemporain (1914 – auj.)" },
];

const DOMAINES = [
  { value: "PATRIMOINE_HISTOIRE",  label: "Patrimoine & Histoire" },
  { value: "CULTURE_TRADITIONS",   label: "Culture & Traditions" },
  { value: "ARCHITECTURE",         label: "Architecture & Patrimoine Bâti" },
  { value: "GEOGRAPHIE",           label: "Géographie & Territoires" },
  { value: "FIGURES_HISTORIQUES",  label: "Figures Historiques" },
  { value: "EVENEMENTS_MARQUANTS", label: "Événements Marquants" },
];

const REGION_LABELS: Record<string, string> = {
  NATIONAL: "National", AUVERGNE_RHONE_ALPES: "Auvergne-Rhône-Alpes",
  BOURGOGNE_FRANCHE_COMTE: "Bourgogne-Franche-Comté", BRETAGNE: "Bretagne",
  CENTRE_VAL_DE_LOIRE: "Centre-Val de Loire", CORSE: "Corse",
  GRAND_EST: "Grand Est", HAUTS_DE_FRANCE: "Hauts-de-France",
  ILE_DE_FRANCE: "Île-de-France", NORMANDIE: "Normandie",
  NOUVELLE_AQUITAINE: "Nouvelle-Aquitaine", OCCITANIE: "Occitanie",
  PAYS_DE_LA_LOIRE: "Pays de la Loire", PROVENCE_ALPES_COTE_AZUR: "Provence-Alpes-Côte d'Azur",
};

const TIMELINE_LABELS: Record<string, string> = {
  ANTIQUITE: "Antiquité", MOYEN_AGE: "Moyen-Âge", RENAISSANCE: "Renaissance",
  ANCIEN_REGIME: "Ancien Régime", REVOLUTION: "Révolution",
  XIXE_SIECLE: "XIXe siècle", CONTEMPORAIN: "Contemporain",
};

const DOMAINE_LABELS: Record<string, string> = {
  PATRIMOINE_HISTOIRE: "Patrimoine & Histoire", CULTURE_TRADITIONS: "Culture & Traditions",
  ARCHITECTURE: "Architecture", GEOGRAPHIE: "Géographie",
  FIGURES_HISTORIQUES: "Figures Historiques", EVENEMENTS_MARQUANTS: "Événements Marquants",
};

function toDatetimeLocal(iso: string) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export default function AdminEvenements() {
  const [eventList, setEventList]         = useState<Event[]>([]);
  const [loading, setLoading]             = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [message, setMessage]             = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [form, setForm]                     = useState(EMPTY_FORM);
  // Inscrits
  const [viewingRegs, setViewingRegs]       = useState<Event | null>(null);
  const [registrations, setRegistrations]   = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading]       = useState(false);
  const formRef     = useRef<HTMLDivElement>(null);
  const thumbInputRef   = useRef<HTMLInputElement>(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbError, setThumbError]         = useState<string | null>(null);

  async function fetchEvents() {
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    if (data.success) setEventList(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchEvents(); }, []);

  function startEdit(ev: Event) {
    setEditingId(ev.id);
    setForm({
      titre:        ev.titre,
      description:  ev.description,
      contenu:      ev.contenu,
      lieu:         ev.lieu,
      date:         toDatetimeLocal(ev.date),
      thumbnailUrl: ev.thumbnailUrl ?? "",
      region:   ev.region   ?? "NATIONAL",
      timeline: ev.timeline ?? "CONTEMPORAIN",
      domaine:  ev.domaine  ?? "EVENEMENTS_MARQUANTS",
    });
    setMessage(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage(null);
    const isEditing = editingId !== null;
    const res = await fetch("/api/admin/events", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEditing ? { eventId: editingId, ...form } : form),
    });
    const data = await res.json();
    if (data.success) {
      setMessage({
        type: "success",
        text: isEditing
          ? `Événement "${data.data.titre}" modifié avec succès.`
          : `Événement "${data.data.titre}" publié avec succès.`,
      });
      setEditingId(null);
      setForm(EMPTY_FORM);
      await fetchEvents();
    } else {
      setMessage({ type: "error", text: data.message });
    }
    setSubmitLoading(false);
  }

  async function handleDelete(eventId: string, titre: string) {
    if (!confirm(`Supprimer l'événement "${titre}" ?`)) return;
    setDeleteLoading(eventId);
    const res = await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    const data = await res.json();
    if (data.success) {
      if (editingId === eventId) cancelEdit();
      await fetchEvents();
    } else {
      setMessage({ type: "error", text: data.message });
    }
    setDeleteLoading(null);
  }

  const handleThumbUpload = useCallback(async (file: File) => {
    setThumbUploading(true);
    setThumbError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setForm((prev) => ({ ...prev, thumbnailUrl: data.url }));
    } else {
      setThumbError(data.message ?? "Erreur lors de l'upload.");
    }
    setThumbUploading(false);
  }, []);

  async function openRegistrations(ev: Event) {
    setViewingRegs(ev);
    setRegsLoading(true);
    const res = await fetch(`/api/admin/events/${ev.id}/registrations`);
    const data = await res.json();
    if (data.success) setRegistrations(data.data);
    setRegsLoading(false);
  }

  async function deleteRegistration(regId: string) {
    if (!viewingRegs) return;
    if (!confirm("Supprimer cet inscrit ?")) return;
    await fetch(`/api/admin/events/${viewingRegs.id}/registrations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: regId }),
    });
    setRegistrations((prev) => prev.filter((r) => r.id !== regId));
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Événements</h1>
        <p className={styles.pageSubtitle}>Créer et gérer les événements affichés sur le site</p>
      </div>

      {/* ── Formulaire création / édition ── */}
      <div className={styles.formCard} ref={formRef}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 className={styles.formTitle} style={{ margin: 0 }}>
            {editingId ? "Modifier l'événement" : "Ajouter un événement"}
          </h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className={styles.btnAction}>
              ✕ Annuler
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>

            {/* Titre */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>Titre</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Ex : Conférence sur la Révolution française"
                required
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
              />
            </div>

            {/* Lieu */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Lieu</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Ex : Paris, Musée du Louvre"
                required
                value={form.lieu}
                onChange={(e) => setForm({ ...form, lieu: e.target.value })}
              />
            </div>

            {/* Date */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Date et heure</label>
              <input
                type="datetime-local"
                className={styles.formInput}
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            {/* Secteur géographique */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Secteur géographique</label>
              <select
                className={styles.formSelect}
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Timeline */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Période (Timeline)</label>
              <select
                className={styles.formSelect}
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              >
                {TIMELINES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Domaine */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Domaine</label>
              <select
                className={styles.formSelect}
                value={form.domaine}
                onChange={(e) => setForm({ ...form, domaine: e.target.value })}
              >
                {DOMAINES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>Description courte</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Résumé en une phrase"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Contenu riche */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>Contenu</label>
              <RichTextEditor
                value={form.contenu}
                onChange={(html) => setForm({ ...form, contenu: html })}
                placeholder="Décrivez l'événement en détail…"
              />
            </div>

            {/* Miniature */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>
                Miniature{" "}
                <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                  (optionnel — JPG, PNG, WebP · max 5 Mo · format recommandé : 400×240 px)
                </span>
              </label>
              <div
                style={{
                  border: "2px dashed #d4cfc5", borderRadius: "10px", padding: "1.25rem",
                  textAlign: "center", cursor: "pointer", background: "#faf9f7",
                }}
                onClick={() => thumbInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleThumbUpload(file);
                }}
              >
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbUpload(file);
                  }}
                />
                {thumbUploading ? (
                  <span style={{ color: "#b8933a", fontSize: "0.9rem" }}>⏳ Upload en cours…</span>
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                    🖼️ Cliquez ou déposez une image ici
                  </span>
                )}
              </div>
              {thumbError && (
                <p style={{ color: "#dc2626", fontSize: "0.82rem", marginTop: "0.4rem" }}>{thumbError}</p>
              )}
              {form.thumbnailUrl && !thumbUploading && (
                <div style={{ marginTop: "0.75rem", borderRadius: "8px", overflow: "hidden", position: "relative", maxWidth: "220px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.thumbnailUrl}
                    alt="Aperçu miniature"
                    style={{ width: "100%", aspectRatio: "5/3", objectFit: "cover", display: "block" }}
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, thumbnailUrl: "" }))}
                    style={{
                      position: "absolute", top: "6px", right: "6px",
                      background: "rgba(0,0,0,0.55)", color: "#fff",
                      border: "none", borderRadius: "6px", padding: "3px 8px",
                      fontSize: "0.75rem", cursor: "pointer",
                    }}
                  >
                    ✕ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>

          {message && (
            <p className={message.type === "success" ? styles.successMsg : styles.errorMsg}>
              {message.text}
            </p>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="submit" className={styles.btnSubmit} disabled={submitLoading}>
              {submitLoading
                ? (editingId ? "Enregistrement…" : "Publication…")
                : (editingId ? "Enregistrer les modifications" : "Publier l'événement")}
            </button>
            {editingId && (
              <button type="button" className={styles.btnAction} onClick={cancelEdit}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Liste des événements ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Événements publiés ({eventList.length})</h2>
        </div>

        {loading ? (
          <p style={{ padding: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>Chargement…</p>
        ) : eventList.length === 0 ? (
          <p style={{ padding: "1.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>Aucun événement pour le moment.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Lieu</th>
                  <th>Date</th>
                  <th>Région</th>
                  <th>Période</th>
                  <th>Domaine</th>
                  <th>Auteur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventList.map((ev) => (
                  <tr key={ev.id} style={editingId === ev.id ? { background: "rgba(184,147,58,0.06)" } : {}}>
                    <td style={{ fontWeight: 600 }}>{ev.titre}</td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{ev.lieu}</td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{formatDate(ev.date)}</td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{REGION_LABELS[ev.region ?? ""] ?? "—"}</td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{TIMELINE_LABELS[ev.timeline ?? ""] ?? "—"}</td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{DOMAINE_LABELS[ev.domaine ?? ""] ?? "—"}</td>
                    <td style={{ color: "#6b7280" }}>{ev.authorName ?? "—"}</td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className={styles.btnAction}
                        style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe" }}
                        onClick={() => openRegistrations(ev)}
                      >
                        👥 Inscrits
                      </button>
                      <button
                        className={styles.btnAction}
                        onClick={() => startEdit(ev)}
                        disabled={editingId === ev.id}
                      >
                        {editingId === ev.id ? "En cours…" : "Modifier"}
                      </button>
                      <button
                        className={`${styles.btnAction} ${styles.btnActionDanger}`}
                        disabled={deleteLoading === ev.id}
                        onClick={() => handleDelete(ev.id, ev.titre)}
                      >
                        {deleteLoading === ev.id ? "…" : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* ── MODALE INSCRITS ── */}
      {viewingRegs && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
          onClick={() => setViewingRegs(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: "16px", width: "100%",
              maxWidth: "640px", maxHeight: "80vh", display: "flex", flexDirection: "column",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1a1a2e" }}>
                  👥 Inscrits — {viewingRegs.titre}
                </h2>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", color: "#6b7280" }}>
                  {registrations.length} inscription{registrations.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setViewingRegs(null)}
                style={{ background: "#f3f4f6", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", color: "#6b7280", fontSize: "0.9rem" }}
              >✕</button>
            </div>

            {/* Corps */}
            <div style={{ overflowY: "auto", flex: 1, padding: "1rem 1.5rem" }}>
              {regsLoading ? (
                <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Chargement…</p>
              ) : registrations.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>
                  Aucun inscrit pour le moment.
                </p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                      <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>Prénom</th>
                      <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>Nom</th>
                      <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>E-mail</th>
                      <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>Date</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                        <td style={{ padding: "0.6rem 0.75rem", fontWeight: 600, color: "#1a1a2e" }}>{reg.prenom}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: "#374151" }}>{reg.nom}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: "#6b7280" }}>{reg.email}</td>
                        <td style={{ padding: "0.6rem 0.75rem", color: "#9ca3af", fontSize: "0.78rem" }}>
                          {new Date(reg.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td style={{ padding: "0.6rem 0.75rem" }}>
                          <button
                            onClick={() => deleteRegistration(reg.id)}
                            style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.8rem", padding: "2px 6px", borderRadius: "4px" }}
                            title="Supprimer cet inscrit"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
