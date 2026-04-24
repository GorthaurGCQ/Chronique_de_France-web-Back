"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";

type Resource = {
  id: string;
  titre: string;
  description: string;
  type: string;
  region: string | null;
  timeline: string | null;
  domaine: string | null;
  publishedAt: string;
  authorName: string | null;
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
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    titre: "",
    description: "",
    contenu: "",
    region: "NATIONAL",
    timeline: "ANTIQUITE",
    domaine: "PATRIMOINE_HISTOIRE",
    type: "CHRONOLOGIE",
  });

  async function fetchResources() {
    const res = await fetch("/api/admin/resources");
    const data = await res.json();
    if (data.success) setResources(data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchResources();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      setMessage({ type: "success", text: `Ressource "${data.data.titre}" publiée avec succès.` });
      setForm({ titre: "", description: "", contenu: "", region: "NATIONAL", timeline: "ANTIQUITE", domaine: "PATRIMOINE_HISTOIRE", type: "CHRONOLOGIE" });
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
      await fetchResources();
    } else {
      setMessage({ type: "error", text: data.message });
    }
    setDeleteLoading(null);
  }

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

      {/* Formulaire d'ajout */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Ajouter une ressource</h2>
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
              <textarea
                className={styles.formTextarea}
                placeholder="Contenu complet de la ressource…"
                required
                value={form.contenu}
                onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              />
            </div>
          </div>

          {message && (
            <p className={message.type === "success" ? styles.successMsg : styles.errorMsg}>
              {message.text}
            </p>
          )}

          <button type="submit" className={styles.btnSubmit} disabled={submitLoading}>
            {submitLoading ? "Publication…" : "Publier la ressource"}
          </button>
        </form>
      </div>

      {/* Liste des ressources */}
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.titre}</td>
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
                    <td>
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
