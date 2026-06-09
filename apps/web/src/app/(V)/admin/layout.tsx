// =============================================================================
// LAYOUT ADMIN — Sidebar + garde d'accès (admin | founder | droits granulaires)
// Redirige si l'utilisateur n'a pas les droits requis
// =============================================================================

"use client";

// Module : node_modules/react
import { useEffect, useState } from "react";
// Module : node_modules/next/link
import Link from "next/link";
// Module : node_modules/next/navigation
import { usePathname, useRouter } from "next/navigation";
// Auth : src/lib/auth/auth-client.ts
import { useSession } from "@/lib/auth/auth-client";
// Module : src/lib/permissions.shared.ts
import {
  type Permission,
  isPrivilegedRole,
  hasAdminPanelAccess,
  canAccessAdminRoute,
} from "@/lib/permissions.shared";
// Style : src/app/(V)/admin/admin.module.css
import styles from "./admin.module.css";
// Composant : src/components_V/icons/AppIcon.tsx
import AppIcon from "@/components_V/icons/AppIcon";

const sidebarLinks: {
  href: string;
  label: string;
  permission?: Permission;
  adminOnly?: boolean;
  icon: React.ReactNode;
}[] = [
  {
    href: "/admin",
    label: "Tableau de bord",
    permission: "VOIR_TABLEAU_BORD",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    permission: "GERER_UTILISATEURS",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/admin/ressources",
    label: "Ressources",
    permission: "GERER_RESSOURCES_ADMIN",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/evenements",
    label: "Événements",
    adminOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/admin/journal",
    label: "Journal d'audit",
    adminOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [accessLoaded, setAccessLoaded] = useState(false);

  const role = session?.user.role;
  const isPrivileged = isPrivilegedRole(role);

  useEffect(() => {
    if (!session?.user || isPrivileged) return;

    let cancelled = false;
    fetch("/api/profile/access")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.success) setPermissions(d.data.permissions ?? []);
      })
      .catch(() => {
        if (!cancelled) setPermissions([]);
      })
      .finally(() => {
        if (!cancelled) setAccessLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, isPrivileged]);

  const permissionsReady = isPrivileged || accessLoaded;

  const hasPanelAccess =
    isPrivileged || (permissionsReady && hasAdminPanelAccess(role, permissions));

  const visibleLinks = sidebarLinks.filter((link) => {
    if (isPrivileged) return true;
    if (link.adminOnly) return false;
    return canAccessAdminRoute(role, permissions, link.href);
  });

  const canViewCurrentPage =
    isPrivileged || canAccessAdminRoute(role, permissions, pathname);

  useEffect(() => {
    if (isPending || !permissionsReady) return;
    if (!session) {
      router.replace("/connexion");
      return;
    }
    if (!hasPanelAccess) {
      router.replace("/profil?erreur=acces");
      return;
    }
    if (!canViewCurrentPage && visibleLinks.length > 0) {
      router.replace(visibleLinks[0].href);
    }
  }, [
    session,
    isPending,
    accessLoaded,
    permissionsReady,
    hasPanelAccess,
    canViewCurrentPage,
    visibleLinks,
    router,
  ]);

  if (isPending || (session && !isPrivileged && !permissionsReady)) {
    return (
      <div className={styles.loadingScreen}>
        <p>Vérification des droits…</p>
      </div>
    );
  }

  if (!session || !hasPanelAccess) {
    return null;
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Administration</span>
          <span className={styles.sidebarBadge}>
            {session.user.role === "founder" ? (
              <>
                <AppIcon name="crown" size={14} className={styles.sidebarBadgeIcon} />
                Fondateur
              </>
            ) : isPrivileged ? "Admin" : "Modérateur"}
          </span>
        </div>

        <nav className={styles.sidebarNav}>
          {visibleLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.sidebarLink} ${pathname === href ? styles.sidebarLinkActive : ""}`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Retour au site
          </Link>
        </div>
      </aside>

      <main className={styles.adminMain}>{children}</main>
    </div>
  );
}
