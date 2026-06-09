// =============================================================================
// COMPOSANT RSC — Garde d'accès page (login requis + droits granulaires)
// =============================================================================

// Module : node_modules/react
import type { ReactNode } from "react";
// Module : src/lib/permissions.shared.ts
import type { Permission } from "@/lib/permissions.shared";
// Service : src/lib/services_M/permissions.service.ts
import { checkPageAccess } from "@/lib/services_M/permissions.service";
// Composant : src/components_V/LoginRequiredScreen.tsx
import LoginRequiredScreen from "@/components_V/LoginRequiredScreen";
// Composant : src/components_V/AccessDeniedScreen.tsx
import AccessDeniedScreen from "@/components_V/AccessDeniedScreen";

type Props = {
  permission: Permission;
  sectionTitle?: string;
  children: ReactNode;
};

export default async function PageAccessGate({
  permission,
  sectionTitle,
  children,
}: Props) {
  const access = await checkPageAccess(permission);
  if (access.kind === "guest") {
    return <LoginRequiredScreen sectionTitle={sectionTitle} />;
  }
  if (access.kind === "denied") {
    return <AccessDeniedScreen sectionTitle={sectionTitle} />;
  }
  return children;
}
