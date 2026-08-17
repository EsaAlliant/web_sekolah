import { redirect } from "next/navigation";
import { AdminUserForm } from "@/components/directory/AdminUserForm";
import { createServerClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/permissions";

export default async function NewAdminUserPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("admin_profiles").select("role").eq("id", user.id).single();
  const role = (profile?.role ?? "super_admin") as AdminRole;
  if (role !== "super_admin") redirect("/admin/dashboard?denied=1");

  return (
    <div>
      <h1 className="h4 mb-4">Tambah Admin</h1>
      <div className="admin-stat-card text-start">
        <AdminUserForm />
      </div>
    </div>
  );
}
