import { createServerClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/permissions";

export interface CurrentAdmin {
  id: string;
  email: string;
  fullName: string | null;
  role: AdminRole;
}

// Ambil data admin yang lagi login dari session cookie (bukan service
// role) — aman dipanggil dari Server Component maupun Server Action.
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  // Belum punya baris di admin_profiles dianggap super_admin, konsisten
  // sama fallback yang sudah dipakai di middleware & admin/layout.tsx.
  const role = (profile?.role ?? "super_admin") as AdminRole;

  return { id: user.id, email: user.email ?? "", fullName: profile?.full_name ?? null, role };
}

type RequireSuperAdminResult = { admin: CurrentAdmin } | { error: string };

// Dipanggil di awal tiap Server Action yang mengelola akun admin lain.
// Ini lapisan pengaman tambahan di samping middleware (yang sudah blokir
// akses /admin/users untuk role selain super_admin) — supaya Server
// Action-nya sendiri juga nggak bisa dipanggil langsung dari luar UI.
export async function requireSuperAdmin(): Promise<RequireSuperAdminResult> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return { error: "Sesi login tidak ditemukan, silakan login ulang." };
  }

  if (admin.role !== "super_admin") {
    return { error: "Hanya Super Admin yang boleh mengelola akun admin." };
  }

  return { admin };
}
