import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import type { AdminProfileRow } from "@/types/database";
import type { AdminUser } from "@/types/admin-user";

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createServerClient();
  const { data: profiles, error } = await supabase
    .from("admin_profiles")
    .select("id, full_name, role, created_at")
    .order("created_at");

  if (error) {
    console.error("getAdminUsers error:", error.message);
    return [];
  }

  // Email cuma ada di auth.users, bukan admin_profiles — perlu service
  // role buat ambil daftar user auth, lalu digabung sama role/nama-nya.
  const adminClient = createAdminClient();
  const { data: authList, error: authError } = await adminClient.auth.admin.listUsers({ perPage: 1000 });

  if (authError) {
    console.error("getAdminUsers (auth) error:", authError.message);
  }

  const emailById = new Map((authList?.users ?? []).map((authUser) => [authUser.id, authUser.email ?? ""]));

  return (profiles as AdminProfileRow[]).map((profile) => ({
    id: profile.id,
    email: emailById.get(profile.id) ?? "",
    fullName: profile.full_name ?? "",
    role: profile.role,
    createdAt: profile.created_at,
  }));
}

export async function getAdminUserById(id: string): Promise<AdminUser | undefined> {
  const admins = await getAdminUsers();
  return admins.find((admin) => admin.id === id);
}
