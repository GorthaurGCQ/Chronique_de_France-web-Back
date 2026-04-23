"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import styles from "../admin.module.css";

type User = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  emailVerified: boolean;
  createdAt: string;
};

export default function AdminUtilisateurs() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

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
                  <th>Statut</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>
                      {user.name}
                      {user.id === session?.user.id && (
                        <span style={{ marginLeft: "0.4rem", fontSize: "0.7rem", color: "#9ca3af" }}>(vous)</span>
                      )}
                    </td>
                    <td style={{ color: "#6b7280" }}>{user.email}</td>
                    <td>
                      <span className={user.role === "admin" ? styles.roleAdmin : styles.roleUser}>
                        {user.role === "admin" ? "Administrateur" : "Membre"}
                      </span>
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
                      {user.id !== session?.user.id ? (
                        <div className={styles.actionsCell}>
                          {user.role !== "admin" ? (
                            <button
                              className={styles.btnAction}
                              disabled={actionLoading === `${user.id}-makeAdmin`}
                              onClick={() => handleAction(user.id, "makeAdmin")}
                            >
                              → Admin
                            </button>
                          ) : (
                            <button
                              className={styles.btnAction}
                              disabled={actionLoading === `${user.id}-makeUser`}
                              onClick={() => handleAction(user.id, "makeUser")}
                            >
                              → Membre
                            </button>
                          )}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
