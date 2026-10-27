export const SUPER_ADMIN_EMAIL = "kathirkalidass005@gmail.com";

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

export function resolveRole(email: string | null | undefined, role?: string): string {
  if (isSuperAdminEmail(email)) {
    return "SUPER_ADMIN";
  }

  return (role ?? "USER").toString().toUpperCase();
}

export function hasAdminAuthority(role: string | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}