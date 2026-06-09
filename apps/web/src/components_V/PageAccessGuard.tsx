// =============================================================================
// COMPOSANT — Garde d'accès client (session + droits granulaires)
// =============================================================================

"use client";

// Module : node_modules/react
import { useEffect, useState, type ReactNode } from "react";
// Auth : src/lib/auth/auth-client.ts
import { useSession } from "@/lib/auth/auth-client";
// Module : src/lib/permissions.shared.ts
import type { Permission } from "@/lib/permissions.shared";
import { canAccessPage, isPrivilegedRole } from "@/lib/permissions.shared";
// Composant : src/components_V/LoginRequiredScreen.tsx
import LoginRequiredScreen from "@/components_V/LoginRequiredScreen";
// Composant : src/components_V/AccessDeniedScreen.tsx
import AccessDeniedScreen from "@/components_V/AccessDeniedScreen";
// Style : src/app/(V)/dashboard/dashboard.module.css
import loadingStyles from "@/app/(V)/dashboard/dashboard.module.css";

type Props = {
  permission?: Permission;
  sectionTitle?: string;
  children: ReactNode;
};

export default function PageAccessGuard({
  permission,
  sectionTitle,
  children,
}: Props) {
  const { data: session, isPending } = useSession();
  const [permissions, setPermissions] = useState<Permission[] | null>(null);
  const [accessLoaded, setAccessLoaded] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setPermissions([]);
      setAccessLoaded(true);
      return;
    }

    if (isPrivilegedRole(session.user.role)) {
      setPermissions([]);
      setAccessLoaded(true);
      return;
    }

    let cancelled = false;
    fetch("/api/profile/access")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setPermissions(d.success ? (d.data.permissions ?? []) : []);
          setAccessLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPermissions([]);
          setAccessLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user?.id, session?.user?.role]);

  if (isPending || !accessLoaded) {
    return (
      <div className={loadingStyles.loading}>
        <span className={loadingStyles.loadingDot} />
      </div>
    );
  }

  if (!session?.user) {
    return <LoginRequiredScreen sectionTitle={sectionTitle} />;
  }

  if (permission && !isPrivilegedRole(session.user.role)) {
    const allowed = canAccessPage(
      true,
      session.user.role,
      permissions ?? [],
      permission,
    );
    if (!allowed) {
      return <AccessDeniedScreen sectionTitle={sectionTitle} />;
    }
  }

  return children;
}
