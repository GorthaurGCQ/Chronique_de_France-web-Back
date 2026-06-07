// Utilitaire auth admin partagé par les services admin

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "founder";
}
