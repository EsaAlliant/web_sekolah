export type AdminRole = "super_admin" | "kejur" | "wakur";

// Prefix path admin yang boleh diakses tiap role. "*" berarti boleh semua.
// Tambahin path baru di sini kalau nanti ada modul admin baru yang perlu
// dibatasi juga untuk kejur/wakur.
const ROLE_ACCESS: Record<AdminRole, string[]> = {
  super_admin: ["*"],
  kejur: ["/admin/dashboard", "/admin/majors", "/admin/gallery", "/admin/news", "/admin/announcements"],
  wakur: ["/admin/dashboard", "/admin/agenda", "/admin/gallery", "/admin/news", "/admin/announcements"],
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  kejur: "Kepala Jurusan",
  wakur: "Wakil Kurikulum",
};

export function canAccessPath(role: AdminRole, pathname: string): boolean {
  const allowed = ROLE_ACCESS[role] ?? [];
  if (allowed.includes("*")) return true;
  return allowed.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function hasPermission(role: AdminRole, moduleHref: string): boolean {
  return canAccessPath(role, moduleHref);
}
