// =============================================================================
// COUCHE FRONT — Page admin ressources
// Communique avec le back via fetch("/api/admin/resources") — voir fetchResources / handleSubmit
// =============================================================================
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "../admin.module.css";
import RichTextEditor from "@/components/RichTextEditor";

type Resource = {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  type: string;
  region: string | null;
  timeline: string | null;
  domaine: string | null;
  mediaUrl:     string | null;
  bannerUrl:    string | null;
  thumbnailUrl: string | null;
  publishedAt: string;
  authorName: string | null;
};

const EMPTY_FORM = {
  titre: "",
  description: "",
  contenu: "",
  region: "NATIONAL",
  timeline: "ANTIQUITE",
  domaine: "PATRIMOINE_HISTOIRE",
  type: "CHRONOLOGIE",
  mediaUrl:     "",
  bannerUrl:    "",
  thumbnailUrl: "",
};

const REGIONS = [
  { value: "NATIONAL", label: "National (toute la France)" },
  { value: "AUVERGNE_RHONE_ALPES", label: "Auvergne-Rhône-Alpes" },
  { value: "BOURGOGNE_FRANCHE_COMTE", label: "Bourgogne-Franche-Comté" },
  { value: "BRETAGNE", label: "Bretagne" },
  { value: "CENTRE_VAL_DE_LOIRE", label: "Centre-Val de Loire" },
  { value: "CORSE", label: "Corse" },
  { value: "GRAND_EST", label: "Grand Est" },
  { value: "HAUTS_DE_FRANCE", label: "Hauts-de-France" },
  { value: "ILE_DE_FRANCE", label: "Île-de-France" },
  { value: "NORMANDIE", label: "Normandie" },
  { value: "NOUVELLE_AQUITAINE", label: "Nouvelle-Aquitaine" },
  { value: "OCCITANIE", label: "Occitanie" },
  { value: "PAYS_DE_LA_LOIRE", label: "Pays de la Loire" },
  { value: "PROVENCE_ALPES_COTE_AZUR", label: "Provence-Alpes-Côte d'Azur" },
];

const TIMELINES = [
  { value: "ANTIQUITE", label: "Antiquité (av. J.-C. – Ve s.)" },
  { value: "MOYEN_AGE", label: "Moyen-Âge (Ve – XVe s.)" },
  { value: "RENAISSANCE", label: "Renaissance (XVe – XVIIe s.)" },
  { value: "ANCIEN_REGIME", label: "Ancien Régime (XVIIe – 1789)" },
  { value: "REVOLUTION", label: "Révolution (1789 – 1815)" },
  { value: "XIXE_SIECLE", label: "XIXe siècle (1815 – 1914)" },
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

const TYPES = [
  { value: "CHRONOLOGIE", label: "Chronologie" },
  { value: "FICHE_THEMATIQUE", label: "Fiche thématique" },
  { value: "DOCUMENT_EDUCATIF", label: "Document éducatif" },
  { value: "PUBLICATION", label: "Publication" },
];

const DOMAINE_LABELS: Record<string, string> = {
  PATRIMOINE_HISTOIRE:  "Patrimoine & Histoire",
  CULTURE_TRADITIONS:   "Culture & Traditions",
  ARCHITECTURE:         "Architecture & Patrimoine Bâti",
  GEOGRAPHIE:           "Géographie & Territoires",
  FIGURES_HISTORIQUES:  "Figures Historiques",
  EVENEMENTS_MARQUANTS: "Événements Marquants",
};

const TYPE_LABELS: Record<string, string> = {
  CHRONOLOGIE: "Chronologie",
  FICHE_THEMATIQUE: "Fiche thématique",
  DOCUMENT_EDUCATIF: "Document éducatif",
  PUBLICATION: "Publication",
};

const REGION_LABELS: Record<string, string> = {
  NATIONAL: "National",
  AUVERGNE_RHONE_ALPES: "Auvergne-Rhône-Alpes",
  BOURGOGNE_FRANCHE_COMTE: "Bourgogne-Franche-Comté",
  BRETAGNE: "Bretagne",
  CENTRE_VAL_DE_LOIRE: "Centre-Val de Loire",
  CORSE: "Corse",
  GRAND_EST: "Grand Est",
  HAUTS_DE_FRANCE: "Hauts-de-France",
  ILE_DE_FRANCE: "Île-de-France",
  NORMANDIE: "Normandie",
  NOUVELLE_AQUITAINE: "Nouvelle-Aquitaine",
  OCCITANIE: "Occitanie",
  PAYS_DE_LA_LOIRE: "Pays de la Loire",
  PROVENCE_ALPES_COTE_AZUR: "Provence-Alpes-Côte d'Azur",
};

const TIMELINE_LABELS: Record<string, string> = {
  ANTIQUITE: "Antiquité",
  MOYEN_AGE: "Moyen-Âge",
  RENAISSANCE: "Renaissance",
  ANCIEN_REGIME: "Ancien Régime",
  REVOLUTION: "Révolution",
  XIXE_SIECLE: "XIXe siècle",
  CONTEMPORAIN: "Contemporain",
};

export default function AdminRessources() {
  const [resources, setResources]     = useState<Resource[]>([]);
  const [loading, setLoading]         = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [message, setMessage]         = useState<{ type: "success" | "error"; text: string } | null>(null);

  // null = mode création, string = ID de la ressource en cours d'édition
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const formRef = useRef<HTMLDivElement>(null);
  const bannerInputRef    = useRef<HTMLInputElement>(null);
  const [bannerUploading, setBannerUploading]     = useState(false);
  const [bannerError, setBannerError]             = useState<string | null>(null);

  const thumbInputRef     = useRef<HTMLInputElement>(null);
  const [thumbUploading, setThumbUploading]       = useState(false);
  const [thumbError, setThumbError]               = useState<string | null>(null);

  // FRONT → BACK : chargement de la liste au montage de la page admin
  async function fetchResources() {
    const res = await fetch("/api/admin/resources"); // GET → app/api/admin/resources/route.ts
    const data = await res.json(); // parse la réponse JSON du serveur
    if (data.success) setResources(data.data); // met à jour l'état React si succès
    setLoading(false);
  }

  useEffect(() => { fetchResources(); }, []); // appel une fois au chargement

  // Passer en mode édition
  function startEdit(r: Resource) {
    setEditingId(r.id);
    setForm({
      titre:       r.titre,
      description: r.description,
      contenu:     r.contenu,
      region:      r.region      ?? "NATIONAL",
      timeline:    r.timeline    ?? "ANTIQUITE",
      domaine:     r.domaine     ?? "PATRIMOINE_HISTOIRE",
      type:        r.type        ?? "CHRONOLOGIE",
      mediaUrl:     r.mediaUrl     ?? "",
      bannerUrl:    r.bannerUrl    ?? "",
      thumbnailUrl: r.thumbnailUrl ?? "",
    });
    setMessage(null);
    // Scroll vers le formulaire
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  // Annuler l'édition → retour au mode création
  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage(null);
  }

  // FRONT → BACK : création (POST) ou modification (PATCH) d'une ressource
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage(null);

    const isEditing = editingId !== null;
    const res = await fetch("/api/admin/resources", {
      method: isEditing ? "PATCH" : "POST", // verbe HTTP selon le mode formulaire
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEditing ? { resourceId: editingId, ...form } : form), // corps JSON
    });
    const data = await res.json(); // { success, data, message } renvoyé par route.ts

    if (data.success) {
      setMessage({
        type: "success",
        text: isEditing
          ? `Ressource "${data.data.titre}" modifiée avec succès.`
          : `Ressource "${data.data.titre}" publiée avec succès.`,
      });
      setEditingId(null);
      setForm(EMPTY_FORM);
      await fetchResources();
    } else {
      setMessage({ type: "error", text: data.message });
    }
    setSubmitLoading(false);
  }

  async function handleDelete(resourceId: string, titre: string) {
    if (!confirm(`Supprimer la ressource "${titre}" ?`)) return;
    setDeleteLoading(resourceId);
    const res = await fetch("/api/admin/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    });
    const data = await res.json();
    if (data.success) {
      if (editingId === resourceId) cancelEdit();
      await fetchResources();
    } else {
      setMessage({ type: "error", text: data.message });
    }
    setDeleteLoading(null);
  }

  const handleBannerUpload = useCallback(async (file: File) => {
    setBannerUploading(true);
    setBannerError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setForm((prev) => ({ ...prev, bannerUrl: data.url }));
    } else {
      setBannerError(data.message ?? "Erreur lors de l'upload.");
    }
    setBannerUploading(false);
  }, []);

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

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Ressources</h1>
        <p className={styles.pageSubtitle}>Publier et gérer les ressources de la bibliothèque</p>
      </div>

      {/* ── Formulaire création / édition ── */}
      <div className={styles.formCard} ref={formRef}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 className={styles.formTitle} style={{ margin: 0 }}>
            {editingId ? `Modifier la ressource` : "Ajouter une ressource"}
          </h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className={styles.btnAction}>
              ✕ Annuler
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>Titre</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Ex : La Révolution française"
                required
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
              />
            </div>
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
            <div className={styles.formField}>
              <label className={styles.formLabel}>Type de ressource</label>
              <select
                className={styles.formSelect}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
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
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>Contenu</label>
              <RichTextEditor
                value={form.contenu}
                onChange={(html) => setForm({ ...form, contenu: html })}
                placeholder="Rédigez le contenu complet de la ressource…"
              />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>
                Lien média{" "}
                <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                  (optionnel — YouTube, Google Drive, lien direct MP3/MP4…)
                </span>
              </label>
              <input
                type="url"
                className={styles.formInput}
                placeholder="https://…"
                value={form.mediaUrl}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
              />
            </div>
            {/* ── Miniature ── */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>
                Miniature de la carte{" "}
                <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                  (optionnel — JPG, PNG, WebP · max 5 Mo · format recommandé : 400×240 px)
                </span>
              </label>

              <div
                style={{
                  border: "2px dashed #d4cfc5", borderRadius: "10px", padding: "1.25rem",
                  textAlign: "center", cursor: "pointer", background: "#faf9f7",
                  transition: "border-color 0.15s",
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

            {/* ── Bannière ── */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>
                Bannière{" "}
                <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                  (optionnel — JPG, PNG, WebP · max 5 Mo · format recommandé : 1320×300 px)
                </span>
              </label>

              {/* Zone de dépôt */}
              <div
                style={{
                  border: "2px dashed #d4cfc5",
                  borderRadius: "10px",
                  padding: "1.25rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#faf9f7",
                  transition: "border-color 0.15s",
                }}
                onClick={() => bannerInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleBannerUpload(file);
                }}
              >
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBannerUpload(file);
                  }}
                />
                {bannerUploading ? (
                  <span style={{ color: "#b8933a", fontSize: "0.9rem" }}>⏳ Upload en cours…</span>
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                    📁 Cliquez ou déposez une image ici
                  </span>
                )}
              </div>

              {bannerError && (
                <p style={{ color: "#dc2626", fontSize: "0.82rem", marginTop: "0.4rem" }}>{bannerError}</p>
              )}

              {/* Aperçu + bouton supprimer */}
              {form.bannerUrl && !bannerUploading && (
                <div style={{ marginTop: "0.75rem", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.bannerUrl}
                    alt="Aperçu bannière"
                    style={{ width: "100%", maxHeight: "140px", objectFit: "cover", display: "block" }}
                  />
                  <button
                    type="button"
                    onClick={() => { setForm((p) => ({ ...p, bannerUrl: "" })); }}
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
                : (editingId ? "Enregistrer les modifications" : "Publier la ressource")}
            </button>
            {editingId && (
              <button type="button" className={styles.btnAction} onClick={cancelEdit}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Liste des ressources ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Ressources publiées ({resources.length})</h2>
        </div>

        {loading ? (
          <p style={{ padding: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>Chargement…</p>
        ) : resources.length === 0 ? (
          <p style={{ padding: "1.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>Aucune ressource publiée pour le moment.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Région</th>
                  <th>Période</th>
                  <th>Domaine</th>
                  <th>Type</th>
                  <th>Auteur</th>
                  <th>Publié le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id} style={editingId === r.id ? { background: "rgba(184,147,58,0.06)" } : {}}>
                    <td style={{ fontWeight: 600 }}>
                      {r.titre}
                      {r.mediaUrl && (
                        <span title="Contient un lien média" style={{ marginLeft: "0.4rem", fontSize: "0.8rem" }}>🎬</span>
                      )}
                    </td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{REGION_LABELS[r.region ?? ""] ?? r.region ?? "—"}</td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{TIMELINE_LABELS[r.timeline ?? ""] ?? r.timeline ?? "—"}</td>
                    <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{DOMAINE_LABELS[r.domaine ?? ""] ?? r.domaine ?? "—"}</td>
                    <td>
                      <span className={styles.roleUser} style={{ background: "#f0fdf4", color: "#15803d" }}>
                        {TYPE_LABELS[r.type] ?? r.type}
                      </span>
                    </td>
                    <td style={{ color: "#6b7280" }}>{r.authorName ?? "—"}</td>
                    <td style={{ color: "#6b7280" }}>{formatDate(r.publishedAt)}</td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className={styles.btnAction}
                        onClick={() => startEdit(r)}
                        disabled={editingId === r.id}
                      >
                        {editingId === r.id ? "En cours…" : "Modifier"}
                      </button>
                      <button
                        className={`${styles.btnAction} ${styles.btnActionDanger}`}
                        disabled={deleteLoading === r.id}
                        onClick={() => handleDelete(r.id, r.titre)}
                      >
                        {deleteLoading === r.id ? "…" : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
