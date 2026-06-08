// =============================================================================
// VUE ADMIN — Gestion utilisateurs + permissions granulaires (customPermissions)
// Appels : GET/PATCH /api/admin/users
// =============================================================================

"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import styles from "../admin.module.css";
import permStyles from "./permissions.module.css";

// ── Définition des permissions ───────────────────────────────────────────────

export type Permission =
  | "CREER_RESSOURCES"
  | "MODIFIER_RESSOURCES"
  | "SUPPRIMER_RESSOURCES"
  | "IMPORTER_MEDIAS"
  | "VOIR_TABLEAU_BORD"
  | "GERER_UTILISATEURS"
  | "GERER_RESSOURCES_ADMIN"
  | "ACCES_EVENEMENTS"
  | "ACCES_BIBLIOTHEQUE"
  | "ACCES_REGIONS";

const PERMISSION_GROUPS: {
  label: string;
  icon: string;
  items: { key: Permission; label: string; desc: string }[];
}[] = [
  {
    label: "Ressources",
    icon: "📄",
    items: [
      { key: "CREER_RESSOURCES",       label: "Créer des ressources",      desc: "Peut publier de nouvelles fiches dans la bibliothèque" },
      { key: "MODIFIER_RESSOURCES",    label: "Modifier des ressources",   desc: "Peut éditer les ressources existantes" },
      { key: "SUPPRIMER_RESSOURCES",   label: "Supprimer des ressources",  desc: "Peut supprimer définitivement des ressources" },
      { key: "IMPORTER_MEDIAS",        label: "Importer des médias",       desc: "Peut uploader des images, bannières et miniatures" },
    ],
  },
  {
    label: "Panneau d'administration",
    icon: "🛡️",
    items: [
      { key: "VOIR_TABLEAU_BORD",      label: "Tableau de bord",           desc: "Accès aux statistiques du panneau admin" },
      { key: "GERER_UTILISATEURS",     label: "Gérer les utilisateurs",    desc: "Peut consulter, bannir et modifier les membres" },
      { key: "GERER_RESSOURCES_ADMIN", label: "Gérer les ressources (admin)", desc: "Accès à la section ressources du panneau admin" },
    ],
  },
  {
    label: "Accès aux pages",
    icon: "🗺️",
    items: [
      { key: "ACCES_BIBLIOTHEQUE",     label: "Bibliothèque",              desc: "Accès à la page bibliothèque nationale" },
      { key: "ACCES_REGIONS",          label: "Pages régions",             desc: "Accès aux pages des 13 régions" },
      { key: "ACCES_EVENEMENTS",       label: "Événements",                desc: "Accès à la page des événements" },
    ],
  },
];

// ── Types ────────────────────────────────────────────────────────────────────

type User = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  emailVerified: boolean;
  customPermissions: string | null;
  createdAt: string;
};

const DEFAULT_PAGE_PERMISSIONS: Permission[] = [
  "ACCES_BIBLIOTHEQUE",
  "ACCES_REGIONS",
  "ACCES_EVENEMENTS",
];

function parsePermissions(raw: string | null | undefined): Permission[] {
  try { return JSON.parse(raw ?? "[]"); } catch { return []; }
}

// ── Composant ────────────────────────────────────────────────────────────────

export default function AdminUtilisateurs() {
  const { data: session } = useSession();
  const [users, setUsers]               = useState<User[]>([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage]           = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal droits
  const [editingUser, setEditingUser]   = useState<User | null>(null);
  const [editRole, setEditRole]         = useState<string>("user");
  const [editPerms, setEditPerms]       = useState<Permission[]>([]);
  const [savingPerms, setSavingPerms]   = useState(false);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleAction(userId: string, action: string) {
    setActionLoading(`${userId}-${action}`);
    setMessage(null);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: "success", text: "Action effectuée avec succès." });
      await fetchUsers();
    } else {
      setMessage({ type: "error", text: data.message });
    }
    setActionLoading(null);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setEditRole(user.role ?? "user");
    const existing = parsePermissions(user.customPermissions);
    // Ajoute les accès aux pages par défaut s'ils ne sont pas déjà définis
    const withDefaults = Array.from(new Set([...DEFAULT_PAGE_PERMISSIONS, ...existing]));
    setEditPerms(withDefaults);
    setMessage(null);
  }

  function closeEdit() {
    setEditingUser(null);
    setEditPerms([]);
  }

  function togglePerm(perm: Permission) {
    setEditPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  }

  async function savePermissions() {
    if (!editingUser) return;
    setSavingPerms(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: editingUser.id,
        action: "updatePermissions",
        role: editRole,
        permissions: editPerms,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: "success", text: `Droits de ${editingUser.name} mis à jour.` });
      await fetchUsers();
      closeEdit();
    } else {
      setMessage({ type: "error", text: data.message });
    }
    setSavingPerms(false);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Utilisateurs</h1>
        <p className={styles.pageSubtitle}>{users.length} membre{users.length > 1 ? "s" : ""} inscrit{users.length > 1 ? "s" : ""}</p>
      </div>

      {message && (
        <p className={message.type === "success" ? styles.successMsg : styles.errorMsg}>
          {message.text}
        </p>
      )}

      <div className={styles.tableCard} style={{ marginTop: "1rem" }}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Liste des membres</h2>
        </div>

        {loading ? (
          <p style={{ padding: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>Chargement…</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Droits</th>
                  <th>Statut</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const perms = parsePermissions(user.customPermissions);
                  return (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600 }}>
                        {user.name}
                        {user.id === session?.user.id && (
                          <span style={{ marginLeft: "0.4rem", fontSize: "0.7rem", color: "#9ca3af" }}>(vous)</span>
                        )}
                      </td>
                      <td style={{ color: "#6b7280" }}>{user.email}</td>
                      <td>
                        {user.role === "founder" ? (
                          <span className={styles.roleAdmin} style={{ background: "#fef3c7", color: "#92400e", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            👑 Fondateur
                          </span>
                        ) : user.role === "admin" ? (
                          <span className={styles.roleAdmin}>Administrateur</span>
                        ) : (
                          <span className={styles.roleUser}>Membre</span>
                        )}
                      </td>
                      <td>
                        {perms.length > 0 ? (
                          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                            {perms.length} droit{perms.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#d1d5db" }}>—</span>
                        )}
                      </td>
                      <td>
                        {user.banned ? (
                          <span className={styles.roleBanned}>Banni</span>
                        ) : (
                          <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>Actif</span>
                        )}
                      </td>
                      <td style={{ color: "#6b7280" }}>{formatDate(user.createdAt)}</td>
                      <td>
                        {user.role === "founder" ? (
                          <span style={{ fontSize: "0.78rem", color: "#b8933a", fontWeight: 600 }}>
                            👑 Compte verrouillé
                          </span>
                        ) : user.id !== session?.user.id ? (
                          <div className={styles.actionsCell}>
                            <button
                              className={styles.btnAction}
                              onClick={() => openEdit(user)}
                            >
                              ✏️ Modifier
                            </button>
                            {!user.banned ? (
                              <button
                                className={`${styles.btnAction} ${styles.btnActionDanger}`}
                                disabled={actionLoading === `${user.id}-ban`}
                                onClick={() => handleAction(user.id, "ban")}
                              >
                                Bannir
                              </button>
                            ) : (
                              <button
                                className={styles.btnAction}
                                disabled={actionLoading === `${user.id}-unban`}
                                onClick={() => handleAction(user.id, "unban")}
                              >
                                Débannir
                              </button>
                            )}
                            <button
                              className={`${styles.btnAction} ${styles.btnActionDanger}`}
                              disabled={actionLoading === `${user.id}-delete`}
                              onClick={() => {
                                if (confirm(`Supprimer définitivement ${user.name} ?`)) {
                                  handleAction(user.id, "delete");
                                }
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>—</span>
                        )}
                        
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL DROITS ── */}
      {editingUser && (
        <div className={permStyles.overlay} onClick={closeEdit}>
          <div className={permStyles.modal} onClick={(e) => e.stopPropagation()}>

            {/* En-tête */}
            <div className={permStyles.header}>
              <div>
                <h2 className={permStyles.title}>Droits de {editingUser.name}</h2>
                <p className={permStyles.subtitle}>{editingUser.email}</p>
              </div>
              <button className={permStyles.closeBtn} onClick={closeEdit} aria-label="Fermer">✕</button>
            </div>

            {/* Rôle */}
            <div className={permStyles.section}>
              <h3 className={permStyles.sectionTitle}>👤 Rôle principal</h3>
              <div className={permStyles.roleRow}>
                <label className={`${permStyles.roleOption} ${editRole === "user" ? permStyles.roleOptionActive : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={editRole === "user"}
                    onChange={() => setEditRole("user")}
                    className={permStyles.radioInput}
                  />
                  <div>
                    <span className={permStyles.roleLabel}>Membre</span>
                    <span className={permStyles.roleDesc}>Accès standard au site</span>
                  </div>
                </label>
                <label className={`${permStyles.roleOption} ${editRole === "admin" ? permStyles.roleOptionActive : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={editRole === "admin"}
                    onChange={() => setEditRole("admin")}
                    className={permStyles.radioInput}
                  />
                  <div>
                    <span className={permStyles.roleLabel}>Administrateur</span>
                    <span className={permStyles.roleDesc}>Accès complet à tout le panneau admin</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Permissions granulaires */}
            <div className={permStyles.section}>
              <h3 className={permStyles.sectionTitle}>🔑 Droits spécifiques</h3>
              <p className={permStyles.sectionHint}>
                Ces droits s&apos;appliquent en complément du rôle. Un administrateur a tous les droits par défaut.
              </p>
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.label} className={permStyles.group}>
                  <p className={permStyles.groupTitle}>{group.icon} {group.label}</p>
                  <div className={permStyles.checkList}>
                    {group.items.map((item) => (
                      <label key={item.key} className={`${permStyles.checkItem} ${editPerms.includes(item.key) ? permStyles.checkItemActive : ""}`}>
                        <input
                          type="checkbox"
                          checked={editPerms.includes(item.key)}
                          onChange={() => togglePerm(item.key)}
                          className={permStyles.checkbox}
                        />
                        <div className={permStyles.checkInfo}>
                          <span className={permStyles.checkLabel}>{item.label}</span>
                          <span className={permStyles.checkDesc}>{item.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className={permStyles.footer}>
              <button className={permStyles.btnCancel} onClick={closeEdit}>Annuler</button>
              <button className={permStyles.btnSave} onClick={savePermissions} disabled={savingPerms}>
                {savingPerms ? "Enregistrement…" : "Enregistrer les droits"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
