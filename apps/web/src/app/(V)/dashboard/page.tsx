"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, authClient } from "@/lib/auth/auth-client";
import styles from "./dashboard.module.css";

// ── Modal Avatar ──────────────────────────────────────────────────────────────

function AvatarModal({
  currentUrl,
  initial,
  onClose,
  onSaved,
}: {
  currentUrl: string | null;
  initial: string;
  onClose: () => void;
  onSaved: (url: string) => void;
}) {
  const [preview, setPreview]     = useState<string | null>(currentUrl);
  const [file, setFile]           = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(f.type)) { setError("Format non supporté (JPG, PNG, WEBP, GIF)."); return; }
    if (f.size > 5 * 1024 * 1024) { setError("L'image ne doit pas dépasser 5 Mo."); return; }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!file) { onClose(); return; }
    setUploading(true); setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/profile", { method: "POST", body: fd });
    const d = await res.json();
    if (d.success) { onSaved(d.url); onClose(); }
    else { setError(d.message ?? "Erreur lors de l'upload."); }
    setUploading(false);
  }

  // Fermer sur clic overlay
  function handleOverlayClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).dataset.overlay) onClose();
  }

  return (
    <div className={styles.modalOverlay} data-overlay="true" onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>Photo de profil</h3>

        {/* Prévisualisation */}
        <div className={styles.avatarPreviewWrap} onClick={() => inputRef.current?.click()}>
          {preview ? (
            <Image src={preview} alt="Aperçu" width={120} height={120} className={styles.avatarPreview} unoptimized />
          ) : (
            <div className={styles.avatarPreviewPlaceholder}>{initial}</div>
          )}
          <div className={styles.avatarPreviewOverlay}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Choisir une image</span>
          </div>
        </div>

        <p className={styles.modalHint}>
          Cliquez sur l&apos;aperçu pour parcourir vos fichiers.<br/>
          Formats acceptés : JPG, PNG, WEBP, GIF — max 5 Mo.
        </p>

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }} onChange={handleFile} />

        {error && <p className={styles.modalError}>{error}</p>}

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose} disabled={uploading}>Annuler</button>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={uploading || !file}>
            {uploading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

type Favorite = {
  id: string;
  resourceId: string;
  titre: string;
  description: string;
  type: string;
  timeline: string | null;
  thumbnailUrl: string | null;
  authorName: string | null;
  note: string | null;
  savedAt: string;
};

type HistoryItem = {
  resourceId: string;
  titre: string;
  description: string;
  type: string;
  timeline: string | null;
  thumbnailUrl: string | null;
  viewedAt: string;
};

type UserPrefs = {
  emailNotifications: boolean;
  defaultRegion: string;
};

// ── Constantes ───────────────────────────────────────────────────────────────

const TIMELINE_LABELS: Record<string, string> = {
  ANTIQUITE: "Antiquité", MOYEN_AGE: "Moyen-Âge", RENAISSANCE: "Renaissance",
  ANCIEN_REGIME: "Ancien Régime", REVOLUTION: "Révolution",
  XIXE_SIECLE: "XIXe siècle", CONTEMPORAIN: "Contemporain",
};

const TIMELINE_COLORS: Record<string, string> = {
  ANTIQUITE: "#6b6b2e", MOYEN_AGE: "#3a2318", RENAISSANCE: "#7a3b1e",
  ANCIEN_REGIME: "#1a3f4a", REVOLUTION: "#5a1820",
  XIXE_SIECLE: "#253560", CONTEMPORAIN: "#2d2d2d",
};

const TYPE_LABELS: Record<string, string> = {
  CHRONOLOGIE: "Chronologie", FICHE_THEMATIQUE: "Fiche thématique",
  DOCUMENT_EDUCATIF: "Document éducatif", PUBLICATION: "Publication",
};

const REGION_OPTIONS = [
  { value: "NATIONAL",                  label: "National (Toute la France)" },
  { value: "AUVERGNE_RHONE_ALPES",      label: "Auvergne-Rhône-Alpes" },
  { value: "BOURGOGNE_FRANCHE_COMTE",   label: "Bourgogne-Franche-Comté" },
  { value: "BRETAGNE",                  label: "Bretagne" },
  { value: "CENTRE_VAL_DE_LOIRE",       label: "Centre-Val de Loire" },
  { value: "CORSE",                     label: "Corse" },
  { value: "GRAND_EST",                 label: "Grand Est" },
  { value: "HAUTS_DE_FRANCE",           label: "Hauts-de-France" },
  { value: "ILE_DE_FRANCE",             label: "Île-de-France" },
  { value: "NORMANDIE",                 label: "Normandie" },
  { value: "NOUVELLE_AQUITAINE",        label: "Nouvelle-Aquitaine" },
  { value: "OCCITANIE",                 label: "Occitanie" },
  { value: "PAYS_DE_LA_LOIRE",          label: "Pays de la Loire" },
  { value: "PROVENCE_ALPES_COTE_AZUR",  label: "Provence-Alpes-Côte d'Azur" },
];

const DEFAULT_PREFS: UserPrefs = { emailNotifications: true, defaultRegion: "NATIONAL" };

// ── Composant principal ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Onglet actif
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "stats" | "favoris" | "historique" | "preferences">("profil");

  // ── Favoris ───────────────────────────────────────────────────────────────
  const [favorites, setFavorites]     = useState<Favorite[]>([]);
  const [favsLoading, setFavsLoading] = useState(true);

  // ── Historique ────────────────────────────────────────────────────────────
  const [history, setHistory]           = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // ── Préférences ───────────────────────────────────────────────────────────
  const [prefs, setPrefs]         = useState<UserPrefs>(DEFAULT_PREFS);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsMsg, setPrefsMsg]   = useState<string | null>(null);

  // ── Édition nom ──────────────────────────────────────────────────────────
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue]     = useState("");
  const [nameSaving, setNameSaving]   = useState(false);
  const [nameMsg, setNameMsg]         = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // ── Édition email ────────────────────────────────────────────────────────
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailValue, setEmailValue]     = useState("");
  const [emailSaving, setEmailSaving]   = useState(false);
  const [emailMsg, setEmailMsg]         = useState<string | null>(null);

  // ── Avatar ───────────────────────────────────────────────────────────────
  const [avatarUrl, setAvatarUrl]       = useState<string | null>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // ── Changement de mot de passe ────────────────────────────────────────────
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [showPwds, setShowPwds]       = useState(false);
  const [pwdSaving, setPwdSaving]     = useState(false);
  const [pwdMsg, setPwdMsg]           = useState<{ type: "ok" | "error"; text: string } | null>(null);

  // ── Critères du nouveau mot de passe ─────────────────────────────────────
  const pwdCriteria = {
    length:    newPwd.length >= 8,
    lowercase: /[a-z]/.test(newPwd),
    uppercase: /[A-Z]/.test(newPwd),
    number:    /[0-9]/.test(newPwd),
    symbol:    /[^A-Za-z0-9]/.test(newPwd),
  };
  const pwdAllMet   = Object.values(pwdCriteria).every(Boolean);
  const pwdMetCount = Object.values(pwdCriteria).filter(Boolean).length;
  const pwdColor    = pwdAllMet ? "#16a34a" : pwdMetCount >= 3 ? "#eab308" : "#ef4444";

  // ── Notes favoris ─────────────────────────────────────────────────────────
  const [editingNote, setEditingNote]   = useState<string | null>(null);
  const [noteValues, setNoteValues]     = useState<Record<string, string>>({});
  const [noteSaving, setNoteSaving]     = useState<string | null>(null);

  // ── Redirections ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPending && !session) router.replace("/connexion");
  }, [isPending, session, router]);

  // ── Chargement données ────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => { if (d.success) setFavorites(d.data); })
      .finally(() => setFavsLoading(false));

    fetch("/api/profile/history")
      .then((r) => r.json())
      .then((d) => { if (d.success) setHistory(d.data); })
      .finally(() => setHistoryLoading(false));

    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.userPreferences) {
          try { setPrefs(JSON.parse(d.userPreferences)); } catch { /* garder défauts */ }
        }
      });
  }, [session]);

  // ── Init champs ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (session?.user) {
      setNameValue(session.user.name ?? "");
      setEmailValue(session.user.email ?? "");
      setAvatarUrl((session.user as { image?: string }).image ?? null);
    }
  }, [session]);

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus();
  }, [editingName]);

  // ── Handlers Profil ──────────────────────────────────────────────────────
  async function saveName() {
    setNameSaving(true); setNameMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameValue }),
    });
    const d = await res.json();
    if (d.success) { setNameMsg("Nom mis à jour ✓"); setEditingName(false); router.refresh(); }
    else setNameMsg(d.message ?? "Erreur.");
    setNameSaving(false);
  }

  async function saveEmail() {
    setEmailSaving(true); setEmailMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailValue }),
    });
    const d = await res.json();
    if (d.success) { setEmailMsg("E-mail mis à jour ✓"); setEditingEmail(false); router.refresh(); }
    else setEmailMsg(d.message ?? "Erreur.");
    setEmailSaving(false);
  }


  // ── Handler Mot de passe ──────────────────────────────────────────────────
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    if (!pwdAllMet) { setPwdMsg({ type: "error", text: "Le nouveau mot de passe ne remplit pas tous les critères." }); return; }
    if (newPwd !== confirmPwd) { setPwdMsg({ type: "error", text: "Les mots de passe ne correspondent pas." }); return; }
    setPwdSaving(true);
    const res = await fetch("/api/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
    });
    const d = await res.json();
    if (d.success) {
      setPwdMsg({ type: "ok", text: "Mot de passe modifié avec succès ✓" });
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } else {
      setPwdMsg({ type: "error", text: d.message ?? "Erreur." });
    }
    setPwdSaving(false);
  }

  // ── Handler Préférences ──────────────────────────────────────────────────
  async function savePrefs() {
    setPrefsSaving(true); setPrefsMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPreferences: prefs }),
    });
    const d = await res.json();
    setPrefsMsg(d.success ? "Préférences enregistrées ✓" : (d.message ?? "Erreur."));
    setPrefsSaving(false);
  }

  // ── Handlers Favoris ─────────────────────────────────────────────────────
  async function removeFavorite(resourceId: string) {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    });
    setFavorites((p) => p.filter((f) => f.resourceId !== resourceId));
  }

  function startEditNote(fav: Favorite) {
    setEditingNote(fav.resourceId);
    setNoteValues((p) => ({ ...p, [fav.resourceId]: fav.note ?? "" }));
  }

  async function saveNote(resourceId: string) {
    setNoteSaving(resourceId);
    const note = noteValues[resourceId] ?? "";
    await fetch("/api/favorites", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId, note: note.trim() || null }),
    });
    setFavorites((p) => p.map((f) => f.resourceId === resourceId ? { ...f, note: note.trim() || null } : f));
    setEditingNote(null); setNoteSaving(null);
  }

  async function handleSignOut() {
    await signOut(); router.push("/"); router.refresh();
  }

  async function handleDeleteAccount() {
    if (!confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) return;
    await authClient.deleteUser();
    router.push("/"); router.refresh();
  }

  // ── Chargement ───────────────────────────────────────────────────────────
  if (isPending || !session) {
    return <div className={styles.loading}><span className={styles.loadingDot} /></div>;
  }

  const user = session.user;
  const userRole = (user as { role?: string }).role;
  const initial = user.name?.charAt(0).toUpperCase() ?? "?";
  const createdAtDate = user.createdAt instanceof Date ? user.createdAt : new Date(String(user.createdAt));
  const joinDate = createdAtDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const daysSinceJoin = Math.max(0, Math.floor((Date.now() - createdAtDate.getTime()) / 86400000));
  const totalReadTime = favorites.length * 3;

  // Répartition favoris par timeline
  const timelineCount: Record<string, number> = {};
  favorites.forEach((f) => { if (f.timeline) timelineCount[f.timeline] = (timelineCount[f.timeline] ?? 0) + 1; });
  const maxTimelineCount = Math.max(1, ...Object.values(timelineCount));

  const TABS = [
    { id: "profil",      icon: "👤", label: "Profil" },
    { id: "securite",    icon: "🔑", label: "Sécurité" },
    { id: "stats",       icon: "📊", label: "Statistiques" },
    { id: "favoris",     icon: "🔖", label: `Favoris (${favorites.length})` },
    { id: "historique",  icon: "🕐", label: "Historique" },
    { id: "preferences", icon: "⚙️", label: "Préférences" },
  ] as const;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>

        {/* ── Modal avatar ── */}
        {avatarModalOpen && (
          <AvatarModal
            currentUrl={avatarUrl}
            initial={initial}
            onClose={() => setAvatarModalOpen(false)}
            onSaved={(url) => { setAvatarUrl(url); router.refresh(); }}
          />
        )}

        {/* ── EN-TÊTE ── */}
        <div className={styles.hero}>
          {/* Avatar cliquable → ouvre le modal */}
          <div className={styles.avatarWrapper} onClick={() => setAvatarModalOpen(true)} title="Modifier la photo de profil">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" width={72} height={72} className={styles.avatarImg} unoptimized />
            ) : (
              <div className={styles.avatarLg}>{initial}</div>
            )}
            <div className={styles.avatarOverlay}>📷</div>
          </div>
          <div className={styles.heroInfo}>
            <h1 className={styles.heroName}>{user.name}</h1>
            <p className={styles.heroEmail}>{user.email}</p>
            <p className={styles.heroJoin}>Membre depuis le {joinDate}</p>
          </div>
          <div className={styles.heroRole}>
            {userRole === "founder" ? (
              <span className={`${styles.roleBadge} ${styles.roleBadgeFounder}`}>👑 Fondateur</span>
            ) : userRole === "admin" ? (
              <span className={`${styles.roleBadge} ${styles.roleBadgeAdmin}`}>Administrateur</span>
            ) : (
              <span className={`${styles.roleBadge} ${styles.roleBadgeUser}`}>Membre</span>
            )}
          </div>
        </div>

        {/* ── ONGLETS ── */}
        <nav className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span className={styles.tabLabel}>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.tabContent}>

          {/* ══════════════ ONGLET PROFIL ══════════════ */}
          {activeTab === "profil" && (
            <div className={styles.sectionGrid}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}><span className={styles.cardIcon}>👤</span> Informations personnelles</h2>

                {/* Nom */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Nom affiché</label>
                  {editingName ? (
                    <div className={styles.fieldEdit}>
                      <input ref={nameInputRef} className={styles.fieldInput} value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                      />
                      <button className={styles.btnSave} onClick={saveName} disabled={nameSaving}>{nameSaving ? "…" : "Enregistrer"}</button>
                      <button className={styles.btnCancel} onClick={() => setEditingName(false)}>Annuler</button>
                    </div>
                  ) : (
                    <div className={styles.fieldValue}>
                      <span>{user.name}</span>
                      <button className={styles.btnEdit} onClick={() => setEditingName(true)}>✏️ Modifier</button>
                    </div>
                  )}
                  {nameMsg && <p className={styles.nameMsg}>{nameMsg}</p>}
                </div>

                {/* Email */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Adresse e-mail</label>
                  {editingEmail ? (
                    <div className={styles.fieldEdit}>
                      <input className={styles.fieldInput} type="email" value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveEmail(); if (e.key === "Escape") setEditingEmail(false); }}
                      />
                      <button className={styles.btnSave} onClick={saveEmail} disabled={emailSaving}>{emailSaving ? "…" : "Enregistrer"}</button>
                      <button className={styles.btnCancel} onClick={() => setEditingEmail(false)}>Annuler</button>
                    </div>
                  ) : (
                    <div className={styles.fieldValue}>
                      <span>{user.email}</span>
                      <button className={styles.btnEdit} onClick={() => setEditingEmail(true)}>✏️ Modifier</button>
                    </div>
                  )}
                  {emailMsg && <p className={styles.nameMsg}>{emailMsg}</p>}
                </div>

                {/* Rôle */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Rôle</label>
                  <div className={styles.fieldValue}>
                    {userRole === "founder" ? (
                      <span className={`${styles.roleBadge} ${styles.roleBadgeFounder}`}>👑 Fondateur</span>
                    ) : userRole === "admin" ? (
                      <span className={`${styles.roleBadge} ${styles.roleBadgeAdmin}`}>Administrateur</span>
                    ) : (
                      <span className={`${styles.roleBadge} ${styles.roleBadgeUser}`}>Membre</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Actions compte */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle}><span className={styles.cardIcon}>⚙️</span> Mon compte</h2>
                <div className={styles.accountActions}>
                  {(userRole === "admin" || userRole === "founder") && (
                    <Link href="/admin" className={styles.btnAccount}>🛡️ Accéder au panneau admin</Link>
                  )}
                  <button className={styles.btnAccount} onClick={handleSignOut}>🚪 Se déconnecter</button>
                  <button className={`${styles.btnAccount} ${styles.btnAccountDanger}`} onClick={handleDeleteAccount}>
                    🗑️ Supprimer mon compte
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* ══════════════ ONGLET SÉCURITÉ ══════════════ */}
          {activeTab === "securite" && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}><span className={styles.cardIcon}>🔑</span> Changer le mot de passe</h2>
              <p className={styles.sectionHint}>
                Pour des raisons de sécurité, votre mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un symbole.
              </p>
              <form className={styles.pwdForm} onSubmit={changePassword}>
                {pwdMsg && (
                  <p className={pwdMsg.type === "ok" ? styles.msgOk : styles.msgError}>{pwdMsg.text}</p>
                )}

                <div className={styles.pwdField}>
                  <label className={styles.fieldLabel}>Mot de passe actuel</label>
                  <div className={styles.pwdInputRow}>
                    <input type={showPwds ? "text" : "password"} className={styles.fieldInput}
                      value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)}
                      placeholder="Votre mot de passe actuel" required />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPwds((v) => !v)}>
                      {showPwds ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <div className={styles.pwdField}>
                  <label className={styles.fieldLabel}>Nouveau mot de passe</label>
                  <div className={styles.pwdInputRow}>
                    <input type={showPwds ? "text" : "password"} className={styles.fieldInput}
                      value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                      placeholder="8 caractères minimum" required />
                  </div>
                  {newPwd.length > 0 && (
                    <div className={styles.criteriaBox}>
                      <div className={styles.criteriaBar}>
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className={styles.criteriaSegment}
                            style={{ background: i <= pwdMetCount ? pwdColor : "#e5e7eb" }} />
                        ))}
                      </div>
                      <ul className={styles.criteriaList}>
                        {[
                          { ok: pwdCriteria.length,    label: "8 caractères minimum" },
                          { ok: pwdCriteria.lowercase,  label: "Une minuscule" },
                          { ok: pwdCriteria.uppercase,  label: "Une majuscule" },
                          { ok: pwdCriteria.number,     label: "Un chiffre" },
                          { ok: pwdCriteria.symbol,     label: "Un symbole (!@#…)" },
                        ].map(({ ok, label }) => (
                          <li key={label} className={ok ? styles.criteriaOk : styles.criteriaKo}>
                            {ok ? "✓" : "✗"} {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={styles.pwdField}>
                  <label className={styles.fieldLabel}>Confirmer le nouveau mot de passe</label>
                  <input type={showPwds ? "text" : "password"}
                    className={`${styles.fieldInput} ${confirmPwd.length > 0 && confirmPwd !== newPwd ? styles.inputError : ""} ${confirmPwd.length > 0 && confirmPwd === newPwd && newPwd ? styles.inputSuccess : ""}`}
                    value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="••••••••" required />
                  {confirmPwd.length > 0 && confirmPwd !== newPwd && (
                    <p className={styles.fieldError}>Les mots de passe ne correspondent pas.</p>
                  )}
                  {confirmPwd.length > 0 && confirmPwd === newPwd && newPwd && (
                    <p className={styles.fieldOk}>✓ Les mots de passe correspondent.</p>
                  )}
                </div>

                <button type="submit" className={styles.btnPrimary}
                  disabled={pwdSaving || !pwdAllMet || newPwd !== confirmPwd || !currentPwd}>
                  {pwdSaving ? "Modification…" : "Modifier le mot de passe"}
                </button>
              </form>
            </section>
          )}

          {/* ══════════════ ONGLET STATISTIQUES ══════════════ */}
          {activeTab === "stats" && (
            <div className={styles.sectionGrid}>
              {/* Compteurs */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle}><span className={styles.cardIcon}>📊</span> Vue d&apos;ensemble</h2>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{favorites.length}</span>
                    <span className={styles.statLabel}>Ressources sauvegardées</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{history.length}</span>
                    <span className={styles.statLabel}>Ressources consultées</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{totalReadTime} min</span>
                    <span className={styles.statLabel}>Temps de lecture estimé</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {daysSinceJoin}j
                    </span>
                    <span className={styles.statLabel}>Jours d&apos;ancienneté</span>
                  </div>
                </div>
              </section>

              {/* Répartition par époque */}
              <section className={styles.card}>
                <h2 className={styles.cardTitle}><span className={styles.cardIcon}>📅</span> Favoris par époque</h2>
                {Object.keys(timelineCount).length === 0 ? (
                  <p className={styles.emptyMsg}>Aucun favori pour l&apos;instant.</p>
                ) : (
                  <ul className={styles.chartList}>
                    {Object.entries(timelineCount)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, count]) => (
                        <li key={key} className={styles.chartItem}>
                          <span className={styles.chartLabel}>{TIMELINE_LABELS[key] ?? key}</span>
                          <div className={styles.chartBarWrap}>
                            <div className={styles.chartBar}
                              style={{ width: `${(count / maxTimelineCount) * 100}%`, background: TIMELINE_COLORS[key] ?? "#333" }} />
                          </div>
                          <span className={styles.chartCount}>{count}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </section>
            </div>
          )}

          {/* ══════════════ ONGLET FAVORIS ══════════════ */}
          {activeTab === "favoris" && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <span className={styles.cardIcon}>🔖</span> Ressources sauvegardées
                <span className={styles.countBadge}>{favorites.length}</span>
              </h2>
              {favsLoading ? (
                <p className={styles.emptyMsg}>Chargement…</p>
              ) : favorites.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyMsg}>Aucune ressource sauvegardée pour l&apos;instant.</p>
                  <p className={styles.emptyHint}>Cliquez sur l&apos;icône 🔖 sur les cards pour sauvegarder des ressources.</p>
                  <Link href="/bibliotheque" className={styles.btnBrowse}>Explorer la bibliothèque →</Link>
                </div>
              ) : (
                <ul className={styles.favList}>
                  {favorites.map((fav) => {
                    const bg = TIMELINE_COLORS[fav.timeline ?? ""] ?? "#2d2d2d";
                    return (
                      <li key={fav.id} className={styles.favItem}>
                        <div className={styles.favThumb}
                          style={fav.thumbnailUrl
                            ? { backgroundImage: `url(${fav.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                            : { background: bg }}>
                          {fav.timeline && <span className={styles.favEpoque}>{TIMELINE_LABELS[fav.timeline] ?? fav.timeline}</span>}
                        </div>
                        <div className={styles.favBody}>
                          <span className={styles.favType}>{TYPE_LABELS[fav.type] ?? fav.type}</span>
                          <Link href={`/bibliotheque/${fav.resourceId}`} className={styles.favTitle}>{fav.titre}</Link>
                          <p className={styles.favDesc}>{fav.description}</p>
                          <div className={styles.favNote}>
                            {editingNote === fav.resourceId ? (
                              <div className={styles.favNoteEdit}>
                                <textarea className={styles.favNoteTextarea}
                                  placeholder="Ajoutez une note personnelle…"
                                  value={noteValues[fav.resourceId] ?? ""}
                                  onChange={(e) => setNoteValues((p) => ({ ...p, [fav.resourceId]: e.target.value }))}
                                  onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveNote(fav.resourceId); if (e.key === "Escape") setEditingNote(null); }}
                                  autoFocus rows={3} />
                                <div className={styles.favNoteActions}>
                                  <button className={styles.favNoteSave} onClick={() => saveNote(fav.resourceId)} disabled={noteSaving === fav.resourceId}>
                                    {noteSaving === fav.resourceId ? "…" : "Enregistrer"}
                                  </button>
                                  <button className={styles.favNoteCancel} onClick={() => setEditingNote(null)}>Annuler</button>
                                </div>
                              </div>
                            ) : fav.note ? (
                              <div className={styles.favNoteDisplay} onClick={() => startEditNote(fav)}>
                                <span className={styles.favNoteIcon}>📝</span>
                                <span className={styles.favNoteText}>{fav.note}</span>
                              </div>
                            ) : (
                              <button className={styles.favNoteAdd} onClick={() => startEditNote(fav)}>+ Ajouter une note</button>
                            )}
                          </div>
                          <div className={styles.favFooter}>
                            <span className={styles.favDate}>Sauvegardé le {new Date(fav.savedAt).toLocaleDateString("fr-FR")}</span>
                            <button className={styles.favRemove} onClick={() => removeFavorite(fav.resourceId)} aria-label="Retirer des favoris">✕</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {/* ══════════════ ONGLET HISTORIQUE ══════════════ */}
          {activeTab === "historique" && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}><span className={styles.cardIcon}>🕐</span> Dernières ressources consultées</h2>
              {historyLoading ? (
                <p className={styles.emptyMsg}>Chargement…</p>
              ) : history.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyMsg}>Aucune ressource consultée pour l&apos;instant.</p>
                  <p className={styles.emptyHint}>Les ressources que vous consultez apparaîtront ici.</p>
                  <Link href="/bibliotheque" className={styles.btnBrowse}>Explorer la bibliothèque →</Link>
                </div>
              ) : (
                <ul className={styles.historyList}>
                  {history.map((item) => (
                    <li key={item.resourceId} className={styles.historyItem}>
                      <div className={styles.historyThumb}
                        style={item.thumbnailUrl
                          ? { backgroundImage: `url(${item.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : { background: TIMELINE_COLORS[item.timeline ?? ""] ?? "#2d2d2d" }}>
                        <span className={styles.historyEpoque}>{TIMELINE_LABELS[item.timeline ?? ""] ?? ""}</span>
                      </div>
                      <div className={styles.historyBody}>
                        <span className={styles.historyType}>{TYPE_LABELS[item.type] ?? item.type}</span>
                        <Link href={`/bibliotheque/${item.resourceId}`} className={styles.historyTitle}>{item.titre}</Link>
                        <p className={styles.historyDesc}>{item.description}</p>
                        <span className={styles.historyDate}>
                          Consulté le {new Date(item.viewedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ══════════════ ONGLET PRÉFÉRENCES ══════════════ */}
          {activeTab === "preferences" && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}><span className={styles.cardIcon}>⚙️</span> Préférences</h2>
              <p className={styles.sectionHint}>Ces paramètres personnalisent votre expérience sur le site.</p>

              {prefsMsg && <p className={prefsMsg.includes("✓") ? styles.msgOk : styles.msgError}>{prefsMsg}</p>}

              {/* Notifications */}
              <div className={styles.prefRow}>
                <div className={styles.prefInfo}>
                  <span className={styles.prefLabel}>Notifications par e-mail</span>
                  <span className={styles.prefDesc}>Recevez un e-mail lors de nouveaux événements ou ressources publiés.</span>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={prefs.emailNotifications}
                    onChange={(e) => setPrefs((p) => ({ ...p, emailNotifications: e.target.checked }))} />
                  <span className={styles.toggleSlider} />
                </label>
              </div>

              {/* Région par défaut */}
              <div className={styles.prefRow}>
                <div className={styles.prefInfo}>
                  <span className={styles.prefLabel}>Région par défaut</span>
                  <span className={styles.prefDesc}>La région affichée en priorité lors de votre navigation.</span>
                </div>
                <select className={styles.prefSelect} value={prefs.defaultRegion}
                  onChange={(e) => setPrefs((p) => ({ ...p, defaultRegion: e.target.value }))}>
                  {REGION_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <button className={styles.btnPrimary} onClick={savePrefs} disabled={prefsSaving}>
                {prefsSaving ? "Enregistrement…" : "Enregistrer les préférences"}
              </button>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}
